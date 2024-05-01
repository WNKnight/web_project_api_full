import React, {useState , useEffect} from "react";
import { Switch, Route } from "react-router-dom";
import * as auth from "../utils/auth.js"
import apiInstance from "../utils/api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import Header from "./Header.js";
import Login from "./Login.js";
import Register from "./Register.js";
import ProtectedRoute from "./ProtectedRoute.js";
import Main from "./Main.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import EditProfilePopup from "./EditProfilePopup.js";
import Footer from "./Footer.js";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") ? true : false
  );  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      auth
        .checkToken(token)
        .then(() => {
          setLoggedIn(true);
          setUserEmail(localStorage.getItem("userEmail"));
        })
        .catch((error) => {
          console.error("Erro ao verificar token:", error);
          setLoggedIn(false);
        });
    } else {
      setLoggedIn(false);
    }

    apiInstance
      .getUserInfo()
      .then((userInfo) => {
        setCurrentUser(userInfo);
      })
      .catch((error) => {
        console.log(
          "Erro ao recuperar as informacoes do usuario atual:",
          error
        );
      });

    apiInstance
      .getCards()
      .then((data) => {
        setCards(data);
      })
      .catch((error) => {
        console.log("Erro ao obter os dados dos cartões:", error);
      });
  }, []);

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
    apiInstance
      .setUserInfo(userData)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((error) => {
        console.log("Erro ao atualizar perfil:", error);
      });
  };

  const handleUpdateAvatar = (avatarData) => {
    apiInstance
      .setUserAvatar(avatarData)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((error) => {
        console.log("Erro ao atualizar avatar:", error);
      });
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    apiInstance
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((error) => {
        console.log("Erro ao atualizar status de curtida:", error);
      });
  };

  const handleCardDelete = (card) => {
    apiInstance
      .deleteCard(card._id)
      .then(() => {
        setCards((prevCards) => prevCards.filter((c) => c._id !== card._id));
      })
      .catch((error) => {
        console.log("Erro ao excluir o cartão:", error);
      });
  };

  const handleAddPlaceSubmit = (newCardData) => {
    apiInstance
      .addCard(newCardData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
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

  const handleDeleteButtonClick = () => {
    setIsDeleteConfirmationOpen(true);
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
              selectedCard={selectedCard}
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onEditAvatarClick={handleEditAvatarClick}
              onCloseClick={closeAllPopups}
              onCardClick={handleCardClick}
              onDeleteButtonClick={handleDeleteButtonClick}
              onUpdateUser={handleUpdateUser}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
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
        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;