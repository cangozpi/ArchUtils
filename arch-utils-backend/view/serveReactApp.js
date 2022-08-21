const path = require("path");
const express = require("express");
const router = express.Router();

// add middlewares to serve React app from build located
// at "/home/cangozpi/Desktop/contour-heightmap-generator/arch-utils/build"
router.use(express.static(path.join(__dirname, "../../arch-utils", "build")));
router.use(express.static("public"));

router.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../../arch-utils", "build", "index.html"));
});

module.exports = router;
