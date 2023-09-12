import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IUsuario } from 'app/shared/model/usuario.model';
import { getEntities as getUsuarios } from 'app/entities/usuario/usuario.reducer';
import { IPendencia } from 'app/shared/model/pendencia.model';
import { EnumTipoPend } from 'app/shared/model/enumerations/enum-tipo-pend.model';
import { getEntity, updateEntity, createEntity, reset } from './pendencia.reducer';

export const PendenciaUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const usuarios = useAppSelector(state => state.all4qmsmsgateway.usuario.entities);
  const pendenciaEntity = useAppSelector(state => state.all4qmsmsgateway.pendencia.entity);
  const loading = useAppSelector(state => state.all4qmsmsgateway.pendencia.loading);
  const updating = useAppSelector(state => state.all4qmsmsgateway.pendencia.updating);
  const updateSuccess = useAppSelector(state => state.all4qmsmsgateway.pendencia.updateSuccess);
  const enumTipoPendValues = Object.keys(EnumTipoPend);

  const handleClose = () => {
    navigate('/pendencia' + location.search);
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
    values.lidaEm = convertDateTimeToServer(values.lidaEm);
    values.criadoEm = convertDateTimeToServer(values.criadoEm);

    const entity = {
      ...pendenciaEntity,
      ...values,
      responsavel: usuarios.find(it => it.id.toString() === values.responsavel.toString()),
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
          lidaEm: displayDefaultDateTime(),
          criadoEm: displayDefaultDateTime(),
        }
      : {
          tipo: 'Atividade',
          ...pendenciaEntity,
          lidaEm: convertDateTimeFromServer(pendenciaEntity.lidaEm),
          criadoEm: convertDateTimeFromServer(pendenciaEntity.criadoEm),
          responsavel: pendenciaEntity?.responsavel?.id,
          criadoPor: pendenciaEntity?.criadoPor?.id,
          atualizadoPor: pendenciaEntity?.atualizadoPor?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="all4QmsMsGatewayApp.pendencia.home.createOrEditLabel" data-cy="PendenciaCreateUpdateHeading">
            <Translate contentKey="all4QmsMsGatewayApp.pendencia.home.createOrEditLabel">Create or edit a Pendencia</Translate>
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
                  id="pendencia-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField label="Nome" id="pendencia-nome" name="nome" data-cy="nome" type="text" />
              <ValidatedField label="Status" id="pendencia-status" name="status" data-cy="status" check type="checkbox" />
              <ValidatedField
                label="Lida Em"
                id="pendencia-lidaEm"
                name="lidaEm"
                data-cy="lidaEm"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField label="Link" id="pendencia-link" name="link" data-cy="link" type="text" />
              <ValidatedField label="Tipo" id="pendencia-tipo" name="tipo" data-cy="tipo" type="select">
                {enumTipoPendValues.map(enumTipoPend => (
                  <option value={enumTipoPend} key={enumTipoPend}>
                    {enumTipoPend}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label="Criado Em"
                id="pendencia-criadoEm"
                name="criadoEm"
                data-cy="criadoEm"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField id="pendencia-responsavel" name="responsavel" data-cy="responsavel" label="Responsavel" type="select">
                <option value="" key="0" />
                {usuarios
                  ? usuarios.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.nome}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="pendencia-criadoPor" name="criadoPor" data-cy="criadoPor" label="Criado Por" type="select">
                <option value="" key="0" />
                {usuarios
                  ? usuarios.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.nome}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="pendencia-atualizadoPor"
                name="atualizadoPor"
                data-cy="atualizadoPor"
                label="Atualizado Por"
                type="select"
              >
                <option value="" key="0" />
                {usuarios
                  ? usuarios.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.nome}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/pendencia" replace color="info">
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

export default PendenciaUpdate;
