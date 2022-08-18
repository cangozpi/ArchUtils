import React, { useEffect } from "react";
import "./Svg2DispMap.css";
import svg2DispMapHelper from "./helpers/svg2DispMapHelper";
import { ReactComponent as SvgIcon } from "./IsohipsTest.svg";
// Labelled Buttons
// /home/cangozpi/Desktop/coding/fiddle workspace/izohips/arch-utils/src/components/Svg2DispMap/Svg2DispMap.js
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
// Svg2DispMap conversion helper utilities

// Global Variables ======
let prcnt_inc = 0.5; // percentage(%) increment wrt length of each path/contour in svg
let z_value = 100; // z value of the data Points //TODO: make this in between different contours
let radius = 3; // radius of each heatmap data point
let id = "mySVG";

function Svg2DispMap() {
  // File upload functions start here ------------------------
  const postDxfFileURL = "http://127.0.0.1:8080/dxf2svg";
  let [fileState, setFileState] = React.useState(null); // uploaded .dxf file
  let [showSvgButtonsFlag, setShowSvgButtonsFlag] = React.useState(false);
  let [generatedSvg, setGeneratedSvg] = React.useState(null);

  // uploads chosen file to the server by making PUT request
  let PostDxfFileToServer = () => {
    let formData = new FormData();
    formData.append("dxf_file", fileState);
    fetch(postDxfFileURL, {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        if (response.status == 200) {
          // prompt user to download the generated .svg file
          response.blob().then((blob) => {
            let url = window.URL.createObjectURL(blob);
            setGeneratedSvg({
              url: url,
              name: `${fileState.name.split(".")[0]}.svg`,
            });
            setShowSvgButtonsFlag(true);
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  let onFileChange = (event) => {
    // Update the state
    if (event.target.files.length > 0) {
      setFileState(event.target.files[0]); // useEffect would be triggered to make the PUT request to the server
    }
  };

  React.useEffect(() => {
    // send .dxf file to the server for it to convert and return .svg converted version
    if (fileState != null) {
      PostDxfFileToServer();
    }
  }, [fileState]);

  let onDownloadSvg = () => {
    let a = document.createElement("a");
    a.href = generatedSvg.url;
    a.download = generatedSvg.name;
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

  useEffect(() => {
    if (showSvgButtonsFlag) {
      svg2DispMapHelper(prcnt_inc, z_value, radius, id);
    }
  }, [showSvgButtonsFlag]);

  return (
    <>
      {/* ======================================================================== */}
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

        {showSvgButtonsFlag && (
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
              onButtonClick={onDownloadSvg}
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

            {/* Display Generated Svg Accordion below --> */}
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
                    Show Generated <em>.svg</em>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* <img
                  className="dxf2svg_svg"
                  src={generatedSvg.url}
                  alt="generated svg"
                /> */}

                  {true && (
                    <div className="content">
                      <div className="svgPlaceholder">
                        <p>
                          <a href="" id="link" download="image.jpg">
                            Download Displacement Map
                          </a>
                        </p>
                        <SvgIcon id="mySVG"></SvgIcon>
                      </div>
                    </div>
                  )}

                  <object
                    type="image/svg+xml"
                    data={generatedSvg.url}
                    className="dxf2svg_svg"
                  ></object>
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
