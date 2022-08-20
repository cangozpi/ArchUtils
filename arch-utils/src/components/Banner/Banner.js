import React from "react";
import "./Banner.css";
import architectLogo from "../../logo512.png";
import InfoIcon from "@mui/icons-material/Info";

function Banner({ title, showTutorial, setShowTutorial }) {
  function HelpIconClicked() {
    // Show User Tutorial
    if (showTutorial == true) {
      // user has not completed the tutorial before yet wants to see again
      setShowTutorial(false); // update state so that re-rendering takes place
      setShowTutorial(true);
    } else {
      // user has taken the tutorial before but wants to see again
      setShowTutorial(true);
    }
  }
  return (
    <div className="banner">
      <div className="max_width_wrapper">
        <img className="icon" src={architectLogo} alt="architect icon" />
        <div className="title">
          <h2>{title}</h2>
        </div>
        <div className="info_icon_wrapper">
          <InfoIcon className="info_icon" onClick={HelpIconClicked} />
        </div>
      </div>
    </div>
  );
}

export default Banner;
