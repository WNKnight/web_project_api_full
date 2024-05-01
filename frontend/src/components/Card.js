import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Card({ card, onCardClick, onDeleteButtonClick, onCardLike }) {
  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((i) => i._id === currentUser._id);

  const cardDeleteButton = `card__delete-button ${
    isOwn ? "card__delete-button_visible" : "card__delete-button_hidden"
  }`;

  const cardLikeButton = `card__like-button ${
    isLiked ? "card__like-button_liked" : ""
  }`;

  const handleCardClick = () => {
    onCardClick(card);
  };

  const handleDeleteButtonClick = () => {
    onDeleteButtonClick(card);
  };

  const handleLikeClick = () => {
    onCardLike(card);
  };

  return (
    <li className="card">
      <img
        className="card__img"
        src={card.link}
        alt={card.name}
        onClick={handleCardClick}
      />
      <button
        className={cardDeleteButton}
        id="deleteButton"
        onClick={handleDeleteButtonClick}
      ></button>
      <div className="card__info">
        <h2 className="card__img-name">{card.name}</h2>
        <div className="card__like-container">
          <button
            type="button"
            className={cardLikeButton}
            onClick={handleLikeClick}
          ></button>
          <span className="card__like-count">{card.likes.length}</span>
        </div>
      </div>
    </li>
  );
}

export default Card;
