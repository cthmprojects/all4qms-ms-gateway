import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './parametros.reducer';

export const ParametrosDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const parametrosEntity = useAppSelector(state => state.all4qmsmsgateway.parametros.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="parametrosDetailsHeading">
          <Translate contentKey="all4QmsMsGatewayApp.parametros.detail.title">Parametros</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{parametrosEntity.id}</dd>
          <dt>
            <span id="chave">
              <Translate contentKey="all4QmsMsGatewayApp.parametros.chave">Chave</Translate>
            </span>
          </dt>
          <dd>{parametrosEntity.chave}</dd>
          <dt>
            <span id="valorChave">
              <Translate contentKey="all4QmsMsGatewayApp.parametros.valorChave">Valor Chave</Translate>
            </span>
          </dt>
          <dd>{parametrosEntity.valorChave}</dd>
          <dt>
            <span id="nomeAmigavel">
              <Translate contentKey="all4QmsMsGatewayApp.parametros.nomeAmigavel">Nome Amigavel</Translate>
            </span>
          </dt>
          <dd>{parametrosEntity.nomeAmigavel}</dd>
          <dt>
            <span id="descricao">
              <Translate contentKey="all4QmsMsGatewayApp.parametros.descricao">Descricao</Translate>
            </span>
          </dt>
          <dd>{parametrosEntity.descricao}</dd>
          <dt>
            <span id="atualizadoEm">
              <Translate contentKey="all4QmsMsGatewayApp.parametros.atualizadoEm">Atualizado Em</Translate>
            </span>
          </dt>
          <dd>
            {parametrosEntity.atualizadoEm ? (
              <TextFormat value={parametrosEntity.atualizadoEm} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="locked">
              <Translate contentKey="all4QmsMsGatewayApp.parametros.locked">Locked</Translate>
            </span>
          </dt>
          <dd>{parametrosEntity.locked ? 'true' : 'false'}</dd>
        </dl>
        <Button tag={Link} to="/parametros" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/parametros/${parametrosEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ParametrosDetail;
