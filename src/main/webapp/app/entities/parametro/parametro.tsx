import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './parametro.reducer';

export const Parametro = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(location, 'id'), location.search));

  const parametroList = useAppSelector(state => state.all4qmsmsgateway.parametro.entities);
  const loading = useAppSelector(state => state.all4qmsmsgateway.parametro.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      })
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (location.search !== endURL) {
      navigate(`${location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    } else {
      return order === ASC ? faSortUp : faSortDown;
    }
  };

  return (
    <div>
      <h2 id="parametro-heading" data-cy="ParametroHeading">
        <Translate contentKey="all4QmsMsGatewayApp.parametro.home.title">Parametros</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="all4QmsMsGatewayApp.parametro.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/parametro/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="all4QmsMsGatewayApp.parametro.home.createLabel">Create new Parametro</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {parametroList && parametroList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="all4QmsMsGatewayApp.parametro.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('chave')}>
                  <Translate contentKey="all4QmsMsGatewayApp.parametro.chave">Chave</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('chave')} />
                </th>
                <th className="hand" onClick={sort('valor')}>
                  <Translate contentKey="all4QmsMsGatewayApp.parametro.valor">Valor</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('valor')} />
                </th>
                <th className="hand" onClick={sort('nomeAmigavel')}>
                  <Translate contentKey="all4QmsMsGatewayApp.parametro.nomeAmigavel">Nome Amigavel</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('nomeAmigavel')} />
                </th>
                <th className="hand" onClick={sort('atualizadoEm')}>
                  <Translate contentKey="all4QmsMsGatewayApp.parametro.atualizadoEm">Atualizado Em</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('atualizadoEm')} />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {parametroList.map((parametro, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/parametro/${parametro.id}`} color="link" size="sm">
                      {parametro.id}
                    </Button>
                  </td>
                  <td>{parametro.chave}</td>
                  <td>{parametro.valor}</td>
                  <td>{parametro.nomeAmigavel}</td>
                  <td>
                    {parametro.atualizadoEm ? <TextFormat type="date" value={parametro.atualizadoEm} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/parametro/${parametro.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/parametro/${parametro.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/parametro/${parametro.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
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
              <Translate contentKey="all4QmsMsGatewayApp.parametro.home.notFound">No Parametros found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Parametro;
