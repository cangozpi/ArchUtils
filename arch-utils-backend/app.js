require("dotenv").config();
var cors = require("cors");
var express = require("express");
const fileUpload = require("express-fileupload");
const dxf2svg = require("./routes/dxf2svg");
const serveReactApp = require("./view/serveReactApp");
const cluster = require("cluster");

const totalCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Number of available CPUs is ${totalCPUs}`);
  console.log(`Master is running with pid:${process.pid}`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker with pid:${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  var app = express();

  // express middleware
  app.use(cors());
  app.use(fileUpload());
  app.use("/dxf2svg", dxf2svg);

  // Serve React App
  app.use("/", serveReactApp);

  // app.use(express.json());
  // const bodyParser = require("body-parser");
  // app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded());
  // app.use(bodyParser.urlencoded({ extended: true }));

  const port = process.env.PORT || 8080;

  app.listen(port, () => {
    console.log(
      `server running on port ${port}, with worker pid: ${process.pid}`
    );
  });
}
