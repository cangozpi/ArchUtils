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
  let fileName = "deneme1234.dxf";
  let uploadPath =
    __dirname + "/utility scripts/dxf2svg_python_script/IOFiles/" + fileName;

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
      // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
      // so, first name = Mike and last name = Will

      var process = spawn(
        "./utility scripts/dxf2svg_python_script/myVenv/bin/python",
        [
          "./utility scripts/dxf2svg_python_script/dxf2svg.py",
          `./utility scripts/dxf2svg_python_script/IOFiles/${fileName}`,
          // req.query.firstname,
          // req.query.lastname,
        ]
      );

      // Takes stdout data from script which executed
      // with arguments and send this data to res object
      process.stdout.on("data", (data) => {
        console.log(data.toString());
        res.send(data.toString());
      });

      process.stderr.on("data", (data) => {
        console.log(data, data.toString());
        res.send(data.toString());
      });
    }
  });
});
// Calling child process starts ends ------------------------------------
