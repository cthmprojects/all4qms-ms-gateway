import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IAnexo } from 'app/shared/model/anexo.model';
import { getEntity, updateEntity, createEntity, reset } from './anexo.reducer';

export const AnexoUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const anexoEntity = useAppSelector(state => state.all4qmsmsgateway.anexo.entity);
  const loading = useAppSelector(state => state.all4qmsmsgateway.anexo.loading);
  const updating = useAppSelector(state => state.all4qmsmsgateway.anexo.updating);
  const updateSuccess = useAppSelector(state => state.all4qmsmsgateway.anexo.updateSuccess);

  const handleClose = () => {
    navigate('/anexo' + location.search);
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
    values.criadoEm = convertDateTimeToServer(values.criadoEm);
    values.atualizadoEm = convertDateTimeToServer(values.atualizadoEm);

    const entity = {
      ...anexoEntity,
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
          criadoEm: displayDefaultDateTime(),
          atualizadoEm: displayDefaultDateTime(),
        }
      : {
          ...anexoEntity,
          criadoEm: convertDateTimeFromServer(anexoEntity.criadoEm),
          atualizadoEm: convertDateTimeFromServer(anexoEntity.atualizadoEm),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="all4QmsMsGatewayApp.anexo.home.createOrEditLabel" data-cy="AnexoCreateUpdateHeading">
            <Translate contentKey="all4QmsMsGatewayApp.anexo.home.createOrEditLabel">Create or edit a Anexo</Translate>
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
                  id="anexo-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField label="Nome Arquivo" id="anexo-nomeArquivo" name="nomeArquivo" data-cy="nomeArquivo" type="text" />
              <ValidatedField label="Nome Original" id="anexo-nomeOriginal" name="nomeOriginal" data-cy="nomeOriginal" type="text" />
              <ValidatedField label="Extensao" id="anexo-extensao" name="extensao" data-cy="extensao" type="text" />
              <ValidatedField
                label="Criado Em"
                id="anexo-criadoEm"
                name="criadoEm"
                data-cy="criadoEm"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label="Atualizado Em"
                id="anexo-atualizadoEm"
                name="atualizadoEm"
                data-cy="atualizadoEm"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/anexo" replace color="info">
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

export default AnexoUpdate;
