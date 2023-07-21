import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { login } from 'app/shared/reducers/authentication';
import LoginModal from './login-modal';

import './login.scss';
import { Link } from 'react-router-dom';
import { TextField } from '@mui/material';

export const Login = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const loginError = useAppSelector(state => state.authentication.loginError);
  const showModalLogin = useAppSelector(state => state.authentication.showModalLogin);
  const [showModal, setShowModal] = useState(showModalLogin);
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleUsernameChange = event => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const handleLoginFormSubmit = event => {
    event.preventDefault();
    dispatch(login(username, password));
  };

  const { from } = (location.state as any) || { from: { pathname: '/', search: location.search } };
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  return (
    <div className="fatherDiv">
      <div className="leftDiv">
        <img src="../../content/images/PDCAI logo.jpg" alt="Logo" style={{ width: '200px', marginBottom: '30px' }} />

        <TextField required id="outlined-required" label="Usuário" value={username} onChange={handleUsernameChange} className="textField" />
        <TextField
          id="outlined-password-input"
          label="Senha"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={handlePasswordChange}
          className="textField"
        />
        <div className="leftDiv-checkBoxContainer">
          <label className="leftDiv-checkBoxLabel">
            <input type="checkbox" className="leftDiv-checkBox" />
            Continuar logado
          </label>
        </div>
        <div className="leftDiv-buttonContainer">
          <button className="leftDiv-button" onClick={handleLoginFormSubmit}>
            Entrar
          </button>
          <span className="esqueciSenha">Esqueci minha senha</span>
        </div>
      </div>
      <div className="rightDiv">
        <img src="../../content/images/login img.jpg" />
      </div>
    </div>
  );
};

export default Login;
