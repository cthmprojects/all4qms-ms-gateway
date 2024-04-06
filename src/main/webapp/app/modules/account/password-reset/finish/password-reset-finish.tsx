import React, { useState, useEffect } from 'react';
import { Col, Row, Button } from 'reactstrap';
import { Storage, ValidatedField, ValidatedForm } from 'react-jhipster';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { handlePasswordResetFinish, reset } from '../password-reset.reducer';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Breadcrumbs, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ChangePassword } from './password-change';

export const PasswordResetFinishPage = () => {
  const [oldPassword, setOldPassword] = useState({ value: '', error: false });
  const [password, setPassword] = useState({ value: '', error: false });
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: false });
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  const validateOldPassword = (txt: string) => {
    if (!txt) {
      setPasswordErrorMsg('A senha é obrigatória.');
      setOldPassword({ value: txt, error: true });
    } else if (txt.length < 4) {
      setPasswordErrorMsg('A senha deve ter pelo menos 4 caracteres');
      setOldPassword({ value: txt, error: true });
    } else if (txt.length > 50) {
      setPasswordErrorMsg('A senha não pode ter mais de 50 caracteres');
      setOldPassword({ value: txt, error: true });
    } else {
      setPasswordErrorMsg('');
      setOldPassword({ value: txt, error: false });
    }
  };

  const validatePassword = (txt: string) => {
    if (!txt) {
      setPasswordErrorMsg('A senha é obrigatória.');
      setPassword({ value: txt, error: true });
    } else if (txt.length < 4) {
      setPasswordErrorMsg('A senha deve ter pelo menos 4 caracteres');
      setPassword({ value: txt, error: true });
    } else if (txt.length > 50) {
      setPasswordErrorMsg('A senha não pode ter mais de 50 caracteres');
      setPassword({ value: txt, error: true });
    } else {
      setPasswordErrorMsg('');
      setPassword({ value: txt, error: false });
    }
  };

  const validateConfirmPassword = (txt: string) => {
    if (!txt) {
      setPasswordErrorMsg('A senha é obrigatória.');
      setConfirmPassword({ value: txt, error: true });
    } else if (txt.length < 4) {
      setPasswordErrorMsg('A senha deve ter pelo menos 4 caracteres');
      setConfirmPassword({ value: txt, error: true });
    } else if (txt.length > 50) {
      setPasswordErrorMsg('A senha não pode ter mais de 50 caracteres');
      setConfirmPassword({ value: txt, error: true });
    } else {
      setPasswordErrorMsg('');
      setConfirmPassword({ value: txt, error: false });
    }
  };

  const handleValidSubmit = ({ oldPassword, newPassword }) => {
    ChangePassword(oldPassword, newPassword)
      .then(() => {
        toast.success('Senha alterada com sucesso!');
      })
      .catch(() => {
        toast.error('Erro ao alterar senha!');
      });
  };

  const successMessage = useAppSelector(state => state.passwordReset.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage]);

  return (
    <div style={{ background: '#fff' }} className="ms-5 me-5 pb-5">
      <Row className="justify-content-center mt-5">
        <Breadcrumbs aria-label="breadcrumb" className="pt-3 ms-5">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography style={{ color: '#606060' }}>Troca de senha</Typography>
        </Breadcrumbs>
      </Row>
      <div className="container-style">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 className="mt-2">Insira suas informações</h3>

          <FormControl variant="outlined" className="mt-2">
            <InputLabel htmlFor="password">Senha atual</InputLabel>
            <OutlinedInput
              id="password"
              sx={{ width: '300px' }}
              label="Senha atual"
              type="password"
              value={oldPassword.value}
              error={oldPassword.error}
              onChange={e => validateOldPassword(e.target.value)}
            />
          </FormControl>

          <FormControl variant="outlined" className="mt-2">
            <InputLabel htmlFor="password">Senha</InputLabel>
            <OutlinedInput
              id="password"
              sx={{ width: '300px' }}
              label="Senha"
              type="password"
              value={password.value}
              error={password.error}
              onChange={e => validatePassword(e.target.value)}
            />
          </FormControl>

          <FormControl variant="outlined" className="mt-2">
            <InputLabel htmlFor="confirm-password">Confirmar senha</InputLabel>
            <OutlinedInput
              id="confirm-password"
              sx={{ width: '300px' }}
              type="password"
              label="Confirmar senha"
              value={confirmPassword.value}
              error={confirmPassword.error}
              onChange={e => validateConfirmPassword(e.target.value)}
            />
          </FormControl>

          <span className="mt-2" style={{ color: 'red' }}>
            {passwordErrorMsg}
          </span>

          <Button
            variant="contained"
            color="primary"
            style={{ width: '300px', background: '#e6b200', color: '#4e4d4d' }}
            className="mt-3"
            disabled={password.error || confirmPassword.error || !password.value || !confirmPassword.value}
            onClick={() => handleValidSubmit({ oldPassword: oldPassword.value, newPassword: password.value })}
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetFinishPage;
