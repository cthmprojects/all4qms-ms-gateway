import React, { useState, useEffect } from 'react';
import { Col, Row, Button } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { handlePasswordResetFinish, reset } from '../password-reset.reducer';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const PasswordResetFinishPage = () => {
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const key = searchParams.get('key');

  const [password, setPassword] = useState('');

  useEffect(
    () => () => {
      dispatch(reset());
    },
    []
  );

  const handleValidSubmit = ({ newPassword }) => dispatch(handlePasswordResetFinish({ key, newPassword }));

  const updatePassword = event => setPassword(event.target.value);

  const getResetForm = () => {
    return (
      <ValidatedForm onSubmit={handleValidSubmit}>
        <ValidatedField
          name="newPassword"
          label="Nova senha"
          placeholder="Nova senha"
          type="password"
          validate={{
            required: { value: true, message: 'A senha é obrigatória.' },
            minLength: { value: 4, message: 'A senha deve ter pelo menos 4 caracteres' },
            maxLength: { value: 50, message: 'A senha não pode ter mais de 50 caracteres' },
          }}
          onChange={updatePassword}
          data-cy="resetPassword"
        />
        <PasswordStrengthBar password={password} />
        <ValidatedField
          name="confirmPassword"
          label="Confirmação de nova senha"
          placeholder="Confirme a nova senha"
          type="password"
          validate={{
            required: { value: true, message: 'A confirmação da senha é obrigatória.' },
            minLength: { value: 4, message: 'A confirmação da senha deve ter pelo menos 4 caracteres' },
            maxLength: { value: 50, message: 'A confirmação da senha não pode ter mais de 50 caracteres' },
            validate: v => v === password || 'A senha e sua confirmação devem ser iguais!',
          }}
          data-cy="confirmResetPassword"
        />
        <Button color="success" type="submit" data-cy="submit">
          Validar nova senha
        </Button>
      </ValidatedForm>
    );
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
        <Col md="4">
          <h1>Criar nova senha</h1>
          <div>{key ? getResetForm() : null}</div>
        </Col>
      </Row>
    </div>
  );
};

export default PasswordResetFinishPage;
