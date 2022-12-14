import React, { useEffect, useState } from "react";
import "./Svg2DispMap.css";
// Svg2DispMap conversion utils
import svg2DispMapHelper from "./helpers/svg2DispMapHelper";
// Labelled Buttons
import LabelledButton from "../Dxf2Svg/LabelledButton/LabelledButton";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Button from "@mui/material/Button";
// Accordion menu below
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Swal from "sweetalert2";

// Global Variables ======
let prcnt_inc = 0.5; // percentage(%) increment wrt length of each path/contour in svg
let z_value = 100; // z value of the data Points //TODO: make this in between different contours
let radius = 3; // radius of each heatmap data point
let id = "mySVG";

function Svg2DispMap({
  handleChangeTabs,
  setPreviouslyGeneratedFileState,
  getPreviouslyGeneratedFileState,
}) {
  // File upload functions start here ------------------------
  let [fileState, setFileState] = React.useState(null); // uploaded .dxf file
  let [showButtonsFlag, setShowButtonsFlag] = React.useState(false);
  let [uploadedSvg, setUploadedSvg] = React.useState(null);

  let onFileChange = (event) => {
    // Update the state
    if (event.target.files.length > 0) {
      setFileState(event.target.files[0]); // useEffect would be triggered to make the PUT request to the server
    }
  };

  let svgRef = React.useRef();

  let generateDispMap = () => {
    // Generate URL for the svg uploaded by the user
    let url = window.URL.createObjectURL(fileState);
    setUploadedSvg({
      url: url,
      name: `${fileState.name.split(".")[0]}.svg`,
    });
  };

  React.useEffect(() => {
    // send .dxf file to the server for it to convert and return .svg converted version
    if (fileState != null) {
      // Display uploaded file information to the user
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

  let onDownloadJpg = () => {
    if (generationCompleted) {
      let a = document.createElement("a");
      a.href = imageDataUrl;
      a.download = uploadedSvg.name.split(".")[0].trim() + ".jpg";
      a.click();
    }
  };

  let onGenerateDispMap = () => {
    // pass fileState to svg2DispMap component
    if (generationCompleted) {
      setPreviouslyGeneratedFileState({
        url: imageDataUrl,
        name: uploadedSvg.name.split(".")[0].trim() + ".jpg",
      });
      // swith Tabs to RenderDispMapMesh component
      handleChangeTabs(undefined, 2);
    }
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

  useEffect(() => {
    if (uploadedSvg != null) {
      setShowButtonsFlag(true);
    }
  }, [uploadedSvg]);

  let [svgObjectRendered, setSvgObjectRendered] = React.useState(false);
  useEffect(() => {
    if (showButtonsFlag == true) {
      let interval = setInterval(() => {
        let svg_el = document
          .querySelector(".dxf2svg_svg")
          ?.contentDocument?.querySelector("svg");
        if (svg_el != null && svgObjectRendered == false) {
          clearInterval(interval); // stop setInterval firing any longer
          setSvgObjectRendered(true);
        }
      }, 1000);
    }
  }, [showButtonsFlag, uploadedSvg]);

  let [imageDataUrl, setImageDataUrl] = useState();
  useEffect(() => {
    if (svgObjectRendered == true) {
      try {
        let svg_el =
          document.querySelector(".dxf2svg_svg").contentDocument
            .documentElement;
        svg2DispMapHelper(
          svg_el,
          prcnt_inc,
          z_value,
          radius,
          id,
          setImageDataUrl
        );
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
  }, [svgObjectRendered]);

  let [generationCompleted, setGenerationCompleted] = useState(false);

  let [showGeneratedDispMap, setShowGeneratedDispMap] = useState(false);
  useEffect(() => {
    // display image
    if (imageDataUrl != undefined) {
      setGenerationCompleted(true);
      setShowGeneratedDispMap(true);
      // toast Successfully dispMap generated
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
        title: "Displacement map generation successfull",
      });
    }
  }, [imageDataUrl]);

  let useGeneratedSvgHandle = (e) => {
    // set uploadedSvg to previously generated svg content
    let previouslyGeneratedFileState = getPreviouslyGeneratedFileState();
    setUploadedSvg({
      url: previouslyGeneratedFileState.url,
      name: previouslyGeneratedFileState.name,
    });
  };

  return (
    <>
      <div className="dxf2Svg-container">
        {/* Labelled Buttons Below --> */}
        <LabelledButton
          labelTxt={
            <>
              Generate Displacement Map from <em>svg</em>
            </>
          }
          buttonTxt={
            <>
              Upload <pre> </pre>{" "}
              <em style={{ textTransform: "none" }}> .svg</em>
            </>
          }
          buttonIcon={<FileUploadIcon />}
          color="success"
          onFileChange={onFileChange}
          isInputFlag={true}
          acceptedType=".svg"
        >
          {getPreviouslyGeneratedFileState()?.name.split(".")[1] == "svg" && (
            <Button
              variant="contained"
              component="label"
              color="success"
              size="small"
              endIcon={<FileUploadIcon />}
              onClick={useGeneratedSvgHandle}
              style={{ marginTop: "0.5em" }}
            >
              Use Generated <em>.svg</em>
            </Button>
          )}
        </LabelledButton>

        {showButtonsFlag && (
          <>
            <LabelledButton
              labelTxt={<>Download Generated Displacement Map</>}
              buttonTxt={
                <>
                  Download <pre> </pre>{" "}
                  <em style={{ textTransform: "none" }}> .jpg</em>
                </>
              }
              buttonIcon={<DownloadIcon />}
              color="primary"
              isInputFlag={false}
              onButtonClick={onDownloadJpg}
            ></LabelledButton>

            <LabelledButton
              labelTxt={
                <>
                  Generate Mesh from the Generated Displacement Map (
                  <em>.jpg</em>)
                </>
              }
              buttonTxt={
                <>
                  Generate <pre> </pre>{" "}
                  <em style={{ textTransform: "none" }}> Mesh</em>
                </>
              }
              buttonIcon={<ArrowRightAltIcon />}
              color="primary"
              isInputFlag={false}
              onButtonClick={onGenerateDispMap}
            ></LabelledButton>

            {/* Display Generated DispMap Accordion below --> */}
            <div className="break"></div>
            <div className="generatedSvgAccordion">
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
                    Show Generated Displacement Map (<em>.jpg</em>)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {showGeneratedDispMap && (
                    <img style={{ width: "100%" }} src={imageDataUrl}></img>
                  )}

                  {showGeneratedDispMap === false && (
                    <object
                      ref={svgRef}
                      type="image/svg+xml"
                      data={uploadedSvg.url}
                      className="dxf2svg_svg"
                    ></object>
                  )}
                </AccordionDetails>
              </Accordion>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Svg2DispMap;
