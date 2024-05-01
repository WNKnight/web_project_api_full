import React from "react";
import "../blocks/infoToolTip.css";
import Sucess from "../images/Sucess.png";
import Fail from "../images/Fail.png";

const InfoTooltip = ({ isOpen, onClose, isSuccess, message }) => {
  return (
    <>
      <div className={`info-tooltip-overlay ${isOpen ? "overlay_visible" : ""}`} onClick={onClose}></div>
      <div className={`info-tooltip ${isOpen ? "info-tooltip_visible" : ""} ${isSuccess ? "info-tooltip_success" : "info-tooltip_failure"}`}>
        <button className="info-tooltip__close-button" onClick={onClose}></button>
        <div className="info-tooltip__content">
          {isSuccess ? (
            <img src={Sucess} alt="Sucesso" />
          ) : (
            <img src={Fail} alt="Falha" />
          )}
          <p className="info-tooltip__content-text">{message}</p>
        </div>
      </div>
    </>
  );
};

export default InfoTooltip;
