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

// draw heatmap for every contour
for (let i = 0; i < path_array.length; i++) {
  draw_one_path(heatmapInstance, path_array[i], prcnt_inc, z_value);
}
