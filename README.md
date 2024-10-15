# Responsive Particle Pattern Animation Library

This library provides an interactive particle animation that can form various patterns based on user-defined images. The particles respond to mouse movement and can form different patterns with smooth transitions.

## Features
- **Interactive Particles**: Particles react to the mouse position, creating a dynamic interaction effect.
- **Pattern Formation**: Load images as patterns, and particles will rearrange to match the pattern.
- **Smooth Transitions**: Particles gradually move and adjust their opacity to form patterns or return to their original state.
- **Customizable**: The number of particles, their size, and other parameters can be customized to fit different use cases.

## Installation
Include the JavaScript file in your HTML project to start using the library.

```html
<script src="path/to/this script"></script>
```

## Usage
To create a new particle animation and add it to a specific HTML canvas element:

```javascript
const particleCanvas = document.getElementById('particle-canvas');
const animation = createPattern(particleCanvas, 1200, 2.5);
```

Here is an example of using the `createPattern()` function:

- **Parameters**:
  - `canvas`: The canvas element where the animation will be rendered.
  - `baseParticles`: The base number of particles to use in the animation.
  - `particleSize`: The size of each particle.

After creating the animation, you can handle pattern changes by calling `handlePatternShift()`:

```javascript
document.getElementById('button1').addEventListener('click', () => {
    animation.handlePatternShift('pattern1.png');
});
```

This function loads an image and makes the particles rearrange to form the pattern.

## Example
```html
<div id="particle-container">
    <canvas id="particle-canvas"></canvas>
</div>
<script src="script.js"></script>
<script>
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
</script>
```

## Customization
- **Particle Count**: The number of particles is defined by the `baseParticles` parameter in `createPattern()`.
- **Particle Size**: Adjust the size of each particle with the `particleSize` parameter.
- **Pattern Switching**: Use `handlePatternShift(imageUrl)` to change the pattern formed by the particles.

## Development Notes
- The `updateTargetPoints()` function calculates the positions of particles based on the provided image. The image is matrixized, and particles are distributed to match the matrix values.
- If new target points exceed the existing particle count, extra particles are generated. If fewer target points are needed, excess particles are removed.
- The `Quadtree` class is used to optimize the particle interactions by organizing particles into spatial divisions, which makes querying efficient for repulsion calculations.


## Contributions
Contributions are welcome! If you'd like to add features, optimize the code, or fix bugs, feel free to submit a pull request.


# 响应式粒子图案动画库

此库提供交互式粒子动画，可根据用户定义的图像形成各种图案。粒子响应鼠标移动，可形成具有平滑过渡的不同图案。

## 功能
- **交互式粒子**：粒子对鼠标位置做出反应，产生动态交互效果。
- **图案形成**：将图像加载为图案，粒子将重新排列以匹配图案。
- **平滑过渡**：粒子逐渐移动并调整其不透明度以形成图案或返回其原始状态。
- **可自定义**：可以自定义粒子数量、大小和其他参数以适应不同的用例。

## 安装
将 JavaScript 文件包含在 HTML 项目中即可开始使用该库。

```html
<script src="path/to/this script"></script>
```

## 用法
要创建新的粒子动画并将其添加到特定的 HTML 画布元素：

```javascript
constarticleCanvas = document.getElementById('particle-canvas');
const animation = createPattern(particleCanvas, 1200, 2.5);
```

以下是使用`createPattern()`函数的示例：

- **参数**:
- `canvas`：将渲染动画的画布元素。
- `baseParticles`：动画中使用的粒子基数。
- `particleSize`：每个粒子的大小。

创建动画后，您可以通过调用`handlePatternShift()`来处理图案变化：

```javascript
document.getElementById('button1').addEventListener('click', () => {
animation.handlePatternShift('pattern1.png');
});
```

此函数加载图像并使粒子重新排列以形成图案。

## 示例
```html
<div id="particle-container">
<canvas id="particle-canvas"></canvas>
</div>
<script src="script.js"></script>
<script>
constarticleCanvas = document.getElementById('particle-canvas');
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
</script>
```

## 自定义
- **粒子数量**：粒子数量由 `createPattern()` 中的 `baseParticles` 参数定义。
- **粒子大小**：使用 `particleSize` 参数调整每个粒子的大小。
- **图案切换**：使用 `handlePatternShift(imageUrl)` 来改变粒子形成的图案。

## 开发说明
- `updateTargetPoints()` 函数根据提供的图像计算粒子的位置。图像被矩阵化，粒子分布以匹配矩阵值。
- 如果新的目标点超过现有的粒子数量，则会产生额外的粒子。如果需要更少的目标点，则移除多余的粒子。
