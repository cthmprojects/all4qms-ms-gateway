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

import { getEntities } from './pendencia.reducer';

export const Pendencia = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  const pendenciaList = useAppSelector(state => state.all4qmsmsgateway.pendencia.entities);
  const loading = useAppSelector(state => state.all4qmsmsgateway.pendencia.loading);
  const totalItems = useAppSelector(state => state.all4qmsmsgateway.pendencia.totalItems);

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
      <h2 id="pendencia-heading" data-cy="PendenciaHeading">
        <Translate contentKey="all4QmsMsGatewayApp.pendencia.home.title">Pendencias</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="all4QmsMsGatewayApp.pendencia.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/pendencia/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="all4QmsMsGatewayApp.pendencia.home.createLabel">Create new Pendencia</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {pendenciaList && pendenciaList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="all4QmsMsGatewayApp.pendencia.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('nome')}>
                  <Translate contentKey="all4QmsMsGatewayApp.pendencia.nome">Nome</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('nome')} />
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="all4QmsMsGatewayApp.pendencia.status">Status</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                </th>
                <th className="hand" onClick={sort('lidaEm')}>
                  <Translate contentKey="all4QmsMsGatewayApp.pendencia.lidaEm">Lida Em</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('lidaEm')} />
                </th>
                <th className="hand" onClick={sort('link')}>
                  <Translate contentKey="all4QmsMsGatewayApp.pendencia.link">Link</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('link')} />
                </th>
                <th className="hand" onClick={sort('tipo')}>
                  <Translate contentKey="all4QmsMsGatewayApp.pendencia.tipo">Tipo</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('tipo')} />
                </th>
                <th className="hand" onClick={sort('criadoEm')}>
                  <Translate contentKey="all4QmsMsGatewayApp.pendencia.criadoEm">Criado Em</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('criadoEm')} />
                </th>
                <th>
                  <Translate contentKey="all4QmsMsGatewayApp.pendencia.responsavel">Responsavel</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="all4QmsMsGatewayApp.pendencia.criadoPor">Criado Por</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="all4QmsMsGatewayApp.pendencia.atualizadoPor">Atualizado Por</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {pendenciaList.map((pendencia, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/pendencia/${pendencia.id}`} color="link" size="sm">
                      {pendencia.id}
                    </Button>
                  </td>
                  <td>{pendencia.nome}</td>
                  <td>{pendencia.status ? 'true' : 'false'}</td>
                  <td>{pendencia.lidaEm ? <TextFormat type="date" value={pendencia.lidaEm} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{pendencia.link}</td>
                  <td>{pendencia.tipo}</td>
                  <td>{pendencia.criadoEm ? <TextFormat type="date" value={pendencia.criadoEm} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>
                    {pendencia.responsavel ? <Link to={`/usuario/${pendencia.responsavel.id}`}>{pendencia.responsavel.nome}</Link> : ''}
                  </td>
                  <td>{pendencia.criadoPor ? <Link to={`/usuario/${pendencia.criadoPor.id}`}>{pendencia.criadoPor.nome}</Link> : ''}</td>
                  <td>
                    {pendencia.atualizadoPor ? (
                      <Link to={`/usuario/${pendencia.atualizadoPor.id}`}>{pendencia.atualizadoPor.nome}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/pendencia/${pendencia.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/pendencia/${pendencia.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`/pendencia/${pendencia.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="all4QmsMsGatewayApp.pendencia.home.notFound">No Pendencias found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={pendenciaList && pendenciaList.length > 0 ? '' : 'd-none'}>
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

export default Pendencia;
