import React from "react";
import "./Banner.css";
import architectLogo from "../../architect-icon.jpg";

function Banner({ title }) {
  return (
    <div className="banner">
      <div className="max_width_wrapper">
        <img className="icon" src={architectLogo} alt="architect icon" />
        <div className="title">
          <h2>{title}</h2>
        </div>
      </div>
    </div>
  );
}

export default Banner;
