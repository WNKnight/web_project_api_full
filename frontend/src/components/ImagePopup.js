import React from "react";

function ImagePopup({ selectedCard, onClose }) {
  const handleClose = () => {
    onClose();
  };

  return (
    <section
      className={`popup popup-image ${selectedCard ? "show" : ""}`}
      id="popupImage"
    >
      {selectedCard && (
        <>
          <img
            className="popup__Image-Zoom"
            id="ImageZoom"
            alt={selectedCard.name}
            src={selectedCard.link}
          />
          <button
            className="popup__close popup__close_image"
            id="closeImage"
            onClick={handleClose}
          ></button>
          <h2 className="popup__image-text" id="ImageTitle">
            {selectedCard.name}
          </h2>
        </>
      )}
    </section>
  );
}

export default ImagePopup;
