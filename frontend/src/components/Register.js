import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import InfoToolTip from "./InfoToolTip";
import * as auth from "../utils/auth.js";
import "../blocks/authForms.css";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToolTip, setShowToolTip] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const history = useHistory()

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await auth.register(email, password);
      setShowToolTip(true);
      setIsSuccess(true);
      setTimeout(() => {
        history.push("/signin");
      }, 2000);
    } catch (error) {
      console.error('Falha ao registrar:', error);
      setShowToolTip(true);
      setIsSuccess(false);
    }
  };


  const handleToolTipClose = () => {
    setShowToolTip(false);
  };

  return (
    <div className="auth auth__register">
      <p className="auth__welcome auth__register-welcome">Inscrever-se</p>
      <form onSubmit={handleSubmit} className="auth__form auth__register-form">
        <input
          className="auth__form-field auth__register-form-field"
          id="email"
          name="email"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={handleEmailChange}
          minLength={1}
          maxLength={50}
          required
        />
        <input
          className="auth__form-field auth__register-form-field"
          id="password"
          name="password"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={handlePasswordChange}
          minLength={6}
          maxLength={20}
          required
        />
        <button type="submit" className="auth__button auth__register-button">
          Inscrever-se
        </button>
      </form>
      <Link to="/signin" className="auth__link auth__register-signin">
        Já é um membro? Faça o login aqui!
      </Link>
      {showToolTip && (
        <InfoToolTip
          isOpen={showToolTip}
          isSuccess={isSuccess}
          message={isSuccess ? 'Registrado com sucesso!' : 'Falha ao registrar. Por favor, tente novamente.'}
          onClose={handleToolTipClose}
        />
      )}
    </div>
  );
};

export default Register;
