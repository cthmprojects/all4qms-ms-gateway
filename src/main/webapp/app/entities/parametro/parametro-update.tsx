import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IParametro } from 'app/shared/model/parametro.model';
import { getEntity, updateEntity, createEntity, reset } from './parametro.reducer';

export const ParametroUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const parametroEntity = useAppSelector(state => state.all4qmsmsgateway.parametro.entity);
  const loading = useAppSelector(state => state.all4qmsmsgateway.parametro.loading);
  const updating = useAppSelector(state => state.all4qmsmsgateway.parametro.updating);
  const updateSuccess = useAppSelector(state => state.all4qmsmsgateway.parametro.updateSuccess);

  const handleClose = () => {
    navigate('/parametro');
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
      ...parametroEntity,
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
          ...parametroEntity,
          atualizadoEm: convertDateTimeFromServer(parametroEntity.atualizadoEm),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="all4QmsMsGatewayApp.parametro.home.createOrEditLabel" data-cy="ParametroCreateUpdateHeading">
            <Translate contentKey="all4QmsMsGatewayApp.parametro.home.createOrEditLabel">Create or edit a Parametro</Translate>
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
                  id="parametro-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label="Chave"
                id="parametro-chave"
                name="chave"
                data-cy="chave"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField label="Valor" id="parametro-valor" name="valor" data-cy="valor" type="text" />
              <ValidatedField label="Nome Amigavel" id="parametro-nomeAmigavel" name="nomeAmigavel" data-cy="nomeAmigavel" type="text" />
              <ValidatedField
                label="Atualizado Em"
                id="parametro-atualizadoEm"
                name="atualizadoEm"
                data-cy="atualizadoEm"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/parametro" replace color="info">
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

export default ParametroUpdate;
