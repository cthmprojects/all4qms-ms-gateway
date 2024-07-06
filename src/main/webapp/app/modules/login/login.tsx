import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { login } from 'app/shared/reducers/authentication';
import { toast } from 'react-toastify';

import './login.scss';
import { TextField } from '@mui/material';
import { Alert, Row } from 'reactstrap';

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

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

  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const loginError = useAppSelector(state => state.authentication.loginError);

  useEffect(() => {
    if (loginError) {
      toast.error('Usuário ou senha inválidos');
    }
  }, [loginError]);

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
              error={loginError}
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
              error={loginError}
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
