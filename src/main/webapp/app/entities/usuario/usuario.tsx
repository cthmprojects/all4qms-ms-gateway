import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IUsuario } from 'app/shared/model/usuario.model';
import { getEntities } from './usuario.reducer';
import GeneralList from 'app/shared/layout/list/general-list';

export const Usuario = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
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

  return (
    <GeneralList />
    // <div>
    //   <h2 id="usuario-heading" data-cy="UsuarioHeading">
    //     Usuarios
    //     <div className="d-flex justify-content-end">
    //       <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
    //         <FontAwesomeIcon icon="sync" spin={loading} /> Atualizar lista
    //       </Button>
    //       <Link to="/usuario/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
    //         <FontAwesomeIcon icon="plus" />
    //         &nbsp; Criar novo Usuario
    //       </Link>
    //     </div>
    //   </h2>
    //   <div className="table-responsive">
    //     {usuarioList && usuarioList.length > 0 ? (
    //       <Table responsive>
    //         <thead>
    //           <tr>
    //             <th className="hand" onClick={sort('id')}>
    //               ID <FontAwesomeIcon icon="sort" />
    //             </th>
    //             <th className="hand" onClick={sort('nome')}>
    //               Nome <FontAwesomeIcon icon="sort" />
    //             </th>
    //             <th className="hand" onClick={sort('email')}>
    //               Email <FontAwesomeIcon icon="sort" />
    //             </th>
    //             <th className="hand" onClick={sort('isGestor')}>
    //               Is Gestor <FontAwesomeIcon icon="sort" />
    //             </th>
    //             <th className="hand" onClick={sort('criadoEm')}>
    //               Criado Em <FontAwesomeIcon icon="sort" />
    //             </th>
    //             <th className="hand" onClick={sort('atualizadoEm')}>
    //               Atualizado Em <FontAwesomeIcon icon="sort" />
    //             </th>
    //             <th>
    //               Funcao <FontAwesomeIcon icon="sort" />
    //             </th>
    //             <th>
    //               Gestor <FontAwesomeIcon icon="sort" />
    //             </th>
    //             <th>
    //               Setor <FontAwesomeIcon icon="sort" />
    //             </th>
    //             <th>
    //               User <FontAwesomeIcon icon="sort" />
    //             </th>
    //             <th>
    //               Criado Por <FontAwesomeIcon icon="sort" />
    //             </th>
    //             <th>
    //               Atualizado Por <FontAwesomeIcon icon="sort" />
    //             </th>
    //             <th />
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {usuarioList.map((usuario, i) => (
    //             <tr key={`entity-${i}`} data-cy="entityTable">
    //               <td>
    //                 <Button tag={Link} to={`/usuario/${usuario.id}`} color="link" size="sm">
    //                   {usuario.id}
    //                 </Button>
    //               </td>
    //               <td>{usuario.nome}</td>
    //               <td>{usuario.email}</td>
    //               <td>{usuario.isGestor ? 'true' : 'false'}</td>
    //               <td>{usuario.criadoEm ? <TextFormat type="date" value={usuario.criadoEm} format={APP_DATE_FORMAT} /> : null}</td>
    //               <td>{usuario.atualizadoEm ? <TextFormat type="date" value={usuario.atualizadoEm} format={APP_DATE_FORMAT} /> : null}</td>
    //               <td>{usuario.funcao ? <Link to={`/funcao/${usuario.funcao.id}`}>{usuario.funcao.nome}</Link> : ''}</td>
    //               <td>{usuario.gestor ? <Link to={`/usuario/${usuario.gestor.id}`}>{usuario.gestor.nome}</Link> : ''}</td>
    //               <td>{usuario.setor ? <Link to={`/setor/${usuario.setor.id}`}>{usuario.setor.nome}</Link> : ''}</td>
    //               <td>{usuario.user ? usuario.user.login : ''}</td>
    //               <td>{usuario.criadoPor ? <Link to={`/usuario/${usuario.criadoPor.id}`}>{usuario.criadoPor.nome}</Link> : ''}</td>
    //               <td>
    //                 {usuario.atualizadoPor ? <Link to={`/usuario/${usuario.atualizadoPor.id}`}>{usuario.atualizadoPor.nome}</Link> : ''}
    //               </td>
    //               <td className="text-end">
    //                 <div className="btn-group flex-btn-group-container">
    //                   <Button tag={Link} to={`/usuario/${usuario.id}`} color="info" size="sm" data-cy="entityDetailsButton">
    //                     <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Visualizar</span>
    //                   </Button>
    //                   <Button
    //                     tag={Link}
    //                     to={`/usuario/${usuario.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
    //                     color="primary"
    //                     size="sm"
    //                     data-cy="entityEditButton"
    //                   >
    //                     <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editar</span>
    //                   </Button>
    //                   <Button
    //                     tag={Link}
    //                     to={`/usuario/${usuario.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
    //                     color="danger"
    //                     size="sm"
    //                     data-cy="entityDeleteButton"
    //                   >
    //                     <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Excluir</span>
    //                   </Button>
    //                 </div>
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </Table>
    //     ) : (
    //       !loading && <div className="alert alert-warning">Nenhum Usuario encontrado</div>
    //     )}
    //   </div>
    //   {totalItems ? (
    //     <div className={usuarioList && usuarioList.length > 0 ? '' : 'd-none'}>
    //       <div className="justify-content-center d-flex">
    //         <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} />
    //       </div>
    //       <div className="justify-content-center d-flex">
    //         <JhiPagination
    //           activePage={paginationState.activePage}
    //           onSelect={handlePagination}
    //           maxButtons={5}
    //           itemsPerPage={paginationState.itemsPerPage}
    //           totalItems={totalItems}
    //         />
    //       </div>
    //     </div>
    //   ) : (
    //     ''
    //   )}
    // </div>
  );
};

export default Usuario;
