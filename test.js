const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  animate: true
};

// Your glsl code
const frag = glsl(`
  precision highp float;

  uniform float playhead;
  varying vec2 vUv;

  void main () {
    vec3 color = 0.5 + 0.5 * cos(playhead + vUv.xyx + vec3(0.0, 2.0, 4.0));
    gl_FragColor = vec4(color, 1.0);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  const box = new THREE.SphereGeometry()
  // Create the shader and return it
  return createShader({
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      playhead: ({ playhead }) => playhead
    }
  });
};

canvasSketch(sketch, settings);
