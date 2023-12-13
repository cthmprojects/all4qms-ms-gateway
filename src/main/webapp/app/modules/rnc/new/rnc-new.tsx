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
    palavras: {
      value: [],
    },
    palavra: {
      value: '',
    },
  });

  const [dateDecision, setDateDecision] = useState('');
  const onDateDecisionChange = e => {
    setDateDecision(e.target.value);
  };

  const [keyWord, setKeyword] = useState('');
  const onKeywordChange = e => {
    setKeyword(e.target.value);
  };

  const [actionDescription, setActionDescription] = useState('');
  const onActionDescriptionChange = e => {
    setActionDescription(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
  };

  /*
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
  */
  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">RNC</Typography>
        </Breadcrumbs>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Análise de Abrangência da NC
            </Typography>
            <br />
            <div className="form-group">
              <label>Palavra-chave</label>
              <input type="text" name="keyword" className="form-control" value={keyWord} onChange={onKeywordChange} />
              <IconButton color="secondary" aria-label="Adicionar palavra chave">
                <AddIcon />
              </IconButton>
            </div>
            <div>
              <textarea id="postTextAreaId" value={keyWord} name="postContent" rows={3} cols={80} />
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
              <TextField
                label="Descrição da ação"
                defaultValue="Descrição"
                value={actionDescription}
                onChange={onActionDescriptionChange}
              />
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
                  onChange={event =>
                    setFirstForm({ ...firstForm, decision: { value: event.target.value, error: firstForm.decision.error } })
                  }
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
              <input type="date" value={dateDecision} onChange={onDateDecisionChange} />
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
    </div>
  );
};

export default RNCNew;
