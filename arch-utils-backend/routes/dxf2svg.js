require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
var fs = require("fs");
const express = require("express");

const router = express.Router();

// setTimeoutLimit for file generation process
const timeOutDuration = 60000; // (in ms) ~ 1min
function requestTimeout(req, res, next) {
  res.setTimeout(timeOutDuration, function () {
    console.log("Request has timed out.");
    res.status(408).send({ error: "Request has timed out." });
  });

  next();
}

// Calling child process starts here ----------------------------------
var child_process = require("child_process");

//handles localhost:8080/dxf2svg
router.put("/", requestTimeout, (req, res) => {
  // save the .dxf file onto server so that python script can be run on it
  // save original file name
  const pythonBinaryDir = process.env.PYTHON_BINARY_DIR;
  const scriptDir = "./utility scripts/dxf2svg_python_script/dxf2svg.py";
  const timeoutDuration = 20000;
  // const originalFileName = req.files.dxf_file.name;

  // create unique name for the file
  let basePath =
    __dirname + "/../utility scripts/dxf2svg_python_script/IOFiles/" + uuidv4();

  let uploadPath = basePath + ".dxf";

  // check if the uuid file name is unique
  try {
    while (fs.existsSync(uploadPath)) {
      //file exists, generate new name
      basePath =
        __dirname +
        "/../utility scripts/dxf2svg_python_script/IOFiles/" +
        uuidv4();
      uploadPath = basePath + ".dxf";
    }
  } catch (err) {
    return res.status(500).send(err);
  }

  let downloadPath = basePath + ".svg";

  try {
    // Use the mv() method to place the file somewhere on your server
    req.files.dxf_file.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        // Use child_process.spawn method from
        // child_process module and assign it
        // to variable spawn

        var spawn = child_process.spawn;

        // Parameters passed in spawn -
        // 1. type_of_script
        // 2. list containing Path of the script
        //    and arguments for the script

        var process = spawn(pythonBinaryDir, [scriptDir, uploadPath]);

        // Takes stdout data from script which executed
        // with arguments and send this data to res object
        const pythonSuccessfullFlag = "svg successfully generated"; // this is sent from python script to indicate that the process is done
        process.stdout.on("data", (data) => {
          if (data.toString().trim() == pythonSuccessfullFlag) {
            // send generated .svg file back to client.

            res.download(downloadPath, () => {
              fs.unlink(downloadPath, (err) => {});
              fs.unlink(uploadPath, (err) => {});
            });
          } else {
            res
              .status(500)
              .send(
                "something went wrong with the dxf2svg conversion script !"
              );
            fs.unlink(uploadPath);
          }
        });

        process.stderr.on("data", (data) => {
          fs.unlink(uploadPath, (err) => console.error(err));
        });
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
});
// Calling child process starts ends ------------------------------------

module.exports = router;
