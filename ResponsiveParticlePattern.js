class Quadtree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    subdivide() {
        const { x, y, w, h } = this.boundary;
        this.northeast = new Quadtree({ x: x + w / 2, y: y - h / 2, w: w / 2, h: h / 2 }, this.capacity);
        this.northwest = new Quadtree({ x: x - w / 2, y: y - h / 2, w: w / 2, h: h / 2 }, this.capacity);
        this.southeast = new Quadtree({ x: x + w / 2, y: y + h / 2, w: w / 2, h: h / 2 }, this.capacity);
        this.southwest = new Quadtree({ x: x - w / 2, y: y + h / 2, w: w / 2, h: h / 2 }, this.capacity);
        this.divided = true;
    }

    insert(point) {
        if (!this.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }

        if (!this.divided) {
            this.subdivide();
        }

        if (this.northeast.insert(point)) return true;
        if (this.northwest.insert(point)) return true;
        if (this.southeast.insert(point)) return true;
        if (this.southwest.insert(point)) return true;
    }

    contains(point) {
        const { x, y, w, h } = this.boundary;
        return (point.x >= x - w && point.x < x + w && point.y >= y - h && point.y < y + h);
    }

    query(range, found) {
        if (!found) {
            found = [];
        }

        if (!this.intersects(range)) {
            return found;
        }

        for (let p of this.points) {
            if (range.contains(p)) {
                found.push(p);
            }
        }

        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }

        return found;
    }

    intersects(range) {
        const { x, y, w, h } = this.boundary;
        return !(range.x - range.w > x + w ||
                 range.x + range.w < x - w ||
                 range.y - range.h > y + h ||
                 range.y + range.h < y - h);
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return (point.x >= this.x - this.w &&
                point.x < this.x + this.w &&
                point.y >= this.y - this.h &&
                point.y < this.y + this.h);
    }
}

class Particle {
    constructor(x, y, size, isExtra = false) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.startX = x;
        this.startY = y;
        this.alpha = 0;
        this.targetAlpha = isExtra ? 0 : 0;
        this.vx = 0;
        this.vy = 0;
        this.isExtra = isExtra;
    }

    draw(context) {
        context.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        context.fillRect(this.x, this.y, this.size, this.size);
    }

    update(targetX, targetY, targetAlpha, quadtree, mouseX, mouseY) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = distance * 0.002;
        const angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force;
        this.vy += Math.sin(angle) * force;

        // Repulsion calculation
        const range = new Rectangle(this.x, this.y, 10, 10);
        const points = quadtree.query(range);
        points.forEach(particle => {
            if (particle !== this) {
                const dx = this.x - particle.x;
                const dy = this.y - particle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 3) {
                    const repulse = (3 - dist) * 0.01;
                    this.vx += dx / dist * repulse;
                    this.vy += dy / dist * repulse;
                }
            }
        });

        // Mouse repulsion
        if (mouseX >= 0 && mouseY >= 0) {
            const mdx = this.x - mouseX;
            const mdy = this.y - mouseY;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            const repulse = Math.min(10, 800 / (mdist + 1) ** 1.55);
            this.vx += mdx / mdist * repulse * 0.05;
            this.vy += mdy / mdist * repulse * 0.05;
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Damping
        this.vx *= 0.9;
        this.vy *= 0.9;

        // Smooth alpha adjustment
        this.alpha += (targetAlpha - this.alpha) * 0.02;
    }

    reset() {
        const dx = this.startX - this.x;
        const dy = this.startY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = distance * 0.002;
        const angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force;
        this.vy += Math.sin(angle) * force;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Damping
        this.vx *= 0.9;
        this.vy *= 0.9;

        // Smooth alpha adjustment
        this.alpha += (this.targetAlpha - this.alpha) * 0.05;
    }
}

function createPattern(canvas, baseParticles, particleSize) {
    const context = canvas.getContext('2d');
    let containerSize = canvas.offsetWidth;
    let particles = [];
    let targetImage = new Image();
    let targetPoints = [];
    let currentPattern = null;
    let showPattern = false;
    let mouseX = -1;
    let mouseY = -1;
    
    canvas.width = containerSize;
    canvas.height = containerSize;

    function initParticles() {
        particles = [];
        for (let i = 0; i < baseParticles; i++) {
            const x = Math.random() * containerSize;
            const y = Math.random() * containerSize;
            particles.push(new Particle(x, y, particleSize));
            particles[i].alpha = 0.5; // Initial alpha for visibility
        }
    }

    function updateTargetPoints() {
		const tempCanvas = document.createElement('canvas');
		const tempContext = tempCanvas.getContext('2d');
		tempCanvas.width = containerSize;
		tempCanvas.height = containerSize;
		tempContext.drawImage(targetImage, 0, 0, containerSize, containerSize);
		const imageData = tempContext.getImageData(0, 0, containerSize, containerSize).data;

		// 获取图像数据矩阵
		const imageMatrix = [];
		for (let y = 0; y < containerSize; y++) {
			const row = [];
			for (let x = 0; x < containerSize; x++) {
				const index = (y * containerSize + x) * 4;
				const r = imageData[index];
				const g = imageData[index + 1];
				const b = imageData[index + 2];
				const a = imageData[index + 3];
				const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
				row.push(brightness > 0.4 ? brightness : 0);
			}
			imageMatrix.push(row);
		}

		// 找到合适大小的方形矩阵
		let matrixSize = 26;
		let matrix = [];
		let step;

		do {
			matrixSize += 2;
			step = containerSize / matrixSize;
			matrix = [];
			for (let y = 0; y < matrixSize; y++) {
				const row = [];
				for (let x = 0; x < matrixSize; x++) {
					const px = Math.floor(x * step);
					const py = Math.floor(y * step);
					row.push(imageMatrix[py][px]);
				}
				matrix.push(row);
			}
		} while (matrix.flat().filter(val => val > 0).length < baseParticles);

		// 将粒子移动到对应位置
		targetPoints = [];
		for (let y = 0; y < matrixSize; y++) {
			for (let x = 0; x < matrixSize; x++) {
				if (matrix[y][x] > 0) {
					const px = Math.floor(x * step);
					const py = Math.floor(y * step);
					const alpha = 0.2 + (matrix[y][x] - 0.4) * (1.0 - 0.2) / (1.0 - 0.4);
					targetPoints.push({ x: px, y: py, alpha: alpha });
				}
			}
		}

		// 如果目标点数量多于粒子数量，生成额外的粒子
		if (targetPoints.length > baseParticles) {
			extraParticles = [];
			for (let i = baseParticles; i < targetPoints.length; i++) {
				const x = Math.random() * containerSize;
				const y = Math.random() * containerSize;
				const extraParticle = new Particle(x, y, true);
				extraParticle.targetAlpha = 0.1;
				extraParticles.push(extraParticle);
			}
			particles = particles.concat(extraParticles);
		}

		// 如果目标点数量少于粒子数量，移除多余的粒子(弃用)
		/*
		if (targetPoints.length < baseParticles) {
			particles = particles.slice(0, targetPoints.length);
		}
		*/
		
		// 更新粒子位置和透明度
		particles.forEach((particle, index) => {
			if (targetPoints[index]) {
				particle.targetAlpha = targetPoints[index].alpha;
				particle.update(targetPoints[index].x, targetPoints[index].y, targetPoints[index].alpha, new Quadtree({ x: containerSize / 2, y: containerSize / 2, w: containerSize / 2, h: containerSize / 2 }, 4));
			}
		});
}

    function loadPattern(patternUrl) {
        targetImage.src = patternUrl;
        targetImage.onload = () => {
            updateTargetPoints();
        };
    }

    function draw() {
        context.clearRect(0, 0, containerSize, containerSize);
        particles.forEach(particle => particle.draw(context));
    }

    function update() {
        const quadtree = new Quadtree({ x: containerSize / 2, y: containerSize / 2, w: containerSize / 2, h: containerSize / 2 }, 4);
        particles.forEach(p => quadtree.insert(p));

        particles.forEach((particle, index) => {
            if (showPattern && targetPoints[index]) {
                particle.targetAlpha = targetPoints[index].alpha;
                particle.update(targetPoints[index].x, targetPoints[index].y, targetPoints[index].alpha, quadtree, mouseX, mouseY);
            } else {
                particle.reset();
            }
        });
    }

    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }

    function handlePatternShift(imageUrl) {
        if (currentPattern === imageUrl) {
            showPattern = false;
            currentPattern = null;
            particles.forEach(particle => {
                particle.targetAlpha = 0;
                particle.reset();
            });
        } else {
			showPattern = false;
            currentPattern = null;
			particles = particles.slice(0, baseParticles);  //删除多余粒子
            particles.forEach(particle => {
                particle.targetAlpha = 0;
                particle.reset();
			});
			setTimeout(function(){
				showPattern = true;
            	currentPattern = imageUrl;
            	loadPattern(imageUrl);
			},50);
        }
    }

    initParticles();
    animate();

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouseX = -1;
        mouseY = -1;
    });

    return {
        handlePatternShift,
    };
}

// Usage example:
/*
const particleCanvas = document.getElementById('particle-canvas');
const animation = createPattern(particleCanvas, 1200, 2.5);

document.getElementById('button1').addEventListener('click', () => {
    animation.handlePatternShift('pattern1.png');
});
document.getElementById('button2').addEventListener('click', () => {
    animation.handlePatternShift('pattern2.png');
});
document.getElementById('button3').addEventListener('click', () => {
    animation.handlePatternShift('pattern3.png');
});
*/