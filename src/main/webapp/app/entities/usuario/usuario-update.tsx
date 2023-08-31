import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IFuncao } from 'app/shared/model/funcao.model';
import { getEntities as getFuncaos } from 'app/entities/funcao/funcao.reducer';
import { getEntities as getUsuarios } from 'app/entities/usuario/usuario.reducer';
import { ISetor } from 'app/shared/model/setor.model';
import { getEntities as getSetors } from 'app/entities/setor/setor.reducer';
import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { IProcesso } from 'app/shared/model/processo.model';
import { getEntities as getProcessos } from 'app/entities/processo/processo.reducer';
import { IUsuario } from 'app/shared/model/usuario.model';
import { getEntity, updateEntity, createEntity, reset } from './usuario.reducer';
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

export const UsuarioUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const funcaos = useAppSelector(state => state.all4qmsmsgateway.funcao.entities);
  const usuarios = useAppSelector(state => state.all4qmsmsgateway.usuario.entities);
  const setors = useAppSelector(state => state.all4qmsmsgateway.setor.entities);
  const users = useAppSelector(state => state.userManagement.users);
  const processos = useAppSelector(state => state.all4qmsmsgateway.processo.entities);
  const usuarioEntity = useAppSelector(state => state.all4qmsmsgateway.usuario.entity);
  const loading = useAppSelector(state => state.all4qmsmsgateway.usuario.loading);
  const updating = useAppSelector(state => state.all4qmsmsgateway.usuario.updating);
  const updateSuccess = useAppSelector(state => state.all4qmsmsgateway.usuario.updateSuccess);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    profile: '',
    login: '',
    manager: false,
    managerProfile: '',
    sector: '',
    role: '',
    processes: '',
  });

  const handleClose = () => {
    navigate('/usuario' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getFuncaos({}));
    dispatch(getUsuarios({}));
    dispatch(getSetors({}));
    dispatch(getUsers({}));
    dispatch(getProcessos({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    values.criadoEm = convertDateTimeToServer(values.criadoEm);
    values.atualizadoEm = convertDateTimeToServer(values.atualizadoEm);

    const entity = {
      ...usuarioEntity,
      ...values,
      processos: mapIdList(values.processos),
      funcao: funcaos.find(it => it.id.toString() === values.funcao.toString()),
      gestor: usuarios.find(it => it.id.toString() === values.gestor.toString()),
      criadoPor: usuarios.find(it => it.id.toString() === values.criadoPor.toString()),
      atualizadoPor: usuarios.find(it => it.id.toString() === values.atualizadoPor.toString()),
      setor: setors.find(it => it.id.toString() === values.setor.toString()),
      user: users.find(it => it.id.toString() === values.user.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          criadoEm: displayDefaultDateTime(),
          atualizadoEm: displayDefaultDateTime(),
        }
      : {
          ...usuarioEntity,
          criadoEm: convertDateTimeFromServer(usuarioEntity.criadoEm),
          atualizadoEm: convertDateTimeFromServer(usuarioEntity.atualizadoEm),
          funcao: usuarioEntity?.funcao?.id,
          gestor: usuarioEntity?.gestor?.id,
          setor: usuarioEntity?.setor?.id,
          user: usuarioEntity?.user?.id,
          criadoPor: usuarioEntity?.criadoPor?.id,
          atualizadoPor: usuarioEntity?.atualizadoPor?.id,
          processos: usuarioEntity?.processos?.map(e => e.id.toString()),
        };

  const handleChange = event => {
    const { name, value, type, checked } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
  };

  return (
    <div style={{ background: '#fff' }} className="ms-5 me-5 pb-5">
      <Row className="justify-content-center mt-5">
        <Breadcrumbs aria-label="breadcrumb" className="pt-3 ms-5">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Link to={'/'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
            Gerenciamento
          </Link>
          <Typography style={{ color: '#606060' }}>Criação e edição de usuário</Typography>
        </Breadcrumbs>
        <h2 id="all4QmsMsGatewayApp.usuario.home.createOrEditLabel" data-cy="UsuarioCreateUpdateHeading" className="ms-5 mt-5">
          Criar ou editar Usuario
        </h2>
      </Row>
      <Row className="ms-3 me-3 mt-3">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={8}>
              <TextField label="Nome completo" name="fullName" value={formData.fullName} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Perfil</InputLabel>
                <Select label="Perfil" name="profile" value={formData.profile} onChange={handleChange}>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">Usuário</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField label="Login" name="login" value={formData.login} onChange={handleChange} fullWidth />
              </FormControl>
            </Grid>
            <Grid item xs={1}>
              <FormControlLabel control={<Checkbox name="manager" checked={formData.manager} onChange={handleChange} />} label="Gestor" />
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel>Gestor</InputLabel>
                <Select name="Gestor" label="Gestor" value={formData.managerProfile} onChange={handleChange}>
                  <MenuItem value="1">Admin</MenuItem>
                  <MenuItem value="2">Usuário</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Setor</InputLabel>
                <Select name="setor" label="Setor" value={formData.sector} onChange={handleChange}>
                  <MenuItem value=""></MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Função</InputLabel>
                <Select name="role" label="Função" value={formData.role} onChange={handleChange}>
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
                <Select name="processes" label="Processos" value={formData.processes} onChange={handleChange}>
                  {processos
                    ? processos.map(otherEntity => (
                        <MenuItem value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.nome}
                        </MenuItem>
                      ))
                    : null}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} className="">
              <Button variant="contained" className="me-3" style={{ background: '#d9d9d9', color: '#4e4d4d' }}>
                Voltar
              </Button>
              <Button type="submit" variant="contained" color="primary" style={{ background: '#e6b200', color: '#4e4d4d' }}>
                Salvar
              </Button>
            </Grid>
          </Grid>
        </form>
        {/* <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="usuario-id" label="Código" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Nome"
                id="usuario-nome"
                name="nome"
                data-cy="nome"
                type="text"
                validate={{
                  required: { value: true, message: 'O campo é obrigatório.' },
                }}
              />
              <ValidatedField label="Email" id="usuario-email" name="email" data-cy="email" type="text" />
              <ValidatedField label="Is Gestor" id="usuario-isGestor" name="isGestor" data-cy="isGestor" check type="checkbox" />
              <ValidatedField
                label="Criado Em"
                id="usuario-criadoEm"
                name="criadoEm"
                data-cy="criadoEm"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label="Atualizado Em"
                id="usuario-atualizadoEm"
                name="atualizadoEm"
                data-cy="atualizadoEm"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField id="usuario-funcao" name="funcao" data-cy="funcao" label="Funcao" type="select">
                <option value="" key="0" />
                {funcaos
                  ? funcaos.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.nome}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="usuario-gestor" name="gestor" data-cy="gestor" label="Gestor" type="select">
                <option value="" key="0" />
                {usuarios
                  ? usuarios.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.nome}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="usuario-setor" name="setor" data-cy="setor" label="Setor" type="select">
                <option value="" key="0" />
                {setors
                  ? setors.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.nome}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="usuario-user" name="user" data-cy="user" label="User" type="select">
                <option value="" key="0" />
                {users
                  ? users.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.login}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="usuario-criadoPor" name="criadoPor" data-cy="criadoPor" label="Criado Por" type="select">
                <option value="" key="0" />
                {usuarios
                  ? usuarios.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.nome}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="usuario-atualizadoPor" name="atualizadoPor" data-cy="atualizadoPor" label="Atualizado Por" type="select">
                <option value="" key="0" />
                {usuarios
                  ? usuarios.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.nome}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField label="Processos" id="usuario-processos" data-cy="processos" type="select" multiple name="processos">
                <option value="" key="0" />
                {processos
                  ? processos.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.nome}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/usuario" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Voltar</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Salvar
              </Button>
            </ValidatedForm>
          )}
        </Col> */}
      </Row>
    </div>
  );
};

export default UsuarioUpdate;
