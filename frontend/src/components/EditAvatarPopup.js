import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const avatarRef = React.useRef(null);
  const [avatarLinkError, setLinkError] = React.useState("");
  const [isValid, setIsValid] = React.useState(false);

  React.useEffect(() => {
    const isLinkValid = isUrlValid(avatarRef.current.value);
    setIsValid(isLinkValid);

    setLinkError(document.getElementById("pLinkAvatar").validationMessage);
  }, [avatarRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  };

  const isUrlValid = (url) => {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(url);
  };

  const handleInputChange = () => {
    const isLinkValid = isUrlValid(avatarRef.current.value);
    setIsValid(isLinkValid);
    setLinkError(avatarRef.current.validationMessage);
  };

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Editar avatar"
      name="editAvatar"
      buttonId="saveAvatarButton"
      buttonTextId="avatarButtonText"
      buttonText="Salvar"
      onSubmit={handleSubmit}
      isValid={isValid}
    >
      <label>
        <input
          placeholder="Link da Imagem"
          type="url"
          className="popup__text"
          id="pLinkAvatar"
          ref={avatarRef}
          onChange={handleInputChange}
          required
        />
        <span
          className={`error-message ${
            avatarLinkError ? "error-message_active" : ""
          }`}
          id="linkError"
        >
          {avatarLinkError}
        </span>
      </label>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
