# Particle Animation Library

This library provides an interactive particle animation that can form various patterns based on user-defined images. The particles respond to mouse movement and can form different patterns with smooth transitions.

## Features
- **Interactive Particles**: Particles react to mouse position, creating a dynamic interaction effect.
- **Pattern Formation**: Load images as patterns, and particles will rearrange to match the pattern.
- **Smooth Transitions**: Particles gradually move and adjust their opacity to form patterns or return to their original state.
- **Customizable**: The number of particles, their size, and other parameters can be customized to fit different use cases.

## Installation
Include the JavaScript file in your HTML project to start using the library.

```html
<script src="path/to/script.js"></script>
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


