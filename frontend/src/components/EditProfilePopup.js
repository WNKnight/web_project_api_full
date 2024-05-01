import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  const [aboutError, setAboutError] = React.useState("");
  const [isValid, setIsValid] = React.useState(false);

  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [currentUser]);

  React.useEffect(() => {
    const isNameValid = name.length >= 2 && name.length <= 40;
    const isDescriptionValid =
      description.length >= 2 && description.length <= 200;
    setIsValid(isNameValid && isDescriptionValid);

    setNameError(document.getElementById("pName").validationMessage);
    setAboutError(document.getElementById("pAboutme").validationMessage);
  }, [name, description]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  };

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Editar perfil"
      name="editProfile"
      buttonId="saveButton"
      buttonTextId="saveButtonText"
      buttonText="Salvar"
      onSubmit={handleSubmit}
      isValid={isValid}
    >
      <label className="popup__form-field">
        <input
          type="text"
          minLength="2"
          maxLength="40"
          placeholder="Nome"
          id="pName"
          className="popup__text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <span
          className={`error-message ${nameError ? "error-message_active" : ""}`}
          id="nameError"
        >
          {nameError}
        </span>
      </label>
      <label className="popup__form-field">
        <input
          type="text"
          minLength="2"
          maxLength="200"
          placeholder="Sobre Mim"
          id="pAboutme"
          className="popup__text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <span
          className={`error-message ${
            aboutError ? "error-message_active" : ""
          }`}
          id="aboutError"
        >
          {aboutError}
        </span>
      </label>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
