import React from "react";
import "./Dxf2Svg.css";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

function Dxf2Svg() {
  return (
    <div className="dxf2Svg-container">
      <div className="UploadDxfBtn">
        <div className="UploadDxfBtnLabel">
          <Typography>
            <p>
              Convert <em>.dxf</em> to <em>svg</em>
            </p>
          </Typography>
        </div>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            variant="contained"
            component="label"
            color="success"
            size="small"
            endIcon={<FileUploadIcon />}
          >
            Upload <pre> </pre> <em style={{ textTransform: "none" }}> .dxf</em>
            <input hidden accept="image/*" multiple type="file" />
          </Button>
        </Stack>
      </div>

      <div className="UploadDxfBtn">
        <div className="UploadDxfBtnLabel">
          <Typography>
            <p>
              Download Generated <em>.svg</em>
            </p>
          </Typography>
        </div>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            variant="contained"
            component="label"
            size="small"
            endIcon={<DownloadIcon />}
          >
            Download <pre> </pre>{" "}
            <em style={{ textTransform: "none" }}> .svg</em>
            <input hidden accept="image/*" multiple type="file" />
          </Button>
        </Stack>
      </div>

      <div className="UploadDxfBtn">
        <div className="UploadDxfBtnLabel">
          <Typography>
            <p>
              Generate Displacement Map from the Generated <em>.svg</em>
            </p>
          </Typography>
        </div>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            variant="contained"
            component="label"
            size="small"
            endIcon={<ArrowRightAltIcon />}
          >
            Download <pre> </pre>{" "}
            <em style={{ textTransform: "none" }}> .svg</em>
            <input hidden accept="image/*" multiple type="file" />
          </Button>
        </Stack>
      </div>
    </div>
  );
}

export default Dxf2Svg;
