import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IUsuario } from 'app/shared/model/usuario.model';
import { getEntities as getUsuarios } from 'app/entities/usuario/usuario.reducer';
import { IProcesso } from 'app/shared/model/processo.model';
import { getEntity, updateEntity, createEntity, reset } from './processo.reducer';

export const ProcessoUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const usuarios = useAppSelector(state => state.all4qmsmsgateway.usuario.entities);
  const processoEntity = useAppSelector(state => state.all4qmsmsgateway.processo.entity);
  const loading = useAppSelector(state => state.all4qmsmsgateway.processo.loading);
  const updating = useAppSelector(state => state.all4qmsmsgateway.processo.updating);
  const updateSuccess = useAppSelector(state => state.all4qmsmsgateway.processo.updateSuccess);

  const handleClose = () => {
    navigate('/processo' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUsuarios({}));
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
      ...processoEntity,
      ...values,
      criadoPor: usuarios.find(it => it.id.toString() === values.criadoPor.toString()),
      atualizadoPor: usuarios.find(it => it.id.toString() === values.atualizadoPor.toString()),
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
          ...processoEntity,
          criadoEm: convertDateTimeFromServer(processoEntity.criadoEm),
          atualizadoEm: convertDateTimeFromServer(processoEntity.atualizadoEm),
          criadoPor: processoEntity?.criadoPor?.id,
          atualizadoPor: processoEntity?.atualizadoPor?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="all4QmsMsGatewayApp.processo.home.createOrEditLabel" data-cy="ProcessoCreateUpdateHeading">
            Criar ou editar Processo
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="processo-id" label="Código" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Numero"
                id="processo-numero"
                name="numero"
                data-cy="numero"
                type="text"
                validate={{
                  required: { value: true, message: 'O campo é obrigatório.' },
                }}
              />
              <ValidatedField label="Nome" id="processo-nome" name="nome" data-cy="nome" type="text" />
              <ValidatedField label="Descricao" id="processo-descricao" name="descricao" data-cy="descricao" type="text" />
              <ValidatedField label="Setor" id="processo-setor" name="setor" data-cy="setor" type="text" />
              <ValidatedField label="Responsavel" id="processo-responsavel" name="responsavel" data-cy="responsavel" type="text" />
              <ValidatedField
                label="Setor Responsavel"
                id="processo-setorResponsavel"
                name="setorResponsavel"
                data-cy="setorResponsavel"
                type="text"
              />
              <ValidatedField
                label="Criado Em"
                id="processo-criadoEm"
                name="criadoEm"
                data-cy="criadoEm"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label="Atualizado Em"
                id="processo-atualizadoEm"
                name="atualizadoEm"
                data-cy="atualizadoEm"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField id="processo-criadoPor" name="criadoPor" data-cy="criadoPor" label="Criado Por" type="select">
                <option value="" key="0" />
                {usuarios
                  ? usuarios.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.nome}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="processo-atualizadoPor" name="atualizadoPor" data-cy="atualizadoPor" label="Atualizado Por" type="select">
                <option value="" key="0" />
                {usuarios
                  ? usuarios.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.nome}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/processo" replace color="info">
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
        </Col>
      </Row>
    </div>
  );
};

export default ProcessoUpdate;
