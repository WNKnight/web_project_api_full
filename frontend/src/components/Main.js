import React from "react";
import Card from "./Card.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Main({
  isEditProfilePopupOpen,
  isAddPlacePopupOpen,
  isEditAvatarPopupOpen,
  isDeleteConfirmationOpen,
  onEditProfileClick,
  selectedCard,
  onAddPlaceClick,
  onEditAvatarClick,
  onCloseClick,
  onCardClick,
  cards,
  onCardLike,
  onDeleteButtonClick,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <div className="profile">
        {currentUser && (
          <div
            className="profile__avatar-container"
            style={{ backgroundImage: `url(${currentUser.avatar})` }}
            onClick={onEditAvatarClick}
          >
            <img
              className="profile__avatar-image"
              src={currentUser.avatar}
              alt="foto de perfil"
            />
            <button className="profile__avatar-edit" id="avatarEdit"></button>
            <div className="profile__avatar-overlay"></div>
          </div>
        )}
        <div className="profile__info">
          {currentUser && (
            <>
              <h2 className="profile__name">{currentUser.name}</h2>
              <button
                className="profile__edit-button"
                id="editButton"
                onClick={onEditProfileClick}
              ></button>
              <h3 className="profile__about">{currentUser.about}</h3>
            </>
          )}
        </div>
        <button
          className="profile__add-button"
          id="addButton"
          onClick={onAddPlaceClick}
        ></button>
      </div>

      <div
        className={`overlay ${
          isEditProfilePopupOpen ||
          isAddPlacePopupOpen ||
          isEditAvatarPopupOpen ||
          isDeleteConfirmationOpen ||
          selectedCard
            ? "overlay_visible"
            : ""
        }`}
        onClick={onCloseClick}
      ></div>
      <section className="gallery">
        <ul className="card-list">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={onCardClick}
              onDeleteButtonClick={onDeleteButtonClick}
              onCardLike={onCardLike}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;