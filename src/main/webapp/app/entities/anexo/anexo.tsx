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

import { getEntities } from './anexo.reducer';

export const Anexo = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  const anexoList = useAppSelector(state => state.all4qmsmsgateway.anexo.entities);
  const loading = useAppSelector(state => state.all4qmsmsgateway.anexo.loading);
  const totalItems = useAppSelector(state => state.all4qmsmsgateway.anexo.totalItems);

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
      <h2 id="anexo-heading" data-cy="AnexoHeading">
        <Translate contentKey="all4QmsMsGatewayApp.anexo.home.title">Anexos</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="all4QmsMsGatewayApp.anexo.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/anexo/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="all4QmsMsGatewayApp.anexo.home.createLabel">Create new Anexo</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {anexoList && anexoList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="all4QmsMsGatewayApp.anexo.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('nomeArquivo')}>
                  <Translate contentKey="all4QmsMsGatewayApp.anexo.nomeArquivo">Nome Arquivo</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('nomeArquivo')} />
                </th>
                <th className="hand" onClick={sort('nomeOriginal')}>
                  <Translate contentKey="all4QmsMsGatewayApp.anexo.nomeOriginal">Nome Original</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('nomeOriginal')} />
                </th>
                <th className="hand" onClick={sort('extensao')}>
                  <Translate contentKey="all4QmsMsGatewayApp.anexo.extensao">Extensao</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('extensao')} />
                </th>
                <th className="hand" onClick={sort('criadoEm')}>
                  <Translate contentKey="all4QmsMsGatewayApp.anexo.criadoEm">Criado Em</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('criadoEm')} />
                </th>
                <th className="hand" onClick={sort('atualizadoEm')}>
                  <Translate contentKey="all4QmsMsGatewayApp.anexo.atualizadoEm">Atualizado Em</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('atualizadoEm')} />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {anexoList.map((anexo, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/anexo/${anexo.id}`} color="link" size="sm">
                      {anexo.id}
                    </Button>
                  </td>
                  <td>{anexo.nomeArquivo}</td>
                  <td>{anexo.nomeOriginal}</td>
                  <td>{anexo.extensao}</td>
                  <td>{anexo.criadoEm ? <TextFormat type="date" value={anexo.criadoEm} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{anexo.atualizadoEm ? <TextFormat type="date" value={anexo.atualizadoEm} format={APP_DATE_FORMAT} /> : null}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/anexo/${anexo.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/anexo/${anexo.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`/anexo/${anexo.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
              <Translate contentKey="all4QmsMsGatewayApp.anexo.home.notFound">No Anexos found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={anexoList && anexoList.length > 0 ? '' : 'd-none'}>
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

export default Anexo;
