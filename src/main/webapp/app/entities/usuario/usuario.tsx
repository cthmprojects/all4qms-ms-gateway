import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat, getPaginationState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './usuario.reducer';

export const Usuario = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  const usuarioList = useAppSelector(state => state.all4qmsmsgateway.usuario.entities);
  const loading = useAppSelector(state => state.all4qmsmsgateway.usuario.loading);
  const totalItems = useAppSelector(state => state.all4qmsmsgateway.usuario.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      })
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (location.search !== endURL) {
      navigate(`${location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;
    const order = paginationState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    } else {
      return order === ASC ? faSortUp : faSortDown;
    }
  };

  return (
    <div>
      <h2 id="usuario-heading" data-cy="UsuarioHeading">
        <Translate contentKey="all4QmsMsGatewayApp.usuario.home.title">Usuarios</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="all4QmsMsGatewayApp.usuario.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/usuario/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="all4QmsMsGatewayApp.usuario.home.createLabel">Create new Usuario</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {usuarioList && usuarioList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="all4QmsMsGatewayApp.usuario.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('nome')}>
                  <Translate contentKey="all4QmsMsGatewayApp.usuario.nome">Nome</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('nome')} />
                </th>
                <th className="hand" onClick={sort('email')}>
                  <Translate contentKey="all4QmsMsGatewayApp.usuario.email">Email</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('email')} />
                </th>
                <th className="hand" onClick={sort('isGestor')}>
                  <Translate contentKey="all4QmsMsGatewayApp.usuario.isGestor">Is Gestor</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('isGestor')} />
                </th>
                <th className="hand" onClick={sort('criadoEm')}>
                  <Translate contentKey="all4QmsMsGatewayApp.usuario.criadoEm">Criado Em</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('criadoEm')} />
                </th>
                <th className="hand" onClick={sort('atualizadoEm')}>
                  <Translate contentKey="all4QmsMsGatewayApp.usuario.atualizadoEm">Atualizado Em</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('atualizadoEm')} />
                </th>
                <th>
                  <Translate contentKey="all4QmsMsGatewayApp.usuario.funcao">Funcao</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="all4QmsMsGatewayApp.usuario.gestor">Gestor</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="all4QmsMsGatewayApp.usuario.setor">Setor</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="all4QmsMsGatewayApp.usuario.user">User</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="all4QmsMsGatewayApp.usuario.criadoPor">Criado Por</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="all4QmsMsGatewayApp.usuario.atualizadoPor">Atualizado Por</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {usuarioList.map((usuario, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/usuario/${usuario.id}`} color="link" size="sm">
                      {usuario.id}
                    </Button>
                  </td>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.isGestor ? 'true' : 'false'}</td>
                  <td>{usuario.criadoEm ? <TextFormat type="date" value={usuario.criadoEm} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{usuario.atualizadoEm ? <TextFormat type="date" value={usuario.atualizadoEm} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{usuario.funcao ? <Link to={`/funcao/${usuario.funcao.id}`}>{usuario.funcao.nome}</Link> : ''}</td>
                  <td>{usuario.gestor ? <Link to={`/usuario/${usuario.gestor.id}`}>{usuario.gestor.nome}</Link> : ''}</td>
                  <td>{usuario.setor ? <Link to={`/setor/${usuario.setor.id}`}>{usuario.setor.nome}</Link> : ''}</td>
                  <td>{usuario.user ? usuario.user.login : ''}</td>
                  <td>{usuario.criadoPor ? <Link to={`/usuario/${usuario.criadoPor.id}`}>{usuario.criadoPor.nome}</Link> : ''}</td>
                  <td>
                    {usuario.atualizadoPor ? <Link to={`/usuario/${usuario.atualizadoPor.id}`}>{usuario.atualizadoPor.nome}</Link> : ''}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/usuario/${usuario.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/usuario/${usuario.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/usuario/${usuario.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="all4QmsMsGatewayApp.usuario.home.notFound">No Usuarios found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={usuarioList && usuarioList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} />
          </div>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Usuario;
