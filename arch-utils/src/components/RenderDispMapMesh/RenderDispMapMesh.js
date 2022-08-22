import React, { useState, useEffect } from "react";
import "./RenderDispMapMesh.css";
import Swal from "sweetalert2";

// Labelled Buttons
import LabelledButton from "../Dxf2Svg/LabelledButton/LabelledButton";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
// Accordion menu below
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Helper utility to help with rendering mesh using Three Js
import renderDispMapMeshHelper from "./helpers/RenderDispMapMeshHelper";
import normalMapGenerationHelper from "./helpers/normalMapGenerationHelper";

// Global Variables ======
let prcnt_inc = 0.5; // percentage(%) increment wrt length of each path/contour in svg
let z_value = 100; // z value of the data Points //TODO: make this in between different contours
let radius = 3; // radius of each heatmap data point
let id = "mySVG";

/// ================================================== 3D rendering variables below:

let camera_x = -610;
let camera_y = 615;
let camera_z = 780;

function RenderDispMapMesh({
  handleChangeTabs,
  setPreviouslyGeneratedFileState,
  getPreviouslyGeneratedFileState,
}) {
  // ==================================================== menu functionality below
  // File upload functions start here ------------------------
  let [fileState, setFileState] = React.useState(null); // uploaded .dxf file
  let [showButtonsFlag, setShowButtonsFlag] = React.useState(false);
  let [uploadedJpg, setUploadedJpg] = React.useState(null);

  let onFileChange = (event) => {
    // Update the state
    if (event.target.files.length > 0) {
      setFileState(event.target.files[0]); // useEffect would be triggered to make the PUT request to the server
      // Display uploaded file information to the user
    }
  };

  let generateDispMap = () => {
    // Generate URL for the svg uploaded by the user
    let url = window.URL.createObjectURL(fileState);
    setUploadedJpg({
      url: url,
      name: `${fileState.name.split(".")[0]}.jpg`,
    });
  };

  React.useEffect(() => {
    // send .dxf file to the server for it to convert and return .svg converted version
    if (fileState != null) {
      Swal.fire(
        "File Uploaded!",
        `
        <strong>File name</strong>: <em>${fileState.name}</em><br>
        <strong>File type</strong>: <em>${fileState.type}</em><br>
        <strong>File size</strong>: <em>${fileState.size} byte</em><br>
      `,
        "success"
      ).then(() => {
        generateDispMap();
      });
    }
  }, [fileState]);

  let useGeneratedJpgHandle = (e) => {
    // set uploadedJpg to previously generated svg content
    let previouslyGeneratedFileState = getPreviouslyGeneratedFileState();
    setUploadedJpg({
      url: previouslyGeneratedFileState.url,
      name: previouslyGeneratedFileState.name,
    });
  };

  // File upload functions end ------------------------

  // Accordion Menu functions start -
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  // Accordion Menu functions end ------------------------

  // ===================================================================================
  //   svg to DispMap conversion functionality below:

  let [threeJsObject, setThreeJsObject] = useState(); // object that contains Three Js related objects/methods
  // -->   -->   -->  -->   -->
  //  threeJsObject = {
  //    renderer_dom: renderer.domElement,
  //    renderer: renderer,
  //    scene: scene,
  //    camera: camera,
  //    render: render,
  //    gui: gui,
  //  };

  useEffect(() => {
    if (uploadedJpg != null) {
      setShowButtonsFlag(true);
    }
  }, [uploadedJpg]);

  useEffect(() => {
    // if (threeJsObject != undefined) {
    //   console.log(threeJsObject);
    //   console.log(threeJsObject.renderer_dom);
    // }
  }, [threeJsObject]);

  let [meshRendered, setmeshRendered] = React.useState(false);
  let [normalMapUrl, setNormalMapUrl] = React.useState();

  useEffect(() => {
    try {
      if (normalMapUrl != undefined) {
        let dispMapImage = uploadedJpg.url;
        let threeJsObject = renderDispMapMeshHelper(
          dispMapImage,
          normalMapUrl,
          camera_x,
          camera_y,
          camera_z
        );
        setThreeJsObject(threeJsObject);
        threeJsObject.render(); //start rendering the scene

        // append three js dat gui
        let threeCanvas = document.querySelector(".threeJsCanvasContainer");
        //check if gui has been added before
        let priorGuiList = document.querySelectorAll("#gui");
        for (let i = 0; i < priorGuiList.length; i++) {
          priorGuiList[i].remove();
        }
        // append new gui to DOM
        threeCanvas.prepend(threeJsObject.gui.domElement);

        setmeshRendered(true);

        // toast Fetch Error
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: "Mesh generation successfull",
        });
      }
    } catch (e) {
      // toast Fetch Error
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "error",
        title: "Error, something went wrong",
      });
    }
  }, [normalMapUrl]);

  useEffect(() => {
    if (showButtonsFlag == true) {
      if (meshRendered == false) {
        try {
          let dispMapImage = uploadedJpg.url;
          normalMapGenerationHelper(dispMapImage, setNormalMapUrl);
        } catch (e) {
          // toast Fetch Error
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "error",
            title: "Error, something went wrong",
          });
        }
      }
    }
  }, [showButtonsFlag]);

  return (
    <>
      <div className="dxf2Svg-container">
        {/* Labelled Buttons Below --> */}
        <LabelledButton
          labelTxt={
            <>
              Generate Mesh from Displacement Map (<em>.jpg</em>)
            </>
          }
          buttonTxt={
            <>
              Upload <pre> </pre>{" "}
              <em style={{ textTransform: "none" }}> .jpg</em>
            </>
          }
          buttonIcon={<FileUploadIcon />}
          color="success"
          onFileChange={onFileChange}
          isInputFlag={true}
          acceptedType=".jpg"
        >
          {getPreviouslyGeneratedFileState()?.name.split(".")[1] == "jpg" && (
            <Button
              variant="contained"
              component="label"
              color="success"
              size="small"
              endIcon={<FileUploadIcon />}
              onClick={useGeneratedJpgHandle}
              style={{ marginTop: "0.5em" }}
            >
              Use Generated <em>.jpg</em>
            </Button>
          )}
        </LabelledButton>

        {showButtonsFlag && (
          <>
            {/* Display Generated DispMap Accordion below --> */}
            <div className="break"></div>
            <div className="generatedMeshAccordion">
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography
                    sx={{ width: "33%", flexShrink: 0, fontWeight: 600 }}
                  >
                    Preview
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    Show Generated Mesh
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Three Js renderer.domElement will be appended inside this div */}
                  <div className="threeJsCanvasContainer"></div>
                </AccordionDetails>
              </Accordion>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default RenderDispMapMesh;
