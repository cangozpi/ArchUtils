import React, { useEffect } from "react";
import "./Dxf2Svg.css";
// Labelled Buttons
import LabelledButton from "./LabelledButton/LabelledButton";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
// Accordion menu below
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Swal from "sweetalert2";

function Dxf2Svg({ handleChangeTabs, setPreviouslyGeneratedFileState }) {
  // File upload functions start here ------------------------
  // const postDxfFileURL = "http://127.0.0.1:8080/dxf2svg"; // for local dev
  const postDxfFileURL = "/dxf2svg"; // for serving with nodeJs
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
            title: "Conversion successfull",
          });
        } else {
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
      })
      .catch((error) => {
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
      Swal.fire(
        "File Uploaded!",
        `
        <strong>File name</strong>: <em>${fileState.name}</em><br>
        <strong>File type</strong>: <em>${fileState.type}</em><br>
        <strong>File size</strong>: <em>${fileState.size} byte</em><br>
      `,
        "success"
      ).then(() => {
        PostDxfFileToServer();
      });
    }
  }, [fileState]);

  let onDownloadSvg = () => {
    if (generationCompleted) {
      let a = document.createElement("a");
      a.href = generatedSvg.url;
      a.download = generatedSvg.name;
      a.click();
    }
  };

  useEffect(() => {
    if (generatedSvg) {
      setGenerationCompleted(true);
    }
  }, [generatedSvg]);
  let [generationCompleted, setGenerationCompleted] = React.useState(false);

  let onGenerateDispMap = () => {
    if (generationCompleted) {
      // pass fileState to svg2DispMap component
      setPreviouslyGeneratedFileState(generatedSvg);
      // swith Tabs to svg2DispMap component
      handleChangeTabs(undefined, 1);
    }
  };

  // File upload functions end ------------------------

  // Accordion Menu functions start -
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  // Accordion Menu functions end ------------------------

  return (
    <div className="dxf2Svg-container">
      {/* Labelled Buttons Below --> */}
      <LabelledButton
        labelTxt={
          <>
            Convert <em>.dxf</em> to <em>svg</em>
          </>
        }
        buttonTxt={
          <>
            Upload <pre> </pre> <em style={{ textTransform: "none" }}> .dxf</em>
          </>
        }
        buttonIcon={<FileUploadIcon />}
        color="success"
        onFileChange={onFileChange}
        isInputFlag={true}
        acceptedType=".dxf"
      ></LabelledButton>

      {showSvgButtonsFlag && (
        <>
          <LabelledButton
            labelTxt={
              <>
                Download Generated <em>.svg</em>
              </>
            }
            buttonTxt={
              <>
                Download <pre> </pre>{" "}
                <em style={{ textTransform: "none" }}> .svg</em>
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
                Generate Displacement Map from the Generated <em>.svg</em>
              </>
            }
            buttonTxt={
              <>
                Generate <pre> </pre>{" "}
                <em style={{ textTransform: "none" }}> Displacement Map</em>
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
  );
}

export default Dxf2Svg;
