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
import { IFuncao } from 'app/shared/model/funcao.model';
import { getEntity, updateEntity, createEntity, reset } from './funcao.reducer';

import { Box, Breadcrumbs, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material';

export const FuncaoUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const usuarios = useAppSelector(state => state.all4qmsmsgateway.usuario.entities);
  const funcaoEntity = useAppSelector(state => state.all4qmsmsgateway.funcao.entity);
  const loading = useAppSelector(state => state.all4qmsmsgateway.funcao.loading);
  const updating = useAppSelector(state => state.all4qmsmsgateway.funcao.updating);
  const updateSuccess = useAppSelector(state => state.all4qmsmsgateway.funcao.updateSuccess);

  const handleClose = () => {
    navigate('/funcao' + location.search);
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
      ...funcaoEntity,
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
          ...funcaoEntity,
          criadoEm: convertDateTimeFromServer(funcaoEntity.criadoEm),
          atualizadoEm: convertDateTimeFromServer(funcaoEntity.atualizadoEm),
          criadoPor: funcaoEntity?.criadoPor?.id,
          atualizadoPor: funcaoEntity?.atualizadoPor?.id,
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
              <Link style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }} to={'/funcao'}>
                Funções
              </Link>
              <Typography className="link">{isNew ? 'Criar Função' : 'Editar Função'}</Typography>
            </Breadcrumbs>
            <h1 className="title">{isNew ? 'Criar Função' : 'Editar Função'}</h1>

            <Paper sx={{ padding: '30px', marginTop: '20px' }}>
              <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                {!isNew ? (
                  <ValidatedField
                    name="id"
                    required
                    readOnly
                    id="funcao-id"
                    label={translate('global.field.id')}
                    validate={{ required: true }}
                  />
                ) : null}
                <ValidatedField
                  label={translate('all4QmsMsGatewayApp.funcao.nome')}
                  id="funcao-nome"
                  name="nome"
                  data-cy="nome"
                  type="text"
                  validate={{
                    required: { value: true, message: translate('entity.validation.required') },
                  }}
                />
                <ValidatedField
                  label={translate('all4QmsMsGatewayApp.funcao.descricao')}
                  id="funcao-descricao"
                  name="descricao"
                  data-cy="descricao"
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

export default FuncaoUpdate;
