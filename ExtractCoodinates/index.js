// Global Variables ======
let prcnt_inc = 0.5; // percentage(%) increment wrt length of each path/contour in svg
let z_value = 100; // z value of the data Points //TODO: make this in between different contours
let radius = 3; // radius of each heatmap data point

// =======================

var mySVG = document.getElementById("mySVG");
var path_array = mySVG.children; // --> array[path]

// var path = path_array[0];

// // Length of path
// var pathLength = Math.floor(path.getTotalLength());

// Move obj element along path based on percentage of total length
function SvgCoordinateExtractor(path, prcnt) {
  // Length of path
  let pathLength = Math.floor(path.getTotalLength());
  prcnt = (prcnt * pathLength) / 100;

  // Get x and y values at a certain point in the line
  pt = path.getPointAtLength(prcnt);
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
    cur_coords = SvgCoordinateExtractor(path, prcnt);
    coords.push(cur_coords);
  }

  return coords; // array with [x, y] coords of the path as its elements
};

// let path_coords = extractCoordinatesFromContour(path, 1);

let initializeHeatMap = (radius) => {
  // create configuration object
  let config = {
    container: document.getElementById("heatmapContainer"),
    radius: radius, //TODO: set radius of each data point as you need
    // backgroundColor: "rgb(255, 255, 0)", //TODO set background color to grayscale tones of your heightmap
    maxOpacity: 1,
    minOpacity: 1,
    blur: 0, // TODO: set to 0 for an equal color distribution
  };
  // create heatmap with configuration
  let heatmapInstance = h337.create(config);

  return heatmapInstance;
};

let createHeatMapPoint = (x, y, value) => {
  return (dataPoint = {
    x: x, // x coordinate of the datapoint, a number
    y: y, // y coordinate of the datapoint, a number
    value: value, // the value at datapoint(x, y)
  });
};

let renderDataPoints = (heatmapInstance, dataPointsArray) => {
  heatmapInstance.addData(dataPointsArray);
  console.log("Heatmap Data points for a path are rendered !");
};

// Initialize HeatMap
let heatmapInstance = initializeHeatMap(radius);

let draw_one_path = (heatmapInstance, path, prcnt_inc, z_value) => {
  let path_coords = extractCoordinatesFromContour(path, prcnt_inc);

  // convert x,y coords to x,y,z obj format that heatmap expects
  dataPointsArray = path_coords.map((p) => {
    return createHeatMapPoint(p.x, p.y, z_value);
  });

  // Render Data Points on the heatmap
  renderDataPoints(heatmapInstance, dataPointsArray);
};

// // draw heatmap for every contour
// for (let i = 0; i < path_array.length; i++) {
//  // draw_one_path(heatmapInstance, path_array[i], prcnt_inc, z_value);
// }

// ===========================

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

temp = false;

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

// temp = checkIfContourContainsAnotherContour(path_array[0], path_array[1]);

// console.log(temp, "heyo")

// ======== Sort the Contours

// function sortPaths(path_array) {
//   path_collision_array = [];
//   for (let i = 0; i < path_array.length; i++) {
//     cur_path = path_array[i];
//     other_paths = [...Array.from(path_array)];
//     other_paths.splice(i, 1); // array containing other paths than the cur_path
//     count = 0; // contained contour count
//     cur_contained_children = [];
//     for (let j = 0; j < other_paths.length; j++) {
//       if (
//         checkIfContourContainsAnotherContour(other_paths[j], cur_path) == true
//       ) {
//         count = count + 1;
//         cur_contained_children.push(other_paths[j]);
//       }
//     }

//     path_collision_array.push({
//       path: cur_path,
//       contours_inside_count: count,
//       contained_contours: cur_contained_children,
//     });
//   }
//   return path_collision_array;
// }

// sortPaths(path_array);

// function fixContainedContoursBranching(path_array) {
//   path_collision_array = sortPaths(path_array);

//   for(let i = 0; i < path_collision_array.length; i++) {
//     cur_contour = path_collision_array[i];

//     for(let j = 0; j < cur_contour.contained_contours.length; j++) {
//       cur_contained_contour = cur_contour.contained_contours[j];

//     }
//   }
// }

// fixContainedContoursBranching(path_array);

// Renaissance ===================

function sortPaths(path_array) {
  path_collision_array = [];
  for (let i = 0; i < path_array.length; i++) {
    cur_path = path_array[i];
    other_paths = [...Array.from(path_array)];
    other_paths.splice(i, 1); // array containing other paths than the cur_path
    count = 0; // contained contour count
    cur_surrounding_parent = [];
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

// path_collision_array = sortPaths(path_array);

function ColorContours(path_array) {
  path_collision_array = sortPaths(path_array);
  // Note that higher the contours_outside_count value, the higher the height
  //coordinate in the heightmap of the points

  // Iterate through every contour and fill it with color
  for (let i = 0; i < path_array.length; i++) {
    cur_contour = path_array[i];
    cur_contour.style.fill = "rgba(67, 199, 169, 0.1)"; //TODO: Do NOT hardcode the color value, infer it from max height count value
  }

  console.log("DONE!");
}

ColorContours(path_array);
