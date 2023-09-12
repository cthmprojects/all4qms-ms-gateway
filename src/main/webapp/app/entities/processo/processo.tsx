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

import { getEntities } from './processo.reducer';

export const Processo = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  const processoList = useAppSelector(state => state.all4qmsmsgateway.processo.entities);
  const loading = useAppSelector(state => state.all4qmsmsgateway.processo.loading);
  const totalItems = useAppSelector(state => state.all4qmsmsgateway.processo.totalItems);

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
      <h2 id="processo-heading" data-cy="ProcessoHeading">
        <Translate contentKey="all4QmsMsGatewayApp.processo.home.title">Processos</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="all4QmsMsGatewayApp.processo.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/processo/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="all4QmsMsGatewayApp.processo.home.createLabel">Create new Processo</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {processoList && processoList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="all4QmsMsGatewayApp.processo.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('numero')}>
                  <Translate contentKey="all4QmsMsGatewayApp.processo.numero">Numero</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('numero')} />
                </th>
                <th className="hand" onClick={sort('nome')}>
                  <Translate contentKey="all4QmsMsGatewayApp.processo.nome">Nome</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('nome')} />
                </th>
                <th className="hand" onClick={sort('descricao')}>
                  <Translate contentKey="all4QmsMsGatewayApp.processo.descricao">Descricao</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('descricao')} />
                </th>
                <th className="hand" onClick={sort('setor')}>
                  <Translate contentKey="all4QmsMsGatewayApp.processo.setor">Setor</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('setor')} />
                </th>
                <th className="hand" onClick={sort('responsavel')}>
                  <Translate contentKey="all4QmsMsGatewayApp.processo.responsavel">Responsavel</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('responsavel')} />
                </th>
                <th className="hand" onClick={sort('setorResponsavel')}>
                  <Translate contentKey="all4QmsMsGatewayApp.processo.setorResponsavel">Setor Responsavel</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('setorResponsavel')} />
                </th>
                <th className="hand" onClick={sort('criadoEm')}>
                  <Translate contentKey="all4QmsMsGatewayApp.processo.criadoEm">Criado Em</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('criadoEm')} />
                </th>
                <th className="hand" onClick={sort('atualizadoEm')}>
                  <Translate contentKey="all4QmsMsGatewayApp.processo.atualizadoEm">Atualizado Em</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('atualizadoEm')} />
                </th>
                <th>
                  <Translate contentKey="all4QmsMsGatewayApp.processo.criadoPor">Criado Por</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="all4QmsMsGatewayApp.processo.atualizadoPor">Atualizado Por</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {processoList.map((processo, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/processo/${processo.id}`} color="link" size="sm">
                      {processo.id}
                    </Button>
                  </td>
                  <td>{processo.numero}</td>
                  <td>{processo.nome}</td>
                  <td>{processo.descricao}</td>
                  <td>{processo.setor}</td>
                  <td>{processo.responsavel}</td>
                  <td>{processo.setorResponsavel}</td>
                  <td>{processo.criadoEm ? <TextFormat type="date" value={processo.criadoEm} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>
                    {processo.atualizadoEm ? <TextFormat type="date" value={processo.atualizadoEm} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>{processo.criadoPor ? <Link to={`/usuario/${processo.criadoPor.id}`}>{processo.criadoPor.nome}</Link> : ''}</td>
                  <td>
                    {processo.atualizadoPor ? <Link to={`/usuario/${processo.atualizadoPor.id}`}>{processo.atualizadoPor.nome}</Link> : ''}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/processo/${processo.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/processo/${processo.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`/processo/${processo.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="all4QmsMsGatewayApp.processo.home.notFound">No Processos found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={processoList && processoList.length > 0 ? '' : 'd-none'}>
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

export default Processo;
