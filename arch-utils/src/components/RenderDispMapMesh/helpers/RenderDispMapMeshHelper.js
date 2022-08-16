import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function all(dispMapImage, camera_x, camera_y, camera_z) {
  const scene = new THREE.Scene();
  const camera = createCamera();
  const renderer = createRenderer();

  // const textureLoader = new THREE.TextureLoader();
  // const plyLoader = new THREE.PLYLoader();
  const controls = createOrbitsControls(camera, renderer);

  function createCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.x = camera_x;
    camera.position.y = camera_y;
    camera.position.z = camera_z;

    return camera;
  }

  function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.physicallyCorrectLights = true;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.bias = 0.0001;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);

    return renderer;
  }

  function createOrbitsControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);

    // controls.enableZoom = true;
    // controls.autoRotate = false;
    // controls.enablePan = false;
    // controls.keyPanSpeed = 7.0;
    // controls.enableKeys = false;
    // controls.target = new THREE.Vector3(0, 0, 0);
    // controls.mouseButtons = {};
    // controls.dispose();

    return controls;
  }

  // Add rendering dom element to page.
  document.body.appendChild(renderer.domElement);

  // Setup scene.
  scene.background = new THREE.Color(0x303f9f);
  scene.add(createLight());
  scene.add(createHemisphereLight());

  function createLight() {
    const lightGeometry = new THREE.SphereGeometry(0);

    const lightMaterial = new THREE.MeshStandardMaterial({
      emissive: 0xffffee,
      emissiveIntensity: 1,
      color: 0x000000,
    });

    const light = new THREE.PointLight(0xffffff, 1, 20, 2);

    light.power = 1700;
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.heigth = 512;
    light.shadow.radius = 1.5;

    light.add(new THREE.Mesh(lightGeometry, lightMaterial));
    light.position.set(0, 5, 3);

    return light;
  }

  function createHemisphereLight() {
    return new THREE.HemisphereLight(0x303f9f, 0x000000, 1);
  }

  // Generate Mesh from Displacement Map ==================================
  const groundGeo = new THREE.PlaneGeometry(
    1000,
    1000,
    window.innerWidth,
    window.innerHeight
  );

  let dispMap = new THREE.TextureLoader()
    //   .setPath("./")
    .load(dispMapImage);
  dispMap.wrapS = dispMap.wrapT = THREE.RepeatWrapping;
  // dispMap.repeat.set(??, ??);

  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    wireframe: true,
    displacementMap: dispMap,
    displacementScale: 100,
  });

  let groundMesh = new THREE.Mesh(groundGeo, groundMat);
  scene.add(groundMesh);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -0.5;

  // ===============================================================

  const render = function () {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
  };

  render();
}

export default all;
