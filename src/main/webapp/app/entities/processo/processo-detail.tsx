import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './processo.reducer';

export const ProcessoDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const processoEntity = useAppSelector(state => state.all4qmsmsgateway.processo.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="processoDetailsHeading">
          <Translate contentKey="all4QmsMsGatewayApp.processo.detail.title">Processo</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{processoEntity.id}</dd>
          <dt>
            <span id="numero">
              <Translate contentKey="all4QmsMsGatewayApp.processo.numero">Numero</Translate>
            </span>
          </dt>
          <dd>{processoEntity.numero}</dd>
          <dt>
            <span id="nome">
              <Translate contentKey="all4QmsMsGatewayApp.processo.nome">Nome</Translate>
            </span>
          </dt>
          <dd>{processoEntity.nome}</dd>
          <dt>
            <span id="descricao">
              <Translate contentKey="all4QmsMsGatewayApp.processo.descricao">Descricao</Translate>
            </span>
          </dt>
          <dd>{processoEntity.descricao}</dd>
          <dt>
            <span id="setor">
              <Translate contentKey="all4QmsMsGatewayApp.processo.setor">Setor</Translate>
            </span>
          </dt>
          <dd>{processoEntity.setor}</dd>
          <dt>
            <span id="responsavel">
              <Translate contentKey="all4QmsMsGatewayApp.processo.responsavel">Responsavel</Translate>
            </span>
          </dt>
          <dd>{processoEntity.responsavel}</dd>
          <dt>
            <span id="setorResponsavel">
              <Translate contentKey="all4QmsMsGatewayApp.processo.setorResponsavel">Setor Responsavel</Translate>
            </span>
          </dt>
          <dd>{processoEntity.setorResponsavel}</dd>
          <dt>
            <span id="criadoEm">
              <Translate contentKey="all4QmsMsGatewayApp.processo.criadoEm">Criado Em</Translate>
            </span>
          </dt>
          <dd>{processoEntity.criadoEm ? <TextFormat value={processoEntity.criadoEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="atualizadoEm">
              <Translate contentKey="all4QmsMsGatewayApp.processo.atualizadoEm">Atualizado Em</Translate>
            </span>
          </dt>
          <dd>
            {processoEntity.atualizadoEm ? <TextFormat value={processoEntity.atualizadoEm} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.processo.criadoPor">Criado Por</Translate>
          </dt>
          <dd>{processoEntity.criadoPor ? processoEntity.criadoPor.nome : ''}</dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.processo.atualizadoPor">Atualizado Por</Translate>
          </dt>
          <dd>{processoEntity.atualizadoPor ? processoEntity.atualizadoPor.nome : ''}</dd>
        </dl>
        <Button tag={Link} to="/processo" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/processo/${processoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ProcessoDetail;
