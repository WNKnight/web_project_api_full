class Api {
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.headers = config.headers;
  }

  _makeRequest(path, method = "GET", data = null) {
    const options = {
      method,
      headers: this.headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    if (method === "GET") {
      delete options.body;
    }

    return fetch(`${this.baseUrl}${path}`, options).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Erro: ${res.status}`);
    });
  }

  getUserInfo() {
    return this._makeRequest("/users/me");
  }

  setUserInfo(data) {
    return this._makeRequest("/users/me", "PATCH", data);
  }

  getCards() {
    return this._makeRequest("/cards");
  }

  changeLikeCardStatus(cardId, isLiked) {
    const method = isLiked ? "PUT" : "DELETE";
    return this._makeRequest(`/cards/likes/${cardId}`, method);
  }

  deleteCard(cardId) {
    return this._makeRequest(`/cards/${cardId}`, "DELETE");
  }

  setUserAvatar(data) {
    return this._makeRequest("/users/me/avatar", "PATCH", data);
  }

  addCard(data) {
    return this._makeRequest("/cards", "POST", data);
  }
}

const apiInstance = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/web_ptbr_08",
  headers: {
    authorization: "7887b144-3999-4d14-a3d6-51691cca960c",
    "Content-Type": "application/json",
  },
});

export default apiInstance;
