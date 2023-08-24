import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
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
import { IPendencia } from 'app/shared/model/pendencia.model';
import { getEntities as getPendencias } from 'app/entities/pendencia/pendencia.reducer';
import { IUsuario } from 'app/shared/model/usuario.model';
import { getEntity, updateEntity, createEntity, reset } from './usuario.reducer';

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
  const pendencias = useAppSelector(state => state.all4qmsmsgateway.pendencia.entities);
  const usuarioEntity = useAppSelector(state => state.all4qmsmsgateway.usuario.entity);
  const loading = useAppSelector(state => state.all4qmsmsgateway.usuario.loading);
  const updating = useAppSelector(state => state.all4qmsmsgateway.usuario.updating);
  const updateSuccess = useAppSelector(state => state.all4qmsmsgateway.usuario.updateSuccess);

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
    dispatch(getPendencias({}));
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

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="all4QmsMsGatewayApp.usuario.home.createOrEditLabel" data-cy="UsuarioCreateUpdateHeading">
            <Translate contentKey="all4QmsMsGatewayApp.usuario.home.createOrEditLabel">Create or edit a Usuario</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="usuario-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label="Nome"
                id="usuario-nome"
                name="nome"
                data-cy="nome"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
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
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default UsuarioUpdate;
