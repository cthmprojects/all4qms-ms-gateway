import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
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
        <h2 data-cy="pendenciaDetailsHeading">Pendencia</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">Código</span>
          </dt>
          <dd>{pendenciaEntity.id}</dd>
          <dt>
            <span id="nome">Nome</span>
          </dt>
          <dd>{pendenciaEntity.nome}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{pendenciaEntity.status ? 'true' : 'false'}</dd>
          <dt>
            <span id="lidaEm">Lida Em</span>
          </dt>
          <dd>{pendenciaEntity.lidaEm ? <TextFormat value={pendenciaEntity.lidaEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="link">Link</span>
          </dt>
          <dd>{pendenciaEntity.link}</dd>
          <dt>
            <span id="tipo">Tipo</span>
          </dt>
          <dd>{pendenciaEntity.tipo}</dd>
          <dt>
            <span id="criadoEm">Criado Em</span>
          </dt>
          <dd>{pendenciaEntity.criadoEm ? <TextFormat value={pendenciaEntity.criadoEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>Responsavel</dt>
          <dd>{pendenciaEntity.responsavel ? pendenciaEntity.responsavel.nome : ''}</dd>
          <dt>Criado Por</dt>
          <dd>{pendenciaEntity.criadoPor ? pendenciaEntity.criadoPor.nome : ''}</dd>
          <dt>Atualizado Por</dt>
          <dd>{pendenciaEntity.atualizadoPor ? pendenciaEntity.atualizadoPor.nome : ''}</dd>
        </dl>
        <Button tag={Link} to="/pendencia" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Voltar</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/pendencia/${pendenciaEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editar</span>
        </Button>
      </Col>
    </Row>
  );
};

export default PendenciaDetail;
