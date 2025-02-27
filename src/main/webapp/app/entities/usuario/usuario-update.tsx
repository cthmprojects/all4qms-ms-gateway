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
import { createUser, getUsers, getUser } from 'app/modules/administration/user-management/user-management.reducer';
import { IProcesso } from 'app/shared/model/processo.model';
import { getEntities as getProcessos } from 'app/entities/processo/processo.reducer';
import { IUsuario } from 'app/shared/model/usuario.model';
import { getEntity, updateEntity, createEntity, reset, partialUpdateEntity } from './usuario.reducer';
import { getRoles } from 'app/modules/administration/user-management/user-management.reducer';
import { Storage } from 'react-jhipster';
import CircularProgress from '@mui/material/CircularProgress';

import {
  Breadcrumbs,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
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
  const authorities = useAppSelector(state => state.userManagement.authorities);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    profile: [],
    login: '',
    manager: false,
    managerProfile: '',
    sector: '',
    role: '',
    processes: [],
  });

  const [formError, setFormError] = useState({
    email: false,
    firstName: false,
    lastName: false,
    profile: false,
    login: false,
    manager: false,
    managerProfile: false,
    sector: false,
    role: false,
    processes: false,
  });

  const [processes, setProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jhUserId, setJhUserId] = useState();

  const handleChangeProcesses = event => {
    const {
      target: { value },
    } = event;

    // setProcesses(typeof value === 'string' ? value.split(',') : value);
    setFormData({ ...formData, processes: typeof value === 'string' ? value.split(',') : value });
  };

  const handleChangeProfiles = event => {
    const {
      target: { value },
    } = event;

    setFormData({ ...formData, profile: typeof value === 'string' ? value.split(',') : value });
  };

  const handleClose = () => {
    navigate('/usuario' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id)).then((r: any) => {
        dispatch(getUser(r.payload.data.user.login.toString())).then((k: any) => {
          console.log(r, k);
          setFormData({
            email: r.payload.data.email,
            manager: r.payload.data.isGestor,
            managerProfile: r.payload.data.gestor.id,
            sector: r.payload.data.setor.id,
            role: r.payload.data.funcao.id,
            processes: r.payload.data.processos.map(p => p.nome),
            login: r.payload.data.user.login,
            profile: k.payload.data.authorities,
            firstName: k.payload.data.firstName,
            lastName: k.payload.data.lastName,
          });
          setJhUserId(r.payload.data.user.id);
        });
      });
    }

    dispatch(getFuncaos({}));
    dispatch(getUsuarios({}));
    dispatch(getSetors({}));
    dispatch(getUsers({}));
    dispatch(getProcessos({}));
    dispatch(getRoles());
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const validFields = () => {
    if (formData.firstName === '') {
      setFormError(prevError => ({ ...prevError, firstName: true }));
      return false;
    }
    if (formData.lastName === '') {
      setFormError(prevError => ({ ...prevError, lastName: true }));
      return false;
    }
    if (formData.email === '') {
      setFormError(prevError => ({ ...prevError, email: true }));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError(prevError => ({ ...prevError, email: true }));
      return false;
    }
    if (formData.login === '') {
      setFormError(prevError => ({ ...prevError, login: true }));
      return false;
    }
    if (formData.profile.length == 0) {
      setFormError(prevError => ({ ...prevError, profile: true }));
      return false;
    }

    setFormError({
      email: false,
      firstName: false,
      lastName: false,
      profile: false,
      login: false,
      manager: false,
      managerProfile: false,
      sector: false,
      role: false,
      processes: false,
    });

    return true;
  };

  const saveUser = () => {
    if (!validFields()) {
      return;
    }

    if (isNew) {
      const jhipsterUser: IUser = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        activated: true,
        authorities: formData.profile,
        langKey: '',
        createdBy: Storage.session.get('firstName'),
        login: formData.login,
      };
      setIsLoading(true);
      dispatch(createUser(jhipsterUser)).then((r: any) => {
        setIsLoading(false);
        const jhipsterUserId = r.payload.data.id;
        const funcao = formData.role ? funcaos.find(it => it.id.toString() === formData.role.toString()) : null;
        const gestor = formData.managerProfile ? usuarios.find(it => it.id.toString() === formData.managerProfile.toString()) : null;
        const setor = formData.sector ? setors.find(it => it.id.toString() === formData.sector.toString()) : null;
        let process = [];

        formData.processes.map(p => {
          process.push(processos.find(it => it.nome.toString() === p.toString()));
        });

        const entity = {
          nome: formData.firstName + ' ' + formData.lastName,
          email: formData.email,
          isGestor: formData.manager,
          processos: process,
          funcao: funcao,
          gestor: gestor,
          setor: setor,
          user: {
            login: formData.login,
            id: jhipsterUserId,
          },
        };

        dispatch(createEntity(entity));
      });
    } else {
      const funcao = formData.role ? funcaos.find(it => it.id.toString() === formData.role.toString()) : null;
      const gestor = formData.managerProfile ? usuarios.find(it => it.id.toString() === formData.managerProfile.toString()) : null;
      const setor = formData.sector ? setors.find(it => it.id.toString() === formData.sector.toString()) : null;
      let process = [];

      formData.processes.map(p => {
        process.push(processos.find(it => it.nome.toString() === p.toString()));
      });

      const entity = {
        id: Number(id),
        nome: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        isGestor: formData.manager,
        processos: process,
        funcao: funcao,
        gestor: gestor,
        setor: setor,
        user: {
          login: formData.login,
          id: jhUserId,
        },
      };

      dispatch(
        partialUpdateEntity({
          login: formData.login,
          perfis: formData.profile,
          usuario: entity,
        })
      );
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
  console.log(formData);
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
          <Typography style={{ color: '#606060' }}>{isNew ? 'Criar Usuário' : 'Editar Usuário'}</Typography>
        </Breadcrumbs>
        <h2 id="all4QmsMsGatewayApp.usuario.home.createOrEditLabel" data-cy="UsuarioCreateUpdateHeading" className="ms-5 mt-5">
          {isNew ? 'Criar Usuário' : 'Editar Usuário'}
        </h2>
      </Row>
      {isLoading ? <CircularProgress></CircularProgress> : null}
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="ms-3 me-3 mt-3">
        <TextField
          fullWidth
          label="Nome"
          name="nome"
          error={formError.firstName}
          value={formData.firstName}
          onChange={e => setFormData({ ...formData, firstName: e.target.value })}
        />
        <TextField
          fullWidth
          label="Sobrenome"
          className="ms-3"
          name="nome"
          error={formError.lastName}
          value={formData.lastName}
          onChange={e => setFormData({ ...formData, lastName: e.target.value })}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          className="ms-3"
          type="email"
          error={formError.email}
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
        />
        <TextField
          fullWidth
          label="Login"
          name="login"
          className="ms-3"
          error={formError.login}
          value={formData.login}
          onChange={e => setFormData({ ...formData, login: e.target.value })}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="ms-3 me-3 mt-3">
        <FormControl fullWidth>
          <InputLabel>Perfil</InputLabel>
          <Select
            multiple
            label="Perfil"
            name="perfil"
            error={formError.profile}
            value={formData.profile}
            onChange={handleChangeProfiles}
            input={<OutlinedInput label="Perfis" />}
            renderValue={selected => selected.join(', ')}
          >
            {authorities
              ? authorities.map(role => (
                  <MenuItem value={role} key={role}>
                    <Checkbox checked={formData.profile.indexOf(role) > -1} />
                    <ListItemText primary={role}></ListItemText>
                  </MenuItem>
                ))
              : null}
          </Select>
        </FormControl>
        <FormControlLabel
          className="ms-3"
          control={<Checkbox checked={formData.manager} onClick={() => setFormData({ ...formData, manager: !formData.manager })} />}
          label="Gestor"
        />
        <FormControl fullWidth className="ms-3">
          <InputLabel>Gestor</InputLabel>
          <Select
            label="Gestor"
            name="gestor"
            error={formError.managerProfile}
            value={formData.managerProfile}
            onChange={e => setFormData({ ...formData, managerProfile: e.target.value })}
          >
            <MenuItem> - </MenuItem>
            {usuarios
              ? usuarios
                  .filter(usuario => usuario.isGestor)
                  .map(gestor => (
                    <MenuItem value={gestor.id} key={gestor.id}>
                      {gestor.nome}
                    </MenuItem>
                  ))
              : null}
          </Select>
        </FormControl>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="ms-3 me-3 mt-3">
        <FormControl fullWidth>
          <InputLabel>Setor</InputLabel>
          <Select
            label="Setor"
            name="setor"
            value={formData.sector}
            error={formError.sector}
            onChange={e => setFormData({ ...formData, sector: e.target.value })}
          >
            <MenuItem>-</MenuItem>
            {setors
              ? setors.map(setor => (
                  <MenuItem value={setor.id} key={setor.id}>
                    {setor.nome}
                  </MenuItem>
                ))
              : null}
          </Select>
        </FormControl>
        <FormControl fullWidth className="ms-3">
          <InputLabel>Função</InputLabel>
          <Select
            label="Função"
            name="funcao"
            value={formData.role}
            error={formError.role}
            onChange={e => setFormData({ ...formData, role: e.target.value })}
          >
            <MenuItem>-</MenuItem>
            {funcaos
              ? funcaos.map(funcao => (
                  <MenuItem value={funcao.id} key={funcao.id}>
                    {funcao.nome}
                  </MenuItem>
                ))
              : null}
          </Select>
        </FormControl>
        <FormControl fullWidth className="ms-3">
          <InputLabel>Processos</InputLabel>
          <Select
            multiple
            label="Processos"
            name="processos"
            error={formError.processes}
            value={formData.processes}
            onChange={handleChangeProcesses}
            input={<OutlinedInput label="Processos" />}
            renderValue={selected => selected.join(', ')}
          >
            {processos
              ? processos.map(otherEntity => (
                  <MenuItem value={otherEntity.nome} key={otherEntity.id}>
                    <Checkbox checked={formData.processes.indexOf(otherEntity.nome) > -1} />
                    <ListItemText primary={otherEntity.nome}></ListItemText>
                  </MenuItem>
                ))
              : null}
          </Select>
        </FormControl>
      </div>
      <div style={{ display: 'flex', justifyContent: 'end' }} className="ms-3 me-3 mt-3">
        <Button
          variant="contained"
          className="me-3"
          style={{ background: '#d9d9d9', color: '#4e4d4d' }}
          onClick={() => navigate('/usuario')}
        >
          Voltar
        </Button>
        <Button variant="contained" onClick={saveUser} color="primary" style={{ background: '#e6b200', color: '#4e4d4d' }}>
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default UsuarioUpdate;
