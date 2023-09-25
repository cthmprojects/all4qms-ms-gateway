import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './setor.reducer';

export const SetorDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const setorEntity = useAppSelector(state => state.all4qmsmsgateway.setor.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="setorDetailsHeading">
          <Translate contentKey="all4QmsMsGatewayApp.setor.detail.title">Setor</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{setorEntity.id}</dd>
          <dt>
            <span id="nome">
              <Translate contentKey="all4QmsMsGatewayApp.setor.nome">Nome</Translate>
            </span>
          </dt>
          <dd>{setorEntity.nome}</dd>
          <dt>
            <span id="descricao">
              <Translate contentKey="all4QmsMsGatewayApp.setor.descricao">Descricao</Translate>
            </span>
          </dt>
          <dd>{setorEntity.descricao}</dd>
          <dt>
            <span id="criadoEm">
              <Translate contentKey="all4QmsMsGatewayApp.setor.criadoEm">Criado Em</Translate>
            </span>
          </dt>
          <dd>{setorEntity.criadoEm ? <TextFormat value={setorEntity.criadoEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="atualizadoEm">
              <Translate contentKey="all4QmsMsGatewayApp.setor.atualizadoEm">Atualizado Em</Translate>
            </span>
          </dt>
          <dd>{setorEntity.atualizadoEm ? <TextFormat value={setorEntity.atualizadoEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.setor.criadoPor">Criado Por</Translate>
          </dt>
          <dd>{setorEntity.criadoPor ? setorEntity.criadoPor.nome : ''}</dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.setor.atualizadoPor">Atualizado Por</Translate>
          </dt>
          <dd>{setorEntity.atualizadoPor ? setorEntity.atualizadoPor.nome : ''}</dd>
        </dl>
        <Button tag={Link} to="/setor" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/setor/${setorEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SetorDetail;
