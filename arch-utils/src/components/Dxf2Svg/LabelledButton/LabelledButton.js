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
  isInputFlag,
  acceptedType,
  onButtonClick,
  children,
}) {
  return (
    <div className="UploadDxfBtn">
      <div className="UploadDxfBtnLabel">
        <p>{labelTxt}</p>
      </div>
      <Stack direction="column" alignItems="center" spacing={2}>
        <Button
          variant="contained"
          component="label"
          color={color}
          size="small"
          endIcon={buttonIcon}
          onClick={isInputFlag == false ? onButtonClick : null}
        >
          {buttonTxt}
          {isInputFlag && (
            <input
              hidden
              accept={acceptedType}
              type="file"
              onChange={onFileChange}
            />
          )}
        </Button>
        {children}
      </Stack>
    </div>
  );
}

export default LabelledButton;
