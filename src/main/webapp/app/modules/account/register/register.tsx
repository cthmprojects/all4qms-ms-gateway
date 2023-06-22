import React, { useState, useEffect } from 'react';
import { ValidatedField, ValidatedForm, isEmail } from 'react-jhipster';
import { Row, Col, Alert, Button } from 'reactstrap';
import { toast } from 'react-toastify';

import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { handleRegister, reset } from './register.reducer';

export const RegisterPage = () => {
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  useEffect(
    () => () => {
      dispatch(reset());
    },
    []
  );

  const handleValidSubmit = ({ username, email, firstPassword }) => {
    dispatch(handleRegister({ login: username, email, password: firstPassword, langKey: 'pt-br' }));
  };

  const updatePassword = event => setPassword(event.target.value);

  const successMessage = useAppSelector(state => state.register.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage]);

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h1 id="register-title" data-cy="registerTitle">
            Cadastro
          </h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          <ValidatedForm id="register-form" onSubmit={handleValidSubmit}>
            <ValidatedField
              name="username"
              label="Usuário"
              placeholder="Seu usuário"
              validate={{
                required: { value: true, message: 'O usuário é obrigatório.' },
                pattern: {
                  value: /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                  message: 'Your username is invalid.',
                },
                minLength: { value: 1, message: 'O usuário deve ter pelo menos 1 caractere.' },
                maxLength: { value: 50, message: 'O usuário não pode ter mais de 50 caracteres.' },
              }}
              data-cy="username"
            />
            <ValidatedField
              name="email"
              label="E-mail"
              placeholder="Seu e-mail"
              type="email"
              validate={{
                required: { value: true, message: 'O e-mail é obrigatório.' },
                minLength: { value: 5, message: 'O e-mail deve ter pelo menos 5 caracteres' },
                maxLength: { value: 254, message: 'O e-mail não pode ter mais de 50 caracteres' },
                validate: v => isEmail(v) || 'E-mail inválido.',
              }}
              data-cy="email"
            />
            <ValidatedField
              name="firstPassword"
              label="Nova senha"
              placeholder="Nova senha"
              type="password"
              onChange={updatePassword}
              validate={{
                required: { value: true, message: 'A senha é obrigatória.' },
                minLength: { value: 4, message: 'A senha deve ter pelo menos 4 caracteres' },
                maxLength: { value: 50, message: 'A senha não pode ter mais de 50 caracteres' },
              }}
              data-cy="firstPassword"
            />
            <PasswordStrengthBar password={password} />
            <ValidatedField
              name="secondPassword"
              label="Confirmação de nova senha"
              placeholder="Confirme a nova senha"
              type="password"
              validate={{
                required: { value: true, message: 'A confirmação da senha é obrigatória.' },
                minLength: { value: 4, message: 'A confirmação da senha deve ter pelo menos 4 caracteres' },
                maxLength: { value: 50, message: 'A confirmação da senha não pode ter mais de 50 caracteres' },
                validate: v => v === password || 'A senha e sua confirmação devem ser iguais!',
              }}
              data-cy="secondPassword"
            />
            <Button id="register-submit" color="primary" type="submit" data-cy="submit">
              Cadastrar
            </Button>
          </ValidatedForm>
          <p>&nbsp;</p>
          <Alert color="warning">
            <span>Se deseja</span>
            <a className="alert-link">entrar</a>
            <span>
              , utilize as seguintes contas padrões:
              <br />- Administrador (usuário=&quot;admin&quot; and senha=&quot;admin&quot;) <br />- Usuário (usuário=&quot;user&quot; e
              senha=&quot;user&quot;).
            </span>
          </Alert>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
