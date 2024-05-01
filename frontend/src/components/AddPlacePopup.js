import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlaceSubmit }) {
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");
  const [titleError, setTitleError] = React.useState("");
  const [linkError, setLinkError] = React.useState("");
  const [isValid, setIsValid] = React.useState(false);

  React.useEffect(() => {
    const isTitleValid = name.length >= 2 && name.length <= 30;
    const isLinkValid = isUrlValid(link);
    setIsValid(isTitleValid && isLinkValid);
    setTitleError(document.getElementById("pTitle").validationMessage);
    setLinkError(document.getElementById("pLink").validationMessage);
  }, [name, link]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPlaceSubmit({ name, link });
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value);
  };

  const isUrlValid = (url) => {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(url);
  };

  return (
    <PopupWithForm
      name="newLocation"
      title="Novo Local"
      buttonId="createButton"
      buttonTextId="createButtonText"
      buttonText="Criar"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isValid={isValid}
    >
      <label className="popup__form-field">
        <input
          type="text"
          minLength="2"
          maxLength="30"
          placeholder="Titulo"
          id="pTitle"
          className="popup__text"
          required
          value={name}
          onChange={handleNameChange}
        />
        <span
          className={`error-message ${
            titleError ? "error-message_active" : ""
          }`}
          id="titleError"
        >
          {titleError}
        </span>
      </label>
      <label className="popup__form-field">
        <input
          type="url"
          placeholder="Link de Imagem"
          id="pLink"
          className="popup__text"
          required
          value={link}
          onChange={handleLinkChange}
        />
        <span
          className={`error-message ${linkError ? "error-message_active" : ""}`}
          id="linkError"
        >
          {linkError}
        </span>
      </label>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
