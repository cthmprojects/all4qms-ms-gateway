import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IUsuario } from 'app/shared/model/usuario.model';
import { getEntities as getUsuarios } from 'app/entities/usuario/usuario.reducer';
import { IProcesso } from 'app/shared/model/processo.model';
import { getEntity, updateEntity, createEntity, reset } from './processo.reducer';

import { Box, Breadcrumbs, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material';

export const ProcessoUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();

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
    <>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            width: '100vw',
            height: '100vh',
            background: '#c6c6c6',
            zIndex: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={80} />
        </Box>
      ) : (
        <div className="padding-container">
          <div className="container-style">
            <Breadcrumbs aria-label="breadcrumb">
              <Link style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }} to={'/'}>
                Home
              </Link>
              <Link style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }} to={'/processo'}>
                Processos
              </Link>
              <Typography className="link">{isNew ? 'Criar Processo' : 'Editar Processo'}</Typography>
            </Breadcrumbs>
            <h1 className="title">{isNew ? 'Criar Processo' : 'Editar Processo'}</h1>

            <Paper sx={{ padding: '30px', marginTop: '20px' }}>
              <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                {!isNew ? (
                  <ValidatedField
                    name="id"
                    required
                    readOnly
                    id="processo-id"
                    label={translate('global.field.id')}
                    validate={{ required: true }}
                  />
                ) : null}
                <ValidatedField
                  label={translate('all4QmsMsGatewayApp.processo.numero')}
                  id="processo-numero"
                  name="numero"
                  data-cy="numero"
                  type="text"
                />
                <ValidatedField
                  label={translate('all4QmsMsGatewayApp.processo.nome')}
                  id="processo-nome"
                  name="nome"
                  data-cy="nome"
                  type="text"
                  validate={{
                    required: { value: true, message: translate('entity.validation.required') },
                  }}
                />
                <ValidatedField
                  label={translate('all4QmsMsGatewayApp.processo.descricao')}
                  id="processo-descricao"
                  name="descricao"
                  data-cy="descricao"
                  type="text"
                />
                <ValidatedField
                  label={translate('all4QmsMsGatewayApp.processo.setor')}
                  id="processo-setor"
                  name="setor"
                  data-cy="setor"
                  type="text"
                />
                <ValidatedField
                  label={translate('all4QmsMsGatewayApp.processo.responsavel')}
                  id="processo-responsavel"
                  name="responsavel"
                  data-cy="responsavel"
                  type="text"
                />
                <div style={{ paddingTop: '30px' }}>
                  <Button type="submit" variant="contained" className="primary-button" style={{ marginRight: '10px' }} disabled={updating}>
                    <FontAwesomeIcon icon="save" />
                    &nbsp;
                    {translate('entity.action.save')}
                  </Button>
                  <Button variant="contained" className="secondary-button" onClick={handleClose} disabled={updating}>
                    <FontAwesomeIcon icon="arrow-left" />
                    &nbsp;
                    <span>{translate('entity.action.back')}</span>
                  </Button>
                </div>
              </ValidatedForm>
            </Paper>
          </div>
        </div>
      )}
    </>
  );
};

export default ProcessoUpdate;
