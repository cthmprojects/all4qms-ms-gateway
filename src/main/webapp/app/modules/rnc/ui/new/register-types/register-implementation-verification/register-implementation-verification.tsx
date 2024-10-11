import {
  Breadcrumbs,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row } from 'reactstrap';
import DatePicker from 'react-datepicker';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { getById, update } from 'app/modules/rnc/reducers/rnc.reducer';
import { Rnc } from 'app/modules/rnc/models';
import { updateApprovalNC, getApprovalNC } from 'app/modules/rnc/reducers/approval.reducer';
import { toast } from 'react-toastify';
import { IUser } from 'app/shared/model/user.model';

export const RegisterImplementationVerification = ({ handleTela, handlePrazoVerificacao }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const account = useAppSelector(state => state.authentication.accountQms) as IUser;

  useEffect(() => {
    dispatch(getUsers({}));
    if (id) {
      dispatch(getById(parseInt(id)));
    }
  }, []);

  const [firstForm, setFirstForm] = useState({
    date: { value: new Date(), error: false },
    emitter: { value: '' as unknown as number, error: false },
    verified: { value: false, error: false },
    description: { value: '', error: false },
  });

  const handleChangeDate = (value: any) => {
    setFirstForm({ ...firstForm, date: { value: value, error: firstForm.date.error } });
    handlePrazoVerificacao(value);
  };

  const saveVerification = () => {
    if (verification) {
      dispatch(
        updateApprovalNC({
          ...verification,
          possuiEficacia: firstForm.verified.value,
          dataEficacia: firstForm.date.value,
          responsavelEficacia: users.find(user => user.id === firstForm.emitter.value)?.id,
          descEficacia: firstForm.description.value,
        })
      );
      toast.success('RNC Atualizada com sucesso!');
    }
  };

  const updateStatusButtonHandler = () => {
    if (!firstForm.verified.value) {
      setOpen(true);
      return;
    }
    updateStatus();
  };

  const updateStatus = () => {
    if (_rnc) {
      dispatch(
        updateApprovalNC({
          ...verification,
          possuiEficacia: firstForm.verified.value,
          dataEficacia: firstForm.date.value,
          responsavelEficacia: users.find(user => user.id === firstForm.emitter.value)?.id,
          descEficacia: firstForm.description.value,
        })
      );

      let newStatus: string = '';
      if (firstForm.verified.value) {
        newStatus = 'VALIDACAO';
      } else {
        newStatus = 'ELABORACAO';
      }

      dispatch(update({ ..._rnc, statusAtual: newStatus })).then(() => navigate('/rnc'));

      toast.success('RNC Atualizada com sucesso!');
    }
  };
  const _rnc: Rnc = useAppSelector(state => state.all4qmsmsgateway.rnc.entity);
  const verification = useAppSelector(state => state.all4qmsmsgateway.approval.entity);
  const users = useAppSelector(state => state.all4qmsmsgateway.users.entities);

  useEffect(() => {
    if (_rnc?.aprovacaoNC) {
      dispatch(getApprovalNC(_rnc.aprovacaoNC));
    }
  }, [_rnc]);

  useEffect(() => {
    if (verification) {
      const idResponsavelEficacia = users.find(user => user.id === verification.responsavelEficacia)?.id;
      const definitiveId = idResponsavelEficacia || account?.id;
      setFirstForm({
        date: { value: verification.dataEficacia ? new Date(verification.dataEficacia) : new Date(), error: false },
        emitter: {
          value: definitiveId || '',
          error: false,
        },
        verified: { value: verification.possuiEficacia, error: false },
        description: { value: verification.descEficacia, error: false },
      });
    } else {
      setFirstForm({ ...firstForm, emitter: { value: account.id, error: false } });
    }
  }, [verification, users, account]);

  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: '#fff' }} className="ms-5 me-5 pb-5">
      <Row className="justify-content-center mt-5 me-5">
        <Breadcrumbs aria-label="breadcrumb" className="pt-3 ms-5">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Link to={'/rnc'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            RNC
          </Link>
          <Link to={'/rnc/general/implementacao/validacao'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
            Eficácia
          </Link>
        </Breadcrumbs>
      </Row>
      <div className="container-style">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="me-5">
            <h2 style={{ fontSize: '20px', color: '#000000DE' }}>Verificação de Eficácia</h2>
            <div className="mt-3" style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
              <FormControlLabel
                label="Sim"
                control={
                  <Checkbox
                    onChange={() => setFirstForm({ ...firstForm, verified: { value: true, error: false } })}
                    checked={firstForm.verified.value}
                  />
                }
              />
              <FormControlLabel
                label="Não"
                control={
                  <Checkbox
                    onChange={() => setFirstForm({ ...firstForm, verified: { value: false, error: false } })}
                    checked={!firstForm.verified.value}
                  />
                }
              />
            </div>
          </div>
          <FormControl className="mb-2 rnc-form-field me-5 mt-5">
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={firstForm.date.value}
              onChange={date => handleChangeDate(date)}
              className="date-picker"
              value={firstForm.date.value}
            />
            <label htmlFor="" className="rnc-date-label">
              Data
            </label>
          </FormControl>
          <FormControl className="mt-5 mb-2 rnc-form-field">
            <InputLabel>Responsável</InputLabel>
            <Select
              label="Responsável"
              name="forwarded"
              value={firstForm.emitter.value as any}
              onChange={(e: SelectChangeEvent<string>) => {
                setFirstForm({ ...firstForm, emitter: { value: parseInt(e.target.value), error: false } });
              }}
            >
              {users.map((user, i) => (
                <MenuItem value={user.id as number} key={`user-${i}`}>
                  {user.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="mt-4">
          <h2 style={{ fontSize: '20px', color: '#000000DE' }}>Descrição da eficácia</h2>
          <textarea
            value={firstForm.description.value}
            onChange={e => setFirstForm({ ...firstForm, description: { value: e.target.value, error: false } })}
            rows={5}
            cols={80}
            style={{ width: '100%', border: '1px solid #c1c1c1', borderRadius: '4px' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px' }} className="mt-5">
          <Button variant="contained" className="me-3" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={() => navigate('/rnc')}>
            Voltar
          </Button>
          <Button onClick={() => saveVerification()}>Salvar</Button>
          <Button
            className="ms-3"
            variant="contained"
            color="primary"
            style={{ background: '#e6b200', color: '#4e4d4d' }}
            onClick={() => updateStatusButtonHandler()}
          >
            Avançar
          </Button>
        </div>
      </div>
      <Dialog open={open}>
        <DialogTitle>Confirmar reinício?</DialogTitle>
        <DialogContent>A resposta em "não" irá reiniciar o processo. Tem certeza que quer avançar?</DialogContent>
        <DialogActions>
          <Stack justifyContent="flex-end" gap="2.5rem" flexDirection="row" mt="20px">
            <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={() => setOpen(false)}>
              Voltar
            </Button>

            <Button
              type="submit"
              onClick={updateStatus}
              variant="contained"
              color="primary"
              style={{ background: '#e6b200', color: '#4e4d4d' }}
            >
              Confirmar
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RegisterImplementationVerification;
