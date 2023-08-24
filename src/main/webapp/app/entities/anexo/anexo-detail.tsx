import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './anexo.reducer';

export const AnexoDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const anexoEntity = useAppSelector(state => state.all4qmsmsgateway.anexo.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="anexoDetailsHeading">
          <Translate contentKey="all4QmsMsGatewayApp.anexo.detail.title">Anexo</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{anexoEntity.id}</dd>
          <dt>
            <span id="nomeArquivo">
              <Translate contentKey="all4QmsMsGatewayApp.anexo.nomeArquivo">Nome Arquivo</Translate>
            </span>
          </dt>
          <dd>{anexoEntity.nomeArquivo}</dd>
          <dt>
            <span id="nomeOriginal">
              <Translate contentKey="all4QmsMsGatewayApp.anexo.nomeOriginal">Nome Original</Translate>
            </span>
          </dt>
          <dd>{anexoEntity.nomeOriginal}</dd>
          <dt>
            <span id="extensao">
              <Translate contentKey="all4QmsMsGatewayApp.anexo.extensao">Extensao</Translate>
            </span>
          </dt>
          <dd>{anexoEntity.extensao}</dd>
          <dt>
            <span id="criadoEm">
              <Translate contentKey="all4QmsMsGatewayApp.anexo.criadoEm">Criado Em</Translate>
            </span>
          </dt>
          <dd>{anexoEntity.criadoEm ? <TextFormat value={anexoEntity.criadoEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="atualizadoEm">
              <Translate contentKey="all4QmsMsGatewayApp.anexo.atualizadoEm">Atualizado Em</Translate>
            </span>
          </dt>
          <dd>{anexoEntity.atualizadoEm ? <TextFormat value={anexoEntity.atualizadoEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
        </dl>
        <Button tag={Link} to="/anexo" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/anexo/${anexoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default AnexoDetail;
