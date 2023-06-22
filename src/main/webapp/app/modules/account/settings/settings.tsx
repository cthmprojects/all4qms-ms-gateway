import React, { useEffect } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm, isEmail } from 'react-jhipster';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import { saveAccountSettings, reset } from './settings.reducer';

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);
  const successMessage = useAppSelector(state => state.settings.successMessage);

  useEffect(() => {
    dispatch(getSession());
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage]);

  const handleValidSubmit = values => {
    dispatch(
      saveAccountSettings({
        ...account,
        ...values,
      })
    );
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="settings-title">
            Configurações para o usuário [<strong>{account.login}</strong>]
          </h2>
          <ValidatedForm id="settings-form" onSubmit={handleValidSubmit} defaultValues={account}>
            <ValidatedField
              name="firstName"
              label="Nome"
              id="firstName"
              placeholder="Seu nome"
              validate={{
                required: { value: true, message: 'O nome é obrigatório.' },
                minLength: { value: 1, message: 'O nome deve ter pelo menos 1 caractere' },
                maxLength: { value: 50, message: 'O nome não pode ter mais de 50 caracteres' },
              }}
              data-cy="firstname"
            />
            <ValidatedField
              name="lastName"
              label="Sobrenome"
              id="lastName"
              placeholder="Seu sobrenome"
              validate={{
                required: { value: true, message: 'O sobrenome é obrigatório.' },
                minLength: { value: 1, message: 'O sobrenome deve ter pelo menos 1 caractere' },
                maxLength: { value: 50, message: 'O sobrenome não pode ter mais de 50 caracteres' },
              }}
              data-cy="lastname"
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
            <Button color="primary" type="submit" data-cy="submit">
              Salvar
            </Button>
          </ValidatedForm>
        </Col>
      </Row>
    </div>
  );
};

export default SettingsPage;
