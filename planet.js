// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require('canvas-sketch-util/random')
const palettes = require('nice-color-palettes')
const eases = require('eases')
const BezierEasing = require('bezier-easing')
const glslify = require('glslify')


const settings = {
  //dimensions: [512, 512],
  //fps: 15,
  //duration: 4,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("black", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();
 

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereBufferGeometry(1, 64, 64);

  const palette = random.pick(palettes)

  const fragmentShader = glslify(`
    varying vec2 vUv;
    varying vec3 vPosition;
    #pragma glslify: noise = require('glsl-noise/simplex/3d');

    uniform vec3 color;
    uniform float time;
    
    void main () {
     
      float offset = 0.2 * noise(vec3(vUv.xy * 2.0, time));
      //gl_FragColor = vec4(vec3(color * vUv.x + offset), 1.0);
      gl_FragColor = vec4(vec3(vPosition + offset * 5. * color), 1.0);
    }
  `);
  const vertexShader = glslify(`
    varying vec2 vUv;
    uniform float time;
    varying vec3 vPosition;

    #pragma glslify: noise = require('glsl-noise/simplex/4d');
    
    void main () {
      vUv = uv;
      vec3 pos = position.xyz;
      vPosition = position;

      pos += 0.1 * normal * noise(vec4(pos.xyz * 2.0, time / 2.0));
      pos += .2 * normal * noise(vec4(pos.xyz * 2.0, time / 2.0));

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `)
    
  const meshes = []

  const mesh = new THREE.Mesh(
    geometry,
    new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        color: { value: new THREE.Color('red')},
        time: { value: 0}
      },
    })
    );
  scene.add(mesh);
  meshes.push(mesh)

  scene.add(new THREE.AmbientLight('hsl(50, 80%, 100%)'))
  
  const light = new THREE.DirectionalLight('white', 0.3)
  light.position.set(20, 8, 0.3)
  scene.add(light)

  //const easeFn = BezierEasing(0.67, 0.03, 0.29, 0.9)

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      
      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 2.0;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(1, 1, 1);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead, time }) {
      const t = Math.sin(playhead * Math.PI)
      scene.rotation.y = time

      meshes.forEach(mesh => {
        mesh.material.uniforms.time.value = time
      })

      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);