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

  camera.position.z = 1000;
  camera.position.y = 0;
  camera.position.x = 0;

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
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

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

// Generate Mesh from HeightMap ==================================

// // load the heightmap we created as a texture
// function loaded() {
//   n++;
//   console.log("loaded: " + n);

//   if (n == 3) {
//       terrain.visible = true;
//       console.log('ff');
//       render();
//   }
// }

// var texture = THREE.ImageUtils.loadTexture('./TestTopogrophyMap.jpg', null, loaded);

// // the following configuration defines how the terrain is rendered
// var terrainShader = THREE.ShaderTerrain[ "terrain" ];
// var uniformsTerrain = THREE.UniformsUtils.clone(terrainShader.uniforms);

// // how to treat abd scale the normal texture
// uniformsTerrain[ "tNormal" ].texture = detailTexture;
// uniformsTerrain[ "uNormalScale" ].value = 1;

// // the displacement determines the height of a vector, mapped to
// // the heightmap
// uniformsTerrain[ "tDisplacement" ].texture = texture;
// uniformsTerrain[ "uDisplacementScale" ].value = 100;

// // the following textures can be use to fine tune how
// // the map is shown. These are good defaults for simple
// // rendering
// uniformsTerrain[ "tDiffuse1" ].texture = detailTexture;
// uniformsTerrain[ "tDetail" ].texture = detailTexture;
// uniformsTerrain[ "enableDiffuse1" ].value = true;
// uniformsTerrain[ "enableDiffuse2" ].value = true;
// uniformsTerrain[ "enableSpecular" ].value = true;

// // diffuse is based on the light reflection
// uniformsTerrain[ "uDiffuseColor" ].value.setHex(0xcccccc);
// uniformsTerrain[ "uSpecularColor" ].value.setHex(0xff0000);
// // is the base color of the terrain
// uniformsTerrain[ "uAmbientColor" ].value.setHex(0x0000cc);

// // how shiny is the terrain
// uniformsTerrain[ "uShininess" ].value = 3;

// // handles light reflection
// uniformsTerrain[ "uRepeatOverlay" ].value.set(3, 3);

// // configure the material that reflects our terrain
// var material = new THREE.ShaderMaterial({
//     uniforms:uniformsTerrain,
//     vertexShader:terrainShader.vertexShader,
//     fragmentShader:terrainShader.fragmentShader,
//     lights:true,
//     fog:false
// });

// // we use a plain to render as terrain
// var geometryTerrain = new THREE.PlaneGeometry(2000, 4000, 256, 256);
// geometryTerrain.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
// geometryTerrain.computeFaceNormals();
// geometryTerrain.computeVertexNormals();
// geometryTerrain.computeTangents();

// // create a 3D object to add
// terrain = new THREE.Mesh(geometryTerrain, material);
// terrain.position.set(0, -125, 0);
// terrain.rotation.x = -Math.PI / 2;

// // add the terrain
// scene.add(terrain);

// loaded();

// VIDEOOOOOO ==================================

const groundGeo = new THREE.PlaneGeometry(
  1000,
  1000,
  window.innerWidth,
  window.innerHeight
);

let dispMap = new THREE.TextureLoader().setPath("./").load("image.jpg");

dispMap.wrapS = dispMap.wrapT = THREE.RepeatWrapping;
// dispMap.repeat.set(??, ??);

const groundMat = new THREE.MeshStandardMaterial({
  color: 0x000000,
  wireframe: true,
  displacementMap: dispMap,
  displacementScale: 100,
});

groundMesh = new THREE.Mesh(groundGeo, groundMat);
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
