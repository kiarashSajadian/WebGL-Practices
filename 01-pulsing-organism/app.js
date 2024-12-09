// Import Three.js library
import * as THREE from "three";
// Import OrbitControls for interactive camera control
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// Import custom shader files
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
// Import texture image
import testTexture from "./mokasare.jpg";
// Import Dat.GUI for GUI controls
import { GUI } from "dat.gui";

// Define the main Sketch class for creating a 3D scene
export default class Sketch {
  constructor(options) {
    this.container = options.domElement;

    if (!this.container) {
      console.error("Container element not found");
      return;
    }

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      60,
      this.width / this.height,
      0.01,
      10
    );
    this.camera.position.z = 2;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Initialize time tracker and noise speed
    this.time = 0;
    this.noiseSpeed = 0.15; // Default noise speed
    this.color = { r: 0.1, g: 0.1, b: 0.85 }; // Default color

    this.resize();
    this.addObjects();

    // Set up GUI for changing noise speed and color
    this.setupGUI();

    // Bind the render method to maintain correct 'this' context
    this.render = this.render.bind(this);

    // Start the render loop
    this.render();

    // Set up resize event listener
    this.setupResize();
  }

  setupGUI() {
    const gui = new GUI();
    gui.add(this, "noiseSpeed", 0.01, 0.5).name("Noise Speed");

    const colorFolder = gui.addFolder("Color");
    colorFolder
      .add(this.color, "r", 0, 1)
      .name("Red")
      .onChange(this.updateColor.bind(this));
    colorFolder
      .add(this.color, "g", 0, 1)
      .name("Green")
      .onChange(this.updateColor.bind(this));
    colorFolder
      .add(this.color, "b", 0, 1)
      .name("Blue")
      .onChange(this.updateColor.bind(this));
    colorFolder.open();
  }

  updateColor() {
    this.material.uniforms.uColor.value = new THREE.Color(
      this.color.r,
      this.color.g,
      this.color.b
    );
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    if (this.material && this.material.uniforms.resolution) {
      this.material.uniforms.resolution.value.set(this.width, this.height);
    }
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  addObjects() {
    // Create a sphere geometry
    this.geometry = new THREE.SphereGeometry(0.5, 130, 130);

    // Create a ShaderMaterial
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(testTexture) },
        resolution: { value: new THREE.Vector2(this.width, this.height) },
        uColor: {
          value: new THREE.Color(this.color.r, this.color.g, this.color.b),
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    // Create a mesh by combining geometry and material
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // Add the mesh to the scene
    this.scene.add(this.mesh);
  }

  render() {
    // Increment time based on noise speed
    this.time += this.noiseSpeed;

    // Update shader uniforms
    this.material.uniforms.time.value = this.time;

    // Update OrbitControls
    this.controls.update();

    // Render the scene with the current camera
    this.renderer.render(this.scene, this.camera);

    // Request next animation frame to create a loop
    requestAnimationFrame(this.render);
  }
}

// Find the container element and create a new Sketch instance if it exists
const container = document.getElementById("container");
if (container) {
  new Sketch({
    domElement: container,
  });
} else {
  console.error("Container element not found");
}
