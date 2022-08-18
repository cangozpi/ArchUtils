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

// Global Variables ======
let prcnt_inc = 0.5; // percentage(%) increment wrt length of each path/contour in svg
let z_value = 100; // z value of the data Points //TODO: make this in between different contours
let radius = 3; // radius of each heatmap data point
let id = "mySVG";

function Svg2DispMap() {
  // File upload functions start here ------------------------
  const postDxfFileURL = "http://127.0.0.1:8080/dxf2svg";
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
      generateDispMap();
    }
  }, [fileState]);

  let onDownloadJpg = () => {
    let a = document.createElement("a");
    a.href = imageDataUrl;
    a.download = uploadedSvg.name.split(".")[0].trim() + ".jpg";
    a.click();
  };

  let onGenerateDispMap = () => {
    //TODO: implement this (might pass svg data to the other tab component and switch to that tab maybe)
    console.log("Yet to be implemented ...");
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
      if (svgRef.current != undefined && svgObjectRendered == false) {
        setSvgObjectRendered(true);
      }
    }
  }, [showButtonsFlag]);

  let [updateState, setUpdateState] = useState(false);
  let [imageDataUrl, setImageDataUrl] = useState();
  useEffect(() => {
    if (svgObjectRendered == true) {
      if (updateState == false) {
        setUpdateState(true);
      } else {
        let svg_el = svgRef.current.contentDocument.documentElement;
        svg2DispMapHelper(
          svg_el,
          prcnt_inc,
          z_value,
          radius,
          id,
          setImageDataUrl
        );
      }
    }
  }, [svgObjectRendered, updateState]);

  let [showGeneratedDispMap, setShowGeneratedDispMap] = useState(false);
  useEffect(() => {
    // display image
    if (imageDataUrl != undefined) {
      setShowGeneratedDispMap(true);
    }
  }, [imageDataUrl]);

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
          <Button
            variant="contained"
            component="label"
            color="success"
            size="small"
            endIcon={<FileUploadIcon />}
            onClick={() =>
              console.log("Use Generated Svg yet to be Implemented ...")
            }
            style={{ marginTop: "0.5em" }}
          >
            Use Generated <em>.svg</em>
          </Button>
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

                  {showGeneratedDispMap == false && (
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
