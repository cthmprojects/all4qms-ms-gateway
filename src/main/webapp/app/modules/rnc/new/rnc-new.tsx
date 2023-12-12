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
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

export const RNCNew = () => {
  const navigate = useNavigate();
  const [firstForm, setFirstForm] = useState({
    decision: {
      value: '',
      error: false,
    },
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

  const [native, setNative] = useState('');
  const onNativeChange = e => {
    setNative(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(firstForm);
  };

  const setClientRegister = data => {
    console.log(data);
  };

  const setMPRegister = data => {
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
    }
  };

  /*
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
                <MenuItem value="mp">Matéria prima</MenuItem>
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
  */

  return (
    <div>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Análise de Abrangência da NC
          </Typography>
          <br />
          <div>
            <label>
              Palavra-chave
              <input type="text" name="keyword" />
            </label>
            <IconButton color="secondary" aria-label="Adicionar palavra chave">
              <AddIcon />
            </IconButton>
          </div>
          <div>
            <textarea id="postTextAreaId" name="postContent" rows={3} cols={80} />
          </div>
        </CardContent>
      </Card>
      <Divider light />
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Ação Imediata / Disposição para conter a NC
          </Typography>
          <br />
          <div>
            <TextField label="Descrição da ação" defaultValue="Descrição" />
            <TextField label="Prazo" defaultValue="Prazo" />
            <TextField label="Responsável" defaultValue="Responsável" />
            <TextField label="Status" defaultValue="Status" />
            <IconButton color="secondary" aria-label="Editar">
              <EditIcon />
            </IconButton>
            <IconButton color="secondary" aria-label="Remover">
              <DeleteIcon />
            </IconButton>
            <IconButton color="secondary" aria-label="Adicionar">
              <AddIcon />
            </IconButton>
          </div>
        </CardContent>
      </Card>
      <Divider light />
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Decisão sobre Matéria-Prima/Insumo ou Decisão sobre Produto Acabado
          </Typography>
          <br />
          <div>
            <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
              <InputLabel>Decisão</InputLabel>
              <Select
                label="Decisão"
                name="decision"
                value={firstForm.decision.value}
                onChange={event => setFirstForm({ ...firstForm, decision: { value: event.target.value, error: firstForm.decision.error } })}
              >
                <MenuItem value="1">Produção</MenuItem>
                <MenuItem value="2">Engenharia de teste</MenuItem>
                <MenuItem value="3">Estoque</MenuItem>
                <MenuItem value="4">Expedição</MenuItem>
                <MenuItem value="5">PCP</MenuItem>
              </Select>
            </FormControl>
            <label>
              Descrição da Decisão:
              <TextField label="Descrição" name="descriptionDecision" size="small" />
            </label>
            <input type="date" value={native} onChange={onNativeChange} />
          </div>
          <br />
          <div>
            <TextField label="Responsável" defaultValue="" />
            <TextField label="Quantidade selecionada" defaultValue="" />
            <TextField label="Quantidade aprovada" defaultValue="" />
            <TextField label="Quantidade reprovada" defaultValue="" />
            <TextField label="% Rejeição" defaultValue="" />
          </div>
          <br />
        </CardContent>
      </Card>
      <Divider light />
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Investigação de Causas
          </Typography>
          <br />
          <div>
            <div>
              <textarea id="ncTextAreaId" name="ncArea" rows={5} cols={20} />
            </div>
            <div>
              <TextField label="Porquê" defaultValue="Porquê" size="small" />
              <TextField label="Porquê" defaultValue="Porquê" size="small" />
              <TextField label="Porquê" defaultValue="Porquê" size="small" />
            </div>
            <div>
              <TextField label="Porquê" defaultValue="Porquê" size="small" />
              <TextField label="Porquê" defaultValue="Porquê" size="small" />
              <TextField label="Porquê" defaultValue="Porquê" size="small" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Divider light />
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            5 Porquês
          </Typography>
          <br />
          <div>
            <TextField label="Descrição da ação" defaultValue="Descrição" />
            <TextField label="Prazo" defaultValue="Prazo" />
            <TextField label="Responsável" defaultValue="Responsável" />
            <TextField label="Status" defaultValue="Status" />
          </div>
        </CardContent>
      </Card>
      <Divider light />
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Plano de Ação Corretiva
          </Typography>
          <br />
          <div>
            <TextField label="Descrição da ação" defaultValue="Descrição" />
            <TextField label="Prazo" defaultValue="Prazo" />
            <TextField label="Responsável" defaultValue="Responsável" />
            <TextField label="Status" defaultValue="Status" />
            <TextField label="Verificação" defaultValue="Verificação" />
            <TextField label="Responsável Verificação" defaultValue="Responsável" />

            <IconButton color="secondary" aria-label="Editar">
              <EditIcon />
            </IconButton>
            <IconButton color="secondary" aria-label="Remover">
              <DeleteIcon />
            </IconButton>
            <IconButton color="secondary" aria-label="Adicionar">
              <AddIcon />
            </IconButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RNCNew;
