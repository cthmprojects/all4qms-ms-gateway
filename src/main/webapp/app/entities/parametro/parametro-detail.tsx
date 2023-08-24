import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './parametro.reducer';

export const ParametroDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const parametroEntity = useAppSelector(state => state.all4qmsmsgateway.parametro.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="parametroDetailsHeading">
          <Translate contentKey="all4QmsMsGatewayApp.parametro.detail.title">Parametro</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{parametroEntity.id}</dd>
          <dt>
            <span id="chave">
              <Translate contentKey="all4QmsMsGatewayApp.parametro.chave">Chave</Translate>
            </span>
          </dt>
          <dd>{parametroEntity.chave}</dd>
          <dt>
            <span id="valor">
              <Translate contentKey="all4QmsMsGatewayApp.parametro.valor">Valor</Translate>
            </span>
          </dt>
          <dd>{parametroEntity.valor}</dd>
          <dt>
            <span id="nomeAmigavel">
              <Translate contentKey="all4QmsMsGatewayApp.parametro.nomeAmigavel">Nome Amigavel</Translate>
            </span>
          </dt>
          <dd>{parametroEntity.nomeAmigavel}</dd>
          <dt>
            <span id="atualizadoEm">
              <Translate contentKey="all4QmsMsGatewayApp.parametro.atualizadoEm">Atualizado Em</Translate>
            </span>
          </dt>
          <dd>
            {parametroEntity.atualizadoEm ? <TextFormat value={parametroEntity.atualizadoEm} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
        </dl>
        <Button tag={Link} to="/parametro" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/parametro/${parametroEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ParametroDetail;
