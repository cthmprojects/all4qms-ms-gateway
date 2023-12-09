import React, { useState } from 'react';
import {
  Breadcrumbs,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Row } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import './rnc-new.css';
import ExternalAuditRegister from './register-types/external-audit/external-audit-register';
import DescriptionRnc from './register-types/description/description';
import RepetitionRnc from './register-types/repetition/repetition-rnc';
import Input from '../../../shared/components-form/input/input';
import InternalAuditRegister from './register-types/internal-audit/internal-audit-register';
import ClientRegister from './register-types/rnc-client/rnc-client-register';

export const RNCNew = () => {
  const navigate = useNavigate();
  const [firstForm, setFirstForm] = useState({
    number: {
      value: '1',
      error: false,
    },
    emitter: {
      value: '',
      error: false,
    },
    processOrigin: {
      value: '',
      error: false,
    },
    forwarded: {
      value: '',
      error: false,
    },
    processTarget: {
      value: '',
      error: false,
    },
    date: {
      value: new Date(),
      error: false,
    },
    type: {
      value: '',
      error: false,
    },
    origin: {
      value: '',
      error: false,
    },
  });

  const handleSubmit = e => {
    e.preventDefault();
    console.log(firstForm);
  };

  const setClientRegister = data => {
    console.log(data);
  };

  const renderComponents = () => {
    switch (firstForm.origin.value) {
      case 'externalAudit':
        return <ExternalAuditRegister />;
      case 'internalAudit':
        return <InternalAuditRegister />;
      case 'client':
        return <ClientRegister onClientChange={setClientRegister} />;
    }
  };

  return (
    <div style={{ background: '#fff' }} className="ms-5 me-5 pb-5">
      <Row className="justify-content-center mt-5">
        <Breadcrumbs aria-label="breadcrumb" className="pt-3 ms-5">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Link to={'/rnc'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
            RNC
          </Link>
          <Typography style={{ color: '#606060' }}>Cadastro de RNC</Typography>
        </Breadcrumbs>
        <h2 id="all4QmsMsGatewayApp.usuario.home.createOrEditLabel" data-cy="UsuarioCreateUpdateHeading" className="ms-5 mt-5">
          Cadastrar RNC
        </h2>
      </Row>
      <div className="container-style">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <TextField
              sx={{ height: '60px' }}
              label="Nº"
              name="number"
              id="rnc-text-field"
              disabled
              value={firstForm.number.value}
              className="rnc-form-field me-2 mb-2"
            />

            <TextField
              sx={{ height: '60px' }}
              label="Emitido por:"
              name="emitter"
              id="rnc-text-field"
              value={firstForm.emitter.value}
              disabled
              className="rnc-form-field me-2 mb-2"
            />

            <FormControl className="mb-2 rnc-form-field me-2">
              <InputLabel>Processo ou empresa</InputLabel>
              <Select
                label="Processo ou empresa"
                name="processOrigin"
                value={firstForm.processOrigin.value}
                onChange={event =>
                  setFirstForm({ ...firstForm, processOrigin: { value: event.target.value, error: firstForm.processOrigin.error } })
                }
              >
                <MenuItem value="1">Produção</MenuItem>
                <MenuItem value="2">Engenharia de teste</MenuItem>
                <MenuItem value="3">Estoque</MenuItem>
                <MenuItem value="4">Expedição</MenuItem>
                <MenuItem value="5">PCP</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="mb-2 rnc-form-field me-2">
              <InputLabel>Encaminhado para:</InputLabel>
              <Select
                label="Encaminhado para:"
                name="forwarded"
                value={firstForm.forwarded.value}
                onChange={event =>
                  setFirstForm({ ...firstForm, forwarded: { value: event.target.value, error: firstForm.forwarded.error } })
                }
              >
                <MenuItem value="1">Usuário 1</MenuItem>
                <MenuItem value="2">Usuário 2</MenuItem>
                <MenuItem value="3">Usuário 3</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="mb-2 rnc-form-field me-2">
              <InputLabel>Processo ou empresa</InputLabel>
              <Select
                label="Processo ou empresa"
                name="processTarget"
                value={firstForm.processTarget.value}
                onChange={event =>
                  setFirstForm({ ...firstForm, processTarget: { value: event.target.value, error: firstForm.processTarget.error } })
                }
              >
                <MenuItem value="1">Produção</MenuItem>
                <MenuItem value="2">Engenharia de teste</MenuItem>
                <MenuItem value="3">Estoque</MenuItem>
                <MenuItem value="4">Expedição</MenuItem>
                <MenuItem value="5">PCP</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="mb-2 rnc-form-field me-2">
              <DatePicker
                selected={firstForm.date.value}
                onChange={date => setFirstForm({ ...firstForm, date: { value: date, error: firstForm.date.error } })}
                className="date-picker"
              />
            </FormControl>

            <FormControl className="mb-2 rnc-form-field me-2">
              <InputLabel>Tipo</InputLabel>
              <Select
                label="Selecione o tipo"
                name="type"
                value={firstForm.type.value}
                onChange={event => setFirstForm({ ...firstForm, type: { value: event.target.value, error: firstForm.type.error } })}
              >
                <MenuItem value="1">NC</MenuItem>
                <MenuItem value="2">OM</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="mb-2 rnc-form-field me-2">
              <InputLabel>Origem</InputLabel>
              <Select
                label="Selecione a origem"
                name="origin"
                value={firstForm.origin.value}
                onChange={event => setFirstForm({ ...firstForm, origin: { value: event.target.value, error: firstForm.origin.error } })}
              >
                <MenuItem value="externalAudit">Auditoria externa</MenuItem>
                <MenuItem value="internalAudit">Auditoria interna</MenuItem>
                <MenuItem value="client">Cliente</MenuItem>
                <MenuItem value="rawMaterial">Matéria prima</MenuItem>
                <MenuItem value="endProduct">Produto acabado</MenuItem>
                <MenuItem value="others">Outros</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="mt-2 me-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              className="me-3"
              style={{ background: '#d9d9d9', color: '#4e4d4d' }}
              onClick={() => navigate('/rnc')}
            >
              Voltar
            </Button>
            <Button type="submit" variant="contained" color="primary" style={{ background: '#e6b200', color: '#4e4d4d' }}>
              Salvar
            </Button>
          </div>
        </form>
      </div>

      {firstForm.origin.value ? (
        <>
          <Row className="ms-3 me-3 mt-3">{renderComponents()}</Row>
          <Row className="ms-3 me-3 mt-3">
            <DescriptionRnc />
          </Row>
          <Row className="ms-3 me-3 mt-3" fullWidth>
            <RepetitionRnc />
          </Row>
        </>
      ) : null}
    </div>
  );
};

export default RNCNew;
