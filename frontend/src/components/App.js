import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import * as auth from "../utils/auth.js";
import apiInstance from "../utils/api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import PopupWithForm from './PopupWithForm.js';
import Header from "./Header.js";
import Login from "./Login.js";
import Register from "./Register.js";
import ProtectedRoute from "./ProtectedRoute.js";
import Main from "./Main.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import EditProfilePopup from "./EditProfilePopup.js";
import ImagePopup from "./ImagePopup.js";
import Footer from "./Footer.js";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn") ? true : false);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [token, setToken] = useState(localStorage.getItem("jwt") || '');

  useEffect(() => {
    const token = localStorage.getItem("jwt");
  
    if (token) {
      setToken(token);
      auth.checkToken(token)
        .then(() => {
          setLoggedIn(true);
          setUserEmail(localStorage.getItem("userEmail"));
        })
        .catch((error) => {
          console.error("Erro ao verificar token:", error);
          setLoggedIn(false);
        });

        apiInstance.getUserInfo(token)
        .then((userInfo) => {
          setCurrentUser(userInfo.data);
        })
        .catch((error) => {
          console.log("Erro ao recuperar as informações do usuário atual:", error);
        });

        apiInstance.getCards(token)
        .then((cards) => {
          setCards(cards.data.reverse());
        })
        .catch((error) => {
          console.log("Erro ao obter os dados dos cartões:", error);
        });
    } else {
      setLoggedIn(false);
    }
  }, [token]);

  const handleLogin = (email) => {
    setLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", email);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserEmail("");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("jwt");
  };

  const handleUpdateUser = (userData) => {
    apiInstance.setUserInfo(userData)
      .then((updatedUser) => {
        setCurrentUser(updatedUser.data);
        closeAllPopups();
      })
      .catch((error) => {
        console.log("Erro ao atualizar perfil:", error);
      });
  };

  const handleUpdateAvatar = (avatarData) => {
    apiInstance.setUserAvatar(avatarData)
      .then((updatedUser) => {
        setCurrentUser(updatedUser.data);
        closeAllPopups();
      })
      .catch((error) => {
        console.log("Erro ao atualizar avatar:", error);
      });
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.includes(currentUser._id);
    apiInstance.changeLikeCardStatus(card._id, !isLiked)
      .then(({ data: newCard }) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((error) => {
        console.log("Erro ao atualizar status de curtida:", error);
      });
  };

  const handleCardDelete = () => {
    if (cardToDelete) {
      apiInstance.deleteCard(cardToDelete._id)
        .then(() => {
          setCards((prevCards) => prevCards.filter((c) => c._id !== cardToDelete._id));
          closeAllPopups();
        })
        .catch((error) => {
          console.log("Erro ao excluir o cartão:", error);
        });
    }
  };

  const handleAddPlaceSubmit = (newCardData) => {
    apiInstance.addCard(newCardData)
      .then(({ data: newCard }) => {
        setCards((prevCards) => [newCard, ...prevCards]);
        closeAllPopups();
      })
      .catch((error) => {
        console.log("Erro ao adicionar novo cartão:", error);
      });
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleDeleteButtonClick = (card) => {
    setIsDeleteConfirmationOpen(true);
    setCardToDelete(card);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsDeleteConfirmationOpen(false);
    setSelectedCard(null);
  };

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          loggedIn={loggedIn}
          userEmail={userEmail}
          onLogout={handleLogout}
        />
        <Switch>
          <Route path="/signin">
            <Login handleLogin={handleLogin} />
          </Route>
          <Route path="/signup">
            <Register />
          </Route>
          <ProtectedRoute path="/" loggedIn={loggedIn}>
            <Main
              isEditProfilePopupOpen={isEditProfilePopupOpen}
              isAddPlacePopupOpen={isAddPlacePopupOpen}
              isEditAvatarPopupOpen={isEditAvatarPopupOpen}
              isDeleteConfirmationOpen={isDeleteConfirmationOpen}
              cards={cards}
              selectedCard={selectedCard}
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onEditAvatarClick={handleEditAvatarClick}
              onCloseClick={closeAllPopups}
              onCardClick={handleCardClick}
              onDeleteButtonClick={handleDeleteButtonClick}
              onConfirmDelete={handleCardDelete}
              onUpdateUser={handleUpdateUser}
              onCardLike={handleCardLike}
            />
          </ProtectedRoute>
        </Switch>
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlaceSubmit={handleAddPlaceSubmit}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <ImagePopup selectedCard={selectedCard} onClose={closeAllPopups} />
        <PopupWithForm
          name="DeleteConfirmation"
          title="Tem Certeza?"
          buttonId="confirmButton"
          buttonTextId="confirmButtonText"
          buttonText="Sim"
          isOpen={isDeleteConfirmationOpen}
          onClose={closeAllPopups}
          onSubmit={handleCardDelete}
          isValid={true}
        />
        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;