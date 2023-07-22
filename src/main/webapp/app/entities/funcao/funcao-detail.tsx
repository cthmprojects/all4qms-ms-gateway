import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
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
        <h2 data-cy="funcaoDetailsHeading">Funcao</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">Código</span>
          </dt>
          <dd>{funcaoEntity.id}</dd>
          <dt>
            <span id="nome">Nome</span>
          </dt>
          <dd>{funcaoEntity.nome}</dd>
          <dt>
            <span id="descricao">Descricao</span>
          </dt>
          <dd>{funcaoEntity.descricao}</dd>
          <dt>
            <span id="criadoEm">Criado Em</span>
          </dt>
          <dd>{funcaoEntity.criadoEm ? <TextFormat value={funcaoEntity.criadoEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="atualizadoEm">Atualizado Em</span>
          </dt>
          <dd>
            {funcaoEntity.atualizadoEm ? <TextFormat value={funcaoEntity.atualizadoEm} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>Criado Por</dt>
          <dd>{funcaoEntity.criadoPor ? funcaoEntity.criadoPor.nome : ''}</dd>
          <dt>Atualizado Por</dt>
          <dd>{funcaoEntity.atualizadoPor ? funcaoEntity.atualizadoPor.nome : ''}</dd>
        </dl>
        <Button tag={Link} to="/funcao" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Voltar</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/funcao/${funcaoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editar</span>
        </Button>
      </Col>
    </Row>
  );
};

export default FuncaoDetail;
