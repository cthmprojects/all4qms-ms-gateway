import React, { useEffect } from 'react';
import { ValidatedField, ValidatedForm, isEmail } from 'react-jhipster';
import { Button, Alert, Col, Row } from 'reactstrap';
import { toast } from 'react-toastify';

import { handlePasswordResetInit, reset } from '../password-reset.reducer';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const PasswordResetInit = () => {
  const dispatch = useAppDispatch();

  useEffect(
    () => () => {
      dispatch(reset());
    },
    []
  );

  const handleValidSubmit = ({ email }) => {
    dispatch(handlePasswordResetInit(email));
  };

  const successMessage = useAppSelector(state => state.passwordReset.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage]);

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h1>Nova senha</h1>
          <Alert color="warning">
            <p>Informe endereço de e-mail utilizado no cadastro</p>
          </Alert>
          <ValidatedForm onSubmit={handleValidSubmit}>
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
              data-cy="emailResetPassword"
            />
            <Button color="primary" type="submit" data-cy="submit">
              Criar nova senha
            </Button>
          </ValidatedForm>
        </Col>
      </Row>
    </div>
  );
};

export default PasswordResetInit;
