import React, { useEffect } from "react";
import "./RenderDispMapMesh.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { OrbitControls } from "https://unpkg.com/three@<version>/examples/jsm/controls/OrbitControls.js";
import dispMapImage from "./image.jpg";

import renderDispMapMeshHelper from "./helpers/RenderDispMapMeshHelper";

let camera_x = 0;
let camera_y = 0;
let camera_z = 1000;

function RenderDispMapMesh() {
  useEffect(() => {
    renderDispMapMeshHelper(dispMapImage, camera_x, camera_y, camera_z);
  }, []);

  return <div className="content">Render 3D</div>;
}

export default RenderDispMapMesh;
