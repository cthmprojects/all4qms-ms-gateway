import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './usuario.reducer';

export const UsuarioDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const usuarioEntity = useAppSelector(state => state.all4qmsmsgateway.usuario.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="usuarioDetailsHeading">Usuario</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">Código</span>
          </dt>
          <dd>{usuarioEntity.id}</dd>
          <dt>
            <span id="nome">Nome</span>
          </dt>
          <dd>{usuarioEntity.nome}</dd>
          <dt>
            <span id="email">Email</span>
          </dt>
          <dd>{usuarioEntity.email}</dd>
          <dt>
            <span id="isGestor">Is Gestor</span>
          </dt>
          <dd>{usuarioEntity.isGestor ? 'true' : 'false'}</dd>
          <dt>
            <span id="criadoEm">Criado Em</span>
          </dt>
          <dd>{usuarioEntity.criadoEm ? <TextFormat value={usuarioEntity.criadoEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="atualizadoEm">Atualizado Em</span>
          </dt>
          <dd>
            {usuarioEntity.atualizadoEm ? <TextFormat value={usuarioEntity.atualizadoEm} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>Funcao</dt>
          <dd>{usuarioEntity.funcao ? usuarioEntity.funcao.nome : ''}</dd>
          <dt>Gestor</dt>
          <dd>{usuarioEntity.gestor ? usuarioEntity.gestor.nome : ''}</dd>
          <dt>Setor</dt>
          <dd>{usuarioEntity.setor ? usuarioEntity.setor.nome : ''}</dd>
          <dt>User</dt>
          <dd>{usuarioEntity.user ? usuarioEntity.user.login : ''}</dd>
          <dt>Criado Por</dt>
          <dd>{usuarioEntity.criadoPor ? usuarioEntity.criadoPor.nome : ''}</dd>
          <dt>Atualizado Por</dt>
          <dd>{usuarioEntity.atualizadoPor ? usuarioEntity.atualizadoPor.nome : ''}</dd>
          <dt>Processos</dt>
          <dd>
            {usuarioEntity.processos
              ? usuarioEntity.processos.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.nome}</a>
                    {usuarioEntity.processos && i === usuarioEntity.processos.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/usuario" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Voltar</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/usuario/${usuarioEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editar</span>
        </Button>
      </Col>
    </Row>
  );
};

export default UsuarioDetail;
