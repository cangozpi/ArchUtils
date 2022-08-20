require("dotenv").config();
var cors = require("cors");
var express = require("express");
const fileUpload = require("express-fileupload");
const dxf2svg = require("./routes/dxf2svg");

var app = express();

// express middleware
app.use(cors());
app.use(fileUpload());
app.use("/dxf2svg", dxf2svg);

// app.use(express.json());
// const bodyParser = require("body-parser");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
// app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
