import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './pendencia.reducer';

export const PendenciaDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const pendenciaEntity = useAppSelector(state => state.all4qmsmsgateway.pendencia.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="pendenciaDetailsHeading">
          <Translate contentKey="all4QmsMsGatewayApp.pendencia.detail.title">Pendencia</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{pendenciaEntity.id}</dd>
          <dt>
            <span id="nome">
              <Translate contentKey="all4QmsMsGatewayApp.pendencia.nome">Nome</Translate>
            </span>
          </dt>
          <dd>{pendenciaEntity.nome}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="all4QmsMsGatewayApp.pendencia.status">Status</Translate>
            </span>
          </dt>
          <dd>{pendenciaEntity.status ? 'true' : 'false'}</dd>
          <dt>
            <span id="lidaEm">
              <Translate contentKey="all4QmsMsGatewayApp.pendencia.lidaEm">Lida Em</Translate>
            </span>
          </dt>
          <dd>{pendenciaEntity.lidaEm ? <TextFormat value={pendenciaEntity.lidaEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="link">
              <Translate contentKey="all4QmsMsGatewayApp.pendencia.link">Link</Translate>
            </span>
          </dt>
          <dd>{pendenciaEntity.link}</dd>
          <dt>
            <span id="tipo">
              <Translate contentKey="all4QmsMsGatewayApp.pendencia.tipo">Tipo</Translate>
            </span>
          </dt>
          <dd>{pendenciaEntity.tipo}</dd>
          <dt>
            <span id="criadoEm">
              <Translate contentKey="all4QmsMsGatewayApp.pendencia.criadoEm">Criado Em</Translate>
            </span>
          </dt>
          <dd>{pendenciaEntity.criadoEm ? <TextFormat value={pendenciaEntity.criadoEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.pendencia.responsavel">Responsavel</Translate>
          </dt>
          <dd>{pendenciaEntity.responsavel ? pendenciaEntity.responsavel.nome : ''}</dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.pendencia.criadoPor">Criado Por</Translate>
          </dt>
          <dd>{pendenciaEntity.criadoPor ? pendenciaEntity.criadoPor.nome : ''}</dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.pendencia.atualizadoPor">Atualizado Por</Translate>
          </dt>
          <dd>{pendenciaEntity.atualizadoPor ? pendenciaEntity.atualizadoPor.nome : ''}</dd>
        </dl>
        <Button tag={Link} to="/pendencia" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/pendencia/${pendenciaEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default PendenciaDetail;
