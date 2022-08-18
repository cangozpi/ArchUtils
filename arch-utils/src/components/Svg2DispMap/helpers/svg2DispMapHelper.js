function all(path_array, prcnt_inc, z_value, radius, id) {
  // =======================

  //   var mySVG = document.getElementById(id);
  //   var path_array = mySVG.children; // --> array[path]

  // Move obj element along path based on percentage of total length
  function SvgCoordinateExtractor(path, prcnt) {
    // Length of path
    let pathLength = Math.floor(path.getTotalLength());
    prcnt = (prcnt * pathLength) / 100;
    // Get x and y values at a certain point in the line
    let pt = path.getPointAtLength(prcnt);
    pt.x = Math.round(pt.x);
    pt.y = Math.round(pt.y);

    return {
      x: pt.x,
      y: pt.y,
    };
  }

  let extractCoordinatesFromContour = (path, prcnt_inc) => {
    // Given a path, returns its x, y coordinates
    let coords = [];

    for (let prcnt = 0; prcnt <= 100; prcnt += prcnt_inc) {
      let cur_coords = SvgCoordinateExtractor(path, prcnt);
      coords.push(cur_coords);
    }

    return coords; // array with [x, y] coords of the path as its elements
  };

  // Logic for checking if a contour is contained within another given contour path ================

  function isPointInPoly(poly, pt) {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].y <= pt.y && pt.y < poly[j].y) ||
        (poly[j].y <= pt.y && pt.y < poly[i].y)) &&
        pt.x <
          ((poly[j].x - poly[i].x) * (pt.y - poly[i].y)) /
            (poly[j].y - poly[i].y) +
            poly[i].x &&
        (c = !c);
    return c;
  }

  let temp = false;

  function checkIfContourContainsAnotherContour(param_path0, param_path1) {
    // Given path objects, returns if the param_path0 is inside param_path1
    // extract sampled coordinates on the given contours
    let path0 = extractCoordinatesFromContour(param_path0, prcnt_inc); // array of (x,y, value) points
    let path1 = extractCoordinatesFromContour(param_path1, prcnt_inc);

    for (let i = 0; i < path1.length; i++) {
      // TODO: check collisions in the future or remove for loop
      temp = isPointInPoly(path1, path0[i]);
      return temp;
    }
  }

  // Sort contours and figure out their relative heights ===================

  function sortPaths(path_array) {
    let path_collision_array = [];
    for (let i = 0; i < path_array.length; i++) {
      let cur_path = path_array[i];
      let other_paths = [...Array.from(path_array)];
      other_paths.splice(i, 1); // array containing other paths than the cur_path
      let count = 0; // contained contour count
      let cur_surrounding_parent = [];
      for (let j = 0; j < other_paths.length; j++) {
        if (
          checkIfContourContainsAnotherContour(cur_path, other_paths[j]) == true
        ) {
          count = count + 1;
          cur_surrounding_parent.push(other_paths[j]);
        }
      }

      path_collision_array.push({
        path: cur_path,
        contours_outside_count: count,
        surrounding_contours: cur_surrounding_parent,
      });
    }
    return path_collision_array;
  }

  function inferColorIncrement(path_collision_array) {
    // Given the output of SortPaths as input, return color value to be used in the heighmap generation

    let max_height_count = -1; // max height count value
    for (let i = 0; i < path_collision_array.length; i++) {
      let cur_path = path_collision_array[i];
      let cur_count = cur_path.contours_outside_count;

      if (cur_count > max_height_count) {
        max_height_count = cur_count;
      }
    }

    // calculate the degree of gray to use according to the max_height_count
    // rgb_height_inc_value = Math.floor(256 / max_height_count);
    let rgb_height_inc_value = Math.floor(255);
    let opacity_value = 1.0 / max_height_count;
    return {
      rgb_value: rgb_height_inc_value,
      opacity_value: opacity_value,
    };
  }

  function ColorContours(path_array) {
    let path_collision_array = sortPaths(path_array);
    let heightMapInfo = inferColorIncrement(path_collision_array);

    // Note that higher the contours_outside_count value, the higher the height
    //coordinate in the heightmap of the points

    // Iterate through every contour and fill it with color
    for (let i = 0; i < path_array.length; i++) {
      let cur_contour = path_array[i];
      cur_contour.style.fill = `rgba(${heightMapInfo.rgb_value}, ${heightMapInfo.rgb_value}, ${heightMapInfo.rgb_value}, ${heightMapInfo.opacity_value})`; //TODO: Do NOT hardcode the color value, infer it from max height count value
      cur_contour.style.stroke = "none";
    }
  }

  ColorContours(path_array);

  function svg2img() {
    const svg = document.querySelector("svg");
    const { x, y, width, height } = svg.viewBox.baseVal;
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const image = document.createElement("img");
    image.src = url;
    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context.drawImage(image, x, y, width, height);
      const link = document.getElementById("link");
      link.href = canvas.toDataURL("image/jpeg");
      URL.revokeObjectURL(url);
    });
  }
  svg2img();
}

export default all;
