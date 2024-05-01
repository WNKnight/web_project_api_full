import React from "react";

function PopupWithForm(props) {
  return (
    <section
      className={`popup popup-forms popup_type_${props.name} ${
        props.isOpen ? "popup_is-opened" : ""
      }`}
      id={props.name}
    >
      <button
        className={`popup__close popup__close_${props.name}`}
        id={`close${props.name}`}
        onClick={props.onClose}
      ></button>
      <h2 className="popup__title" id={`title${props.name}`}>
        {props.title}
      </h2>
      <form
        className="popup__form"
        id={`${props.name}Form`}
        onSubmit={props.onSubmit}
      >
        {props.children}
      </form>
      <button
        type="submit"
        className={`popup__form-submit-button ${
          props.isValid ? "" : "popup__form-submit-button_disabled"
        }`}
        id={props.buttonId}
        onClick={props.onSubmit}
      >
        {props.buttonText}
      </button>
    </section>
  );
}

export default PopupWithForm;
