import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IParametros } from 'app/shared/model/parametros.model';
import { getEntity, updateEntity, createEntity, reset } from './parametros.reducer';

export const ParametrosUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const parametrosEntity = useAppSelector(state => state.all4qmsmsgateway.parametros.entity);
  const loading = useAppSelector(state => state.all4qmsmsgateway.parametros.loading);
  const updating = useAppSelector(state => state.all4qmsmsgateway.parametros.updating);
  const updateSuccess = useAppSelector(state => state.all4qmsmsgateway.parametros.updateSuccess);

  const handleClose = () => {
    navigate('/parametros');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    values.atualizadoEm = convertDateTimeToServer(values.atualizadoEm);

    const entity = {
      ...parametrosEntity,
      ...values,
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
          atualizadoEm: displayDefaultDateTime(),
        }
      : {
          ...parametrosEntity,
          atualizadoEm: convertDateTimeFromServer(parametrosEntity.atualizadoEm),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="all4QmsMsGatewayApp.parametros.home.createOrEditLabel" data-cy="ParametrosCreateUpdateHeading">
            <Translate contentKey="all4QmsMsGatewayApp.parametros.home.createOrEditLabel">Create or edit a Parametros</Translate>
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
                  id="parametros-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField label="Chave" id="parametros-chave" name="chave" data-cy="chave" type="text" />
              <ValidatedField label="Valor Chave" id="parametros-valorChave" name="valorChave" data-cy="valorChave" type="text" />
              <ValidatedField label="Nome Amigavel" id="parametros-nomeAmigavel" name="nomeAmigavel" data-cy="nomeAmigavel" type="text" />
              <ValidatedField label="Descricao" id="parametros-descricao" name="descricao" data-cy="descricao" type="text" />
              <ValidatedField
                label="Atualizado Em"
                id="parametros-atualizadoEm"
                name="atualizadoEm"
                data-cy="atualizadoEm"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField label="Locked" id="parametros-locked" name="locked" data-cy="locked" check type="checkbox" />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/parametros" replace color="info">
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

export default ParametrosUpdate;
