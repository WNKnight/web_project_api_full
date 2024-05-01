import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import InfoToolTip from "./InfoToolTip";
import * as auth from "../utils/auth.js";
import "../blocks/authForms.css";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToolTip, setShowToolTip] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const history = useHistory();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await auth.authorize(email, password);
      handleLogin(email);
      setIsSuccess(true);
      setShowToolTip(true);
      setTimeout(() => {
        setIsSuccess(false);
        setShowToolTip(false);
        history.push("/");
      }, 2000);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setIsSuccess(false);
      setShowToolTip(true);
    }
  };

  const handleToolTipClose = () => {
    setShowToolTip(false);
  };

  return (
    <div className="auth auth__login">
      <p className="auth__welcome auth__login-welcome">Entrar</p>
      <form onSubmit={handleSubmit} className="auth__form auth__login-form">
        <input
          className="auth__form-field auth__login-form-field"
          name="email"
          id="email"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={handleEmailChange}
          minLength={1}
          maxLength={50}
          required
        />
        <input
          className="auth__form-field auth__login-form-field"
          name="password"
          id="password"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={handlePasswordChange}
          minLength={6}
          maxLength={20}
          required
        />
      <button type="submit" className="auth__button auth__login-button">
          Entrar
      </button>
      </form>
      <Link to="/signup" className="auth__link auth__login-signup">
        Ainda não é membro? Inscreva-se aqui!
      </Link>
      {showToolTip && (
        <InfoToolTip
          isOpen={showToolTip}
          isSuccess={isSuccess}
          message={
            isSuccess
              ? "Logado com sucesso!"
              : "Ops, algo deu errado! Por favor, tente novamente."
          }
          onClose={handleToolTipClose}
        />
      )}
    </div>
  );
}

export default Login;