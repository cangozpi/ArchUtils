import React, { useEffect } from "react";
import "./Svg2DispMap.css";
import svg2DispMapHelper from "./helpers/svg2DispMapHelper";
import { ReactComponent as IconMenu } from "./IsohipsTest.svg";

// Global Variables ======
let prcnt_inc = 0.5; // percentage(%) increment wrt length of each path/contour in svg
let z_value = 100; // z value of the data Points //TODO: make this in between different contours
let radius = 3; // radius of each heatmap data point
let id = "mySVG";

function Svg2DispMap() {
  useEffect(() => {
    svg2DispMapHelper(prcnt_inc, z_value, radius, id);
  }, []);

  return (
    <div className="content">
      <div className="svgPlaceholder">
        <p>
          <a href="" id="link" download="image.jpg">
            Download Displacement Map
          </a>
        </p>
        <IconMenu id="mySVG"></IconMenu>
      </div>
    </div>
  );
}

export default Svg2DispMap;
