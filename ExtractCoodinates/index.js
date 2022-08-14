// The two important methods here are
// path.getTotalLength and path.getPointAtLength

// For more info see:
// https://developer.mozilla.org/en-US/docs/Web/API/SVGPathElement

var mySVG = document.getElementById("mySVG");
var path_array = mySVG.children; // --> array[path]

var path = path_array[0];

// Length of path
var pathLength = Math.floor(path.getTotalLength());

// Move obj element along path based on percentage of total length
function moveObj(prcnt) {
  prcnt = (prcnt * pathLength) / 100;

  // Get x and y values at a certain point in the line
  pt = path.getPointAtLength(prcnt);
  pt.x = Math.round(pt.x);
  pt.y = Math.round(pt.y);

  console.log(pt.x, pt.y, "DENEME ALIMO");
  //   obj.style.webkitTransform = "translate3d(" + pt.x + "px," + pt.y + "px, 0)";
}

// Initialize
moveObj(0);
moveObj(0.25);
moveObj(5);
moveObj(25);
moveObj(100);
