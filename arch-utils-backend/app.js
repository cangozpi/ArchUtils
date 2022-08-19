var fs = require("fs");
const { v4: uuidv4 } = require("uuid");
var cors = require("cors");
var express = require("express");

var app = express();
// app.use(express.json());
app.use(cors());

// const bodyParser = require("body-parser");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
// app.use(bodyParser.urlencoded({ extended: true }));

const fileUpload = require("express-fileupload");
// enable files upload
// app.use(
//   fileUpload({
//     createParentPath: true,
//   })
// );
app.use(fileUpload());

const port = 8080;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

// Calling child process starts here ----------------------------------
var child_process = require("child_process");

// Function callName() is executed whenever
// url is of the form localhost:3000/dxf2svg
app.put("/dxf2svg", (req, res) => {
  // save the .dxf file onto server so that python script can be run on it

  // save original file name
  const pythonBinaryDir =
    "./utility scripts/dxf2svg_python_script/myVenv/bin/python";
  const scriptDir = "./utility scripts/dxf2svg_python_script/dxf2svg.py";
  const originalFileName = req.files.dxf_file.name;
  const timeoutDuration = 50000;
  // create unique name for the file
  let basePath =
    __dirname + "/utility scripts/dxf2svg_python_script/IOFiles/" + uuidv4();

  let uploadPath = basePath + ".dxf";

  // setTimeoutLimit for file generation process
  setTimeout(() => {
    if (fs.existsSync(uploadPath) == true) {
      return res
        .status(500)
        .send(
          `Time out Error. Could not generate your file within the given time limit ${timeoutDuration} seconds`
        );
    }
  }, timeoutDuration);

  // check if the uuid file name is unique
  try {
    while (fs.existsSync(uploadPath)) {
      //file exists, generate new name
      basePath =
        __dirname +
        "/utility scripts/dxf2svg_python_script/IOFiles/" +
        uuidv4();
      uploadPath = basePath + ".dxf";
    }
  } catch (err) {
    return res.status(500).send(err);
  }

  let downloadPath = basePath + ".svg";

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
      const pythonSuccessfullFlag = "svg successfully generated";
      process.stdout.on("data", (data) => {
        if (data.toString().trim() == pythonSuccessfullFlag) {
          // send generated .svg file back to client.
          res.download(downloadPath, () => {
            fs.unlink(downloadPath, (err) => {});
            fs.unlink(uploadPath, (err) => {});
          });
        } else {
          res.send("something went wrong with the dxf2svg conversion script !");
          fs.unlink(uploadPath);
        }
      });

      process.stderr.on("data", (data) => {
        console.log(data, data.toString());
        res.send(data.toString());
        fs.unlink(uploadPath, (err) => console.error(err));
      });
    }
  });
});
// Calling child process starts ends ------------------------------------
