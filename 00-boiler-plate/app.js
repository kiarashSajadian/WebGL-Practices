// Import Three.js library
import * as THREE from "three";

// Import OrbitControls for interactive camera control
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Import custom shader files
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";

// Import texture image
// import testTexture from "./mokasare.jpg";

// Define the main Sketch class for creating a 3D scene
export default class Sketch {
  // Constructor receives options for initializing the scene
  constructor(options) {
    // Get the container element where the 3D scene will be rendered
    this.container = options.domElement;

    // Check if container exists to prevent errors
    if (!this.container) {
      console.error("Container element not found");
      return;
    }

    // Calculate the width and height of the container
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    // Create a perspective camera
    this.camera = new THREE.PerspectiveCamera(
      30, // Field of view
      this.width / this.height, // Aspect ratio
      10, // Near clipping plane
      1000 // Far clipping plane
    );
    // Position the camera slightly back from the center
    this.camera.position.z = 600;

    this.camera.fov = (2 * Math.atan(this.height / 2 / 600) * 180) / Math.PI;

    // Create a new scene to hold 3D objects
    this.scene = new THREE.Scene();

    // Create a WebGL renderer with antialiasing for smoother edges
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // Set pixel ratio for sharper rendering on high DPI displays
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Add the renderer's canvas to the container
    this.container.appendChild(this.renderer.domElement);

    // Create OrbitControls for interactive camera control
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Initialize time tracker for animations
    this.time = 0;

    // Call resize method to set initial size
    this.resize();

    // Create 3D objects for the scene
    this.addObjects();

    // Bind the render method to maintain correct 'this' context
    this.render = this.render.bind(this);

    // Start the render loop
    this.render();

    // Set up resize event listener
    this.setupResize();
  }

  // Method to handle resizing
  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    // Update resolution uniform if it exists
    if (this.material && this.material.uniforms.resolution) {
      this.material.uniforms.resolution.value.set(this.width, this.height);
    }
  }

  // Method to set up resize event listener
  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  // Method to create 3D objects in the scene
  addObjects() {
    // Create a plane geometry
    this.geometry = new THREE.PlaneGeometry(300, 300, 10, 10);
    // this.geometry = new THREE.SphereGeometry(0.5, 130, 130);

    // Create a ShaderMaterial
    this.material = new THREE.ShaderMaterial({
      // wireframe: true, // Uncomment to see wireframe
      uniforms: {
        time: { value: 1.0 },
        // uTexture: { value: new THREE.TextureLoader().load(testTexture) },
        resolution: { value: new THREE.Vector2(this.width, this.height) },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    // Create a mesh by combining geometry and material
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // Add the mesh to the scene
    this.scene.add(this.mesh);
  }

  // Render method - called every animation frame
  render() {
    // Increment time
    this.time += 0.05;

    // Update shader uniforms
    this.material.uniforms.time.value = this.time;

    // Commented out rotation - currently using OrbitControls instead
    // this.mesh.rotation.x = this.time / 20;
    // this.mesh.rotation.y = this.time / 10;

    // Update OrbitControls
    this.controls.update();

    // Render the scene with the current camera
    this.renderer.render(this.scene, this.camera);

    // Request next animation frame to create a loop
    requestAnimationFrame(this.render);
  }
}

// Find the container element
const container = document.getElementById("container");

// Create a new Sketch instance if container exists
if (container) {
  new Sketch({
    domElement: container,
  });
} else {
  // Log an error if container is not found
  console.error("Container element not found");
}
