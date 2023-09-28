import React, { useState } from 'react';
import {
  Breadcrumbs,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Row } from 'reactstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import './rnc-new.css';

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
      <Row className="ms-3 me-3 mt-3">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <TextField label="Nº" name="number" fullWidth disabled value={1} />
            </Grid>
            <Grid item xs={3}>
              <TextField label="Emitido por:" name="emissor" fullWidth value={'Admin'} disabled />
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth>
                <InputLabel>Processo ou empresa</InputLabel>
                <Select label="Processo ou empresa" name="processo">
                  <MenuItem value="1">Produção</MenuItem>
                  <MenuItem value="2">Engenharia de teste</MenuItem>
                  <MenuItem value="3">Estoque</MenuItem>
                  <MenuItem value="4">Expedição</MenuItem>
                  <MenuItem value="5">PCP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Encaminhado para:</InputLabel>
                <Select label="Encaminhado para:" name="encaminhado">
                  <MenuItem value="1">Usuário 1</MenuItem>
                  <MenuItem value="2">Usuário 2</MenuItem>
                  <MenuItem value="3">Usuário 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth>
                <DatePicker selected={date} onChange={date => setDate(date)} className="date-picker" />
              </FormControl>
            </Grid>

            {/* <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField label="Login" name="login" fullWidth />
                            </FormControl>
                        </Grid>
                        <Grid item xs={1}>
                        <FormControlLabel control={<Checkbox name="manager" />} label="Gestor" />
                        </Grid>
                        <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel>Gestor</InputLabel>
                            <Select name="Gestor" label="Gestor" >
                            <MenuItem value="1">Admin</MenuItem>
                            <MenuItem value="2">Usuário</MenuItem>
                            </Select>
                        </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel>Setor</InputLabel>
                            <Select name="setor" label="Setor" >
                            <MenuItem value=""></MenuItem>
                            </Select>
                        </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel>Função</InputLabel>
                            <Select name="role" label="Função">
                            {funcaos
                                ? funcaos.map(otherEntity => (
                                    <MenuItem value={otherEntity.id} key={otherEntity.id}>
                                    {otherEntity.nome}
                                    </MenuItem>
                                ))
                                : null}
                            </Select>
                        </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel>Processos</InputLabel>
                            <Select name="processes" label="Processos">
                            {processos
                                ? processos.map(otherEntity => (
                                    <MenuItem value={otherEntity.id} key={otherEntity.id}>
                                    {otherEntity.nome}
                                    </MenuItem>
                                ))
                                : null}
                            </Select>
                        </FormControl>
                        </Grid> */}
            <Grid item xs={12} className="">
              <Button
                variant="contained"
                className="me-3"
                style={{ background: '#d9d9d9', color: '#4e4d4d' }}
                onClick={() => navigate('/usuario')}
              >
                Voltar
              </Button>
              <Button type="submit" variant="contained" color="primary" style={{ background: '#e6b200', color: '#4e4d4d' }}>
                Salvar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Row>
    </div>
  );
};

export default RNCNew;
