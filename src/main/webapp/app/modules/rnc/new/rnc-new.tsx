import React, { useEffect, useState } from 'react';
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
import MPRegister from './register-types/mp-register/mp-register';
import ProductRegister from './register-types/product-register/product-register';
import OthersRegister from './register-types/others-register/others-register';

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

  const [secondForm, setSecondForm] = useState(false);
  const [formError, setFormError] = useState(false);

  const validateProcessOrigin = () => {
    let valid = true;
    if (firstForm.processOrigin.value == '') {
      setFirstForm({ ...firstForm, processOrigin: { value: '', error: true } });
      setFormError(true);
      valid = false;
    } else {
      setFirstForm({ ...firstForm, processOrigin: { value: firstForm.processOrigin.value, error: false } });
      setFormError(false);
    }
    return valid;
  };

  const validateForwarded = () => {
    let valid = true;
    if (firstForm.forwarded.value == '') {
      setFirstForm({ ...firstForm, forwarded: { value: '', error: true } });
      setFormError(true);
      valid = false;
    } else {
      setFirstForm({ ...firstForm, forwarded: { value: firstForm.forwarded.value, error: false } });
      setFormError(false);
    }
    return valid;
  };

  const validateProcessTarget = () => {
    let valid = true;
    if (firstForm.processTarget.value == '') {
      setFirstForm({ ...firstForm, processTarget: { value: '', error: true } });
      setFormError(true);
      valid = false;
    } else {
      setFirstForm({ ...firstForm, processTarget: { value: firstForm.processTarget.value, error: false } });
      setFormError(false);
    }
    return valid;
  };

  const validateType = () => {
    let valid = true;
    if (firstForm.type.value == '') {
      setFirstForm({ ...firstForm, type: { value: '', error: true } });
      setFormError(true);
      valid = false;
    } else {
      setFirstForm({ ...firstForm, type: { value: firstForm.type.value, error: false } });
      setFormError(false);
    }
    return valid;
  };

  const validateOrigin = () => {
    let valid = true;
    if (firstForm.origin.value == '') {
      setFirstForm({ ...firstForm, origin: { value: '', error: true } });
      setFormError(true);
      valid = false;
    } else {
      setFirstForm({ ...firstForm, origin: { value: firstForm.origin.value, error: false } });
      setFormError(false);
    }
    return valid;
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!validateProcessOrigin()) {
      return;
    }

    if (!validateForwarded()) {
      return;
    }

    if (!validateProcessTarget()) {
      return;
    }

    if (!validateType()) {
      return;
    }

    if (!validateOrigin()) {
      return;
    }

    setSecondForm(true);
  };

  const setClientRegister = data => {
    console.log(data);
  };

  const setMPRegister = data => {
    console.log(data);
  };

  const setProductRegister = data => {
    console.log(data);
  };

  const setOthersRegister = data => {
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
      case 'mp':
        return <MPRegister onMPChange={setMPRegister} />;
      case 'endProduct':
        return <ProductRegister onProductRegisterChange={setProductRegister} />;
      case 'others':
        return <OthersRegister onOthersRegisterChange={setOthersRegister} />;
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
                disabled={secondForm}
                value={firstForm.processOrigin.value}
                // error={}
                error={firstForm.processOrigin.error}
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
                disabled={secondForm}
                value={firstForm.forwarded.value}
                error={firstForm.forwarded.error}
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
                disabled={secondForm}
                value={firstForm.processTarget.value}
                error={firstForm.processTarget.error}
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
                disabled={secondForm}
                onChange={date => setFirstForm({ ...firstForm, date: { value: date, error: firstForm.date.error } })}
                className="date-picker"
              />
              <label htmlFor="" className="rnc-date-label">
                Data
              </label>
            </FormControl>

            <FormControl className="mb-2 rnc-form-field me-2">
              <InputLabel>Tipo</InputLabel>
              <Select
                label="Selecione o tipo"
                name="type"
                disabled={secondForm}
                error={firstForm.type.error}
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
                disabled={secondForm}
                value={firstForm.origin.value}
                error={firstForm.origin.error}
                onChange={event => setFirstForm({ ...firstForm, origin: { value: event.target.value, error: firstForm.origin.error } })}
              >
                <MenuItem value="externalAudit">Auditoria externa</MenuItem>
                <MenuItem value="internalAudit">Auditoria interna</MenuItem>
                <MenuItem value="client">Cliente</MenuItem>
                <MenuItem value="mp">Matéria prima</MenuItem>
                <MenuItem value="endProduct">Produto acabado</MenuItem>
                <MenuItem value="others">Outros</MenuItem>
              </Select>
            </FormControl>
          </div>
          {secondForm ? null : (
            <div className="mt-2 me-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                className="me-3"
                style={{ background: '#d9d9d9', color: '#4e4d4d' }}
                onClick={() => navigate('/rnc')}
              >
                Voltar
              </Button>
              <Button type="submit" variant="outlined" color="primary" style={{ color: '#384150', border: '1px solid #384150' }}>
                Salvar
              </Button>
              <Button
                className="ms-3"
                type="submit"
                variant="contained"
                color="primary"
                style={{ background: '#e6b200', color: '#4e4d4d' }}
              >
                Avançar
              </Button>
            </div>
          )}
        </form>
      </div>

      {secondForm ? (
        <>
          <Row className="ms-3 me-3 mt-3">{renderComponents()}</Row>
          <Row className="ms-3 me-3 mt-3">
            <DescriptionRnc />
          </Row>
          <Row className="ms-3 me-3 mt-3" fullWidth>
            <RepetitionRnc />
          </Row>
          <Row className="m-3">
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                className="me-3"
                style={{ background: '#d9d9d9', color: '#4e4d4d' }}
                onClick={() => navigate('/rnc')}
              >
                Voltar
              </Button>
              <Button variant="outlined" color="primary" style={{ color: '#384150', border: '1px solid #384150' }}>
                Salvar
              </Button>
              <Button className="ms-3" variant="contained" color="primary" style={{ background: '#e6b200', color: '#4e4d4d' }}>
                Avançar
              </Button>
            </div>
          </Row>
        </>
      ) : null}
    </div>
  );
};

export default RNCNew;
