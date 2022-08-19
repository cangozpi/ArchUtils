import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import dirtTexture from "./dirtTexture.jpg";

import * as dat from "dat.gui";

function all(dispMapImage, normalMapUrl, camera_x, camera_y, camera_z) {
  // ============ GUI
  const gui = new dat.GUI({ autoPlace: false });
  gui.domElement.id = "gui";
  // =============

  const scene = new THREE.Scene();
  const camera = createCamera();
  const renderer = createRenderer();

  const controls = createOrbitsControls(camera, renderer);

  function createCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      // 1000
      2000
    );

    camera.position.x = camera_x;
    camera.position.y = camera_y;
    camera.position.z = camera_z;

    // ======= GUI
    gui.add(camera.position, "x");
    gui.add(camera.position, "y");
    gui.add(camera.position, "z");
    // =========

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
    controls.autoRotate = true;
    // controls.enablePan = false;
    // controls.keyPanSpeed = 7.0;
    // controls.enableKeys = false;
    // controls.target = new THREE.Vector3(0, 0, 0);
    // controls.mouseButtons = {};
    // controls.dispose();

    return controls;
  }

  // Add rendering dom element to page.
  // document.body.appendChild(renderer.domElement);
  let threeJsCanvasContainer = document.querySelector(
    ".threeJsCanvasContainer"
  );
  threeJsCanvasContainer.appendChild(renderer.domElement);

  // Setup scene.
  scene.background = new THREE.Color(0x303f9f);
  let light = createLight();
  scene.add(light);
  scene.add(createHemisphereLight());

  function createLight() {
    const lightGeometry = new THREE.SphereGeometry(0);

    const lightMaterial = new THREE.MeshStandardMaterial({
      emissive: 0xffffee,
      emissiveIntensity: 1,
      color: 0x000000,
    });

    // const light = new THREE.PointLight(0xffffff, 1, 20, 2);
    const light = new THREE.PointLight(0xffffff, 1, 2000, 0);

    light.power = 300;
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.heigth = 512;
    light.shadow.radius = 1.5;

    light.add(new THREE.Mesh(lightGeometry, lightMaterial));
    // light.position.set(0, 0, 100);
    light.position.set(51, 1000, 680);

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

  let loader = new THREE.TextureLoader();
  let dispMap = loader.load(dispMapImage);
  dispMap.wrapS = dispMap.wrapT = THREE.RepeatWrapping;
  // dispMap.repeat.set(??, ??);

  let normalMap = loader.load(normalMapUrl);
  normalMap.wrapS = dispMap.wrapT = THREE.RepeatWrapping;

  let textDirtMap = loader.load(dirtTexture);
  textDirtMap.wrapS = dispMap.wrapT = THREE.RepeatWrapping;

  let groundMat = new THREE.MeshStandardMaterial({
    color: "gray",
    map: textDirtMap,
    wireframe: false,
    displacementMap: dispMap,
    displacementScale: 240,

    normalMap: normalMap,
    normalScale: 1,
    normalMapType: THREE.ObjectSpaceNormalMap,
    // flatShading: false,
    // bumpMap: dispMap,
  });

  // ======= GUI
  gui.add(groundMat, "displacementScale");
  gui.add(groundMat, "normalScale");

  gui.add(light.position, "x");
  gui.add(light.position, "y");
  gui.add(light.position, "z");

  gui.add(controls, "autoRotate");

  const col = { color: "#ffffff" };
  gui.addColor(col, "color").onChange(() => {
    light.color.set(col.color);
  });

  // =========

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

  // render();

  return {
    renderer_dom: renderer.domElement,
    renderer: renderer,
    scene: scene,
    camera: camera,
    render: render,
    gui: gui,
  };
}

export default all;
