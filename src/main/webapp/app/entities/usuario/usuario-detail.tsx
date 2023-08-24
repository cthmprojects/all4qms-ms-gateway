import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
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
        <h2 data-cy="usuarioDetailsHeading">
          <Translate contentKey="all4QmsMsGatewayApp.usuario.detail.title">Usuario</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{usuarioEntity.id}</dd>
          <dt>
            <span id="nome">
              <Translate contentKey="all4QmsMsGatewayApp.usuario.nome">Nome</Translate>
            </span>
          </dt>
          <dd>{usuarioEntity.nome}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="all4QmsMsGatewayApp.usuario.email">Email</Translate>
            </span>
          </dt>
          <dd>{usuarioEntity.email}</dd>
          <dt>
            <span id="isGestor">
              <Translate contentKey="all4QmsMsGatewayApp.usuario.isGestor">Is Gestor</Translate>
            </span>
          </dt>
          <dd>{usuarioEntity.isGestor ? 'true' : 'false'}</dd>
          <dt>
            <span id="criadoEm">
              <Translate contentKey="all4QmsMsGatewayApp.usuario.criadoEm">Criado Em</Translate>
            </span>
          </dt>
          <dd>{usuarioEntity.criadoEm ? <TextFormat value={usuarioEntity.criadoEm} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="atualizadoEm">
              <Translate contentKey="all4QmsMsGatewayApp.usuario.atualizadoEm">Atualizado Em</Translate>
            </span>
          </dt>
          <dd>
            {usuarioEntity.atualizadoEm ? <TextFormat value={usuarioEntity.atualizadoEm} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.usuario.funcao">Funcao</Translate>
          </dt>
          <dd>{usuarioEntity.funcao ? usuarioEntity.funcao.nome : ''}</dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.usuario.gestor">Gestor</Translate>
          </dt>
          <dd>{usuarioEntity.gestor ? usuarioEntity.gestor.nome : ''}</dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.usuario.setor">Setor</Translate>
          </dt>
          <dd>{usuarioEntity.setor ? usuarioEntity.setor.nome : ''}</dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.usuario.user">User</Translate>
          </dt>
          <dd>{usuarioEntity.user ? usuarioEntity.user.login : ''}</dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.usuario.criadoPor">Criado Por</Translate>
          </dt>
          <dd>{usuarioEntity.criadoPor ? usuarioEntity.criadoPor.nome : ''}</dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.usuario.atualizadoPor">Atualizado Por</Translate>
          </dt>
          <dd>{usuarioEntity.atualizadoPor ? usuarioEntity.atualizadoPor.nome : ''}</dd>
          <dt>
            <Translate contentKey="all4QmsMsGatewayApp.usuario.processos">Processos</Translate>
          </dt>
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
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/usuario/${usuarioEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default UsuarioDetail;
