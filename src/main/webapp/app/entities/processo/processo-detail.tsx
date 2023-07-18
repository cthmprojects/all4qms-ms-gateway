import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
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
        <h2 data-cy="processoDetailsHeading">Processo</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">Código</span>
          </dt>
          <dd>{processoEntity.id}</dd>
          <dt>
            <span id="numero">Numero</span>
          </dt>
          <dd>{processoEntity.numero}</dd>
          <dt>
            <span id="nome">Nome</span>
          </dt>
          <dd>{processoEntity.nome}</dd>
          <dt>
            <span id="descricao">Descricao</span>
          </dt>
          <dd>{processoEntity.descricao}</dd>
          <dt>
            <span id="setor">Setor</span>
          </dt>
          <dd>{processoEntity.setor}</dd>
          <dt>
            <span id="responsavel">Responsavel</span>
          </dt>
          <dd>{processoEntity.responsavel}</dd>
          <dt>
            <span id="setorResponsavel">Setor Responsavel</span>
          </dt>
          <dd>{processoEntity.setorResponsavel}</dd>
          <dt>
            <span id="criadoEm">Criado Em</span>
          </dt>
          <dd>{processoEntity.criadoEm ? <TextFormat value={processoEntity.criadoEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="atualizadoEm">Atualizado Em</span>
          </dt>
          <dd>
            {processoEntity.atualizadoEm ? <TextFormat value={processoEntity.atualizadoEm} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>Criado Por</dt>
          <dd>{processoEntity.criadoPor ? processoEntity.criadoPor.nome : ''}</dd>
          <dt>Atualizado Por</dt>
          <dd>{processoEntity.atualizadoPor ? processoEntity.atualizadoPor.nome : ''}</dd>
        </dl>
        <Button tag={Link} to="/processo" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Voltar</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/processo/${processoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editar</span>
        </Button>
      </Col>
    </Row>
  );
};

export default ProcessoDetail;
