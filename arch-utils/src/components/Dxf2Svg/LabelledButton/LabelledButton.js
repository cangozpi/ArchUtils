import React from "react";
import "./LabelledButton.css";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";

function LabelledButton({
  labelTxt,
  buttonTxt,
  buttonIcon,
  color,
  onFileChange,
}) {
  return (
    <div className="UploadDxfBtn">
      <div className="UploadDxfBtnLabel">
        <p>{labelTxt}</p>
      </div>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button
          variant="contained"
          component="label"
          color={color}
          size="small"
          endIcon={buttonIcon}
        >
          {buttonTxt}
          <input hidden type="file" name="file" onChange={onFileChange} />
          {/* <input
            hidden
            accept=".dxf"
            multiple
            type="file"
            onChange={onFileChange}
          /> */}
        </Button>
      </Stack>
    </div>
  );
}

export default LabelledButton;
