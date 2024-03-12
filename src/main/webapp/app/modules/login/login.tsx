import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { login } from 'app/shared/reducers/authentication';
import LoginModal from './login-modal';

import './login.scss';
import { Link } from 'react-router-dom';
import { TextField } from '@mui/material';
import { Row } from 'reactstrap';

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

  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleUsernameChange = event => {
    setUsername(event.target.value);
    event.target.value === '' ? setUsernameError(true) : setUsernameError(false);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
    event.target.value === '' ? setPasswordError(true) : setPasswordError(false);
  };

  const handleLoginFormSubmit = event => {
    password === '' ? setPasswordError(true) : setPasswordError(false);
    username === '' ? setUsernameError(true) : setUsernameError(false);

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
        <form onSubmit={handleLoginFormSubmit}>
          <Row>
            <TextField
              id="outlined-required"
              label="Usuário"
              //value={username}
              onChange={handleUsernameChange}
              className="textField"
              error={usernameError}
              //autoFocus
            />
          </Row>
          <Row>
            <TextField
              id="outlined-password-input"
              label="Senha"
              type="password"
              // autoComplete="current-password"
              //value={password}
              onChange={handlePasswordChange}
              className="textField"
              error={passwordError}
            />
          </Row>
          <Row>
            {/*             <div className="leftDiv-checkBoxContainer"> */}
            {/*               <label className="leftDiv-checkBoxLabel"> */}
            {/*                 <input type="checkbox" className="leftDiv-checkBox" /> */}
            {/*                 Continuar logado */}
            {/*               </label> */}
            {/*             </div> */}
          </Row>
          <Row>
            <div className="leftDiv-buttonContainer">
              <button className="leftDiv-button" onClick={handleLoginFormSubmit} type="submit">
                Entrar
              </button>
              {/*               <span className="esqueciSenha">Esqueci minha senha</span> */}
            </div>
          </Row>
        </form>
      </div>
      <div className="rightDiv">
        <img src="../../content/images/login img.jpg" />
      </div>
    </div>
  );
};

export default Login;
