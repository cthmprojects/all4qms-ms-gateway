import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { ISetor } from 'app/shared/model/setor.model';
import { getEntities } from './setor.reducer';

export const Setor = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  const setorList = useAppSelector(state => state.all4qmsmsgateway.setor.entities);
  const loading = useAppSelector(state => state.all4qmsmsgateway.setor.loading);
  const totalItems = useAppSelector(state => state.all4qmsmsgateway.setor.totalItems);

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

  return (
    <div>
      <h2 id="setor-heading" data-cy="SetorHeading">
        Setors
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Atualizar lista
          </Button>
          <Link to="/setor/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Criar novo Setor
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {setorList && setorList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  ID <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nome')}>
                  Nome <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('descricao')}>
                  Descricao <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('criadoEm')}>
                  Criado Em <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('atualizadoEm')}>
                  Atualizado Em <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  Criado Por <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  Atualizado Por <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {setorList.map((setor, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/setor/${setor.id}`} color="link" size="sm">
                      {setor.id}
                    </Button>
                  </td>
                  <td>{setor.nome}</td>
                  <td>{setor.descricao}</td>
                  <td>{setor.criadoEm ? <TextFormat type="date" value={setor.criadoEm} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{setor.atualizadoEm ? <TextFormat type="date" value={setor.atualizadoEm} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{setor.criadoPor ? <Link to={`/usuario/${setor.criadoPor.id}`}>{setor.criadoPor.nome}</Link> : ''}</td>
                  <td>{setor.atualizadoPor ? <Link to={`/usuario/${setor.atualizadoPor.id}`}>{setor.atualizadoPor.nome}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/setor/${setor.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Visualizar</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/setor/${setor.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editar</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/setor/${setor.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Excluir</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">Nenhum Setor encontrado</div>
        )}
      </div>
      {totalItems ? (
        <div className={setorList && setorList.length > 0 ? '' : 'd-none'}>
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

export default Setor;
