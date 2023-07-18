import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
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
        <h2 data-cy="setorDetailsHeading">Setor</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">Código</span>
          </dt>
          <dd>{setorEntity.id}</dd>
          <dt>
            <span id="nome">Nome</span>
          </dt>
          <dd>{setorEntity.nome}</dd>
          <dt>
            <span id="descricao">Descricao</span>
          </dt>
          <dd>{setorEntity.descricao}</dd>
          <dt>
            <span id="criadoEm">Criado Em</span>
          </dt>
          <dd>{setorEntity.criadoEm ? <TextFormat value={setorEntity.criadoEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="atualizadoEm">Atualizado Em</span>
          </dt>
          <dd>{setorEntity.atualizadoEm ? <TextFormat value={setorEntity.atualizadoEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>Criado Por</dt>
          <dd>{setorEntity.criadoPor ? setorEntity.criadoPor.nome : ''}</dd>
          <dt>Atualizado Por</dt>
          <dd>{setorEntity.atualizadoPor ? setorEntity.atualizadoPor.nome : ''}</dd>
        </dl>
        <Button tag={Link} to="/setor" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Voltar</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/setor/${setorEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editar</span>
        </Button>
      </Col>
    </Row>
  );
};

export default SetorDetail;
