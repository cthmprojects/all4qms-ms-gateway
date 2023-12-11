import React, { useState } from 'react';
import { Breadcrumbs, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Row } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import './rnc-new.css';
import ExternalAuditRegister from './register-types/external-audit/external-audit-register';
import DescriptionRnc from './register-types/description/description';
import RepetitionRnc from './register-types/repetition/repetition-rnc';
import Input from './../../../shared/components-form/input';

export const RNCNew = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const handleSubmit = () => {};

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
      <div className="ms-3 me-3 mt-3">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Input label="Nº" text={1} disabled />
            <Input label="Emitido por:" text={'Admin'} disabled style={{ marginLeft: '10px' }} />

            <FormControl className="form-field me-2">
              <InputLabel>Processo ou empresa</InputLabel>
              <Select label="Processo ou empresa">
                <MenuItem value="1">Produção</MenuItem>
                <MenuItem value="2">Engenharia de teste</MenuItem>
                <MenuItem value="3">Estoque</MenuItem>
                <MenuItem value="4">Expedição</MenuItem>
                <MenuItem value="5">PCP</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="form-field me-2">
              <InputLabel>Encaminhado para:</InputLabel>
              <Select label="Encaminhado para:" name="encaminhado">
                <MenuItem value="1">Usuário 1</MenuItem>
                <MenuItem value="2">Usuário 2</MenuItem>
                <MenuItem value="3">Usuário 3</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="form-field me-2">
              <DatePicker selected={date} onChange={date => setDate(date)} className="date-picker" />
            </FormControl>

            <FormControl className="form-field me-2">
              <InputLabel>Tipo</InputLabel>
              <Select label="Selecione o tipo" name="encaminhado">
                <MenuItem value="1">NC</MenuItem>
                <MenuItem value="2">OM</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="form-field me-2">
              <InputLabel>Origem</InputLabel>
              <Select label="Selecione a origem" name="encaminhado">
                <MenuItem value="1">Auditoria externa</MenuItem>
                <MenuItem value="1">Auditoria interna</MenuItem>
                <MenuItem value="1">Cliente</MenuItem>
                <MenuItem value="1">Matéria prima</MenuItem>
                <MenuItem value="1">Produto acabado</MenuItem>
                <MenuItem value="1">Outros</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="mt-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
      <Row className="ms-3 me-3 mt-3" fullWidth>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <TextField label="Nº" name="number" disabled value={1} className="form-field" />

            <TextField label="Emitido por:" name="emissor" value={'Admin'} disabled className="form-field" />

            <FormControl className="form-field">
              <InputLabel>Processo ou empresa</InputLabel>
              <Select label="Processo ou empresa">
                <MenuItem value="1">Produção</MenuItem>
                <MenuItem value="2">Engenharia de teste</MenuItem>
                <MenuItem value="3">Estoque</MenuItem>
                <MenuItem value="4">Expedição</MenuItem>
                <MenuItem value="5">PCP</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="form-field">
              <InputLabel>Encaminhado para:</InputLabel>
              <Select label="Encaminhado para:" name="encaminhado">
                <MenuItem value="1">Usuário 1</MenuItem>
                <MenuItem value="2">Usuário 2</MenuItem>
                <MenuItem value="3">Usuário 3</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="form-field">
              <DatePicker selected={date} onChange={date => setDate(date)} className="date-picker" />
            </FormControl>
            <div className="mt-2">
              <FormControl className="form-field">
                <InputLabel>Tipo</InputLabel>
                <Select label="Selecione o tipo" name="encaminhado">
                  <MenuItem value="1">NC</MenuItem>
                  <MenuItem value="2">OM</MenuItem>
                </Select>
              </FormControl>

              <FormControl className="form-field">
                <InputLabel>Origem</InputLabel>
                <Select label="Selecione a origem" name="encaminhado">
                  <MenuItem value="1">Auditoria externa</MenuItem>
                  <MenuItem value="1">Auditoria interna</MenuItem>
                  <MenuItem value="1">Cliente</MenuItem>
                  <MenuItem value="1">Matéria prima</MenuItem>
                  <MenuItem value="1">Produto acabado</MenuItem>
                  <MenuItem value="1">Outros</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="mt-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
      </Row>
      <Row className="ms-3 me-3 mt-3" fullWidth>
        <ExternalAuditRegister />
      </Row>
      <Row className="ms-3 me-3 mt-3" fullWidth>
        <DescriptionRnc />
      </Row>
      <Row className="ms-3 me-3 mt-3" fullWidth>
        <RepetitionRnc />
      </Row>
    </div>
  );
};

export default RNCNew;
