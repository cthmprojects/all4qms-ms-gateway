import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './funcao.reducer';

export const FuncaoDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const funcaoEntity = useAppSelector(state => state.all4qmsmsgateway.funcao.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="funcaoDetailsHeading">
          <Translate contentKey="all4QmsMsGatewayApp.funcao.detail.title">Funcao</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{funcaoEntity.id}</dd>
          <dt>
            <span id="nome">
              <Translate contentKey="all4QmsMsGatewayApp.funcao.nome">Nome</Translate>
            </span>
          </dt>
          <dd>{funcaoEntity.nome}</dd>
          <dt>
            <span id="descricao">
              <Translate contentKey="all4QmsMsGatewayApp.funcao.descricao">Descricao</Translate>
            </span>
          </dt>
          <dd>{funcaoEntity.descricao}</dd>
          <dt>
            <span id="criadoEm">
              <Translate contentKey="all4QmsMsGatewayApp.funcao.criadoEm">Criado Em</Translate>
            </span>
          </dt>
          <dd>{funcaoEntity.criadoEm ? <TextFormat value={funcaoEntity.criadoEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="atualizadoEm">
              <Translate contentKey="all4QmsMsGatewayApp.funcao.atualizadoEm">Atualizado Em</Translate>
            </span>
          </dt>
          <dd>
            {funcaoEntity.atualizadoEm ? <TextFormat value={funcaoEntity.atualizadoEm} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.funcao.criadoPor">Criado Por</Translate>
          </dt>
          <dd>{funcaoEntity.criadoPor ? funcaoEntity.criadoPor.nome : ''}</dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.funcao.atualizadoPor">Atualizado Por</Translate>
          </dt>
          <dd>{funcaoEntity.atualizadoPor ? funcaoEntity.atualizadoPor.nome : ''}</dd>
        </dl>
        <Button tag={Link} to="/funcao" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/funcao/${funcaoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default FuncaoDetail;
