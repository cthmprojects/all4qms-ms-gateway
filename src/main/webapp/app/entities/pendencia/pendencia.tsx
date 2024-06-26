import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Row, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState, JhiPagination, JhiItemCount, Storage } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Divider,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { IPendencia } from '../../shared/model/pendencia.model';
import { getEntitiesById as getPendenciasByUser } from './pendencia.reducer';
import { getEntity as getUsuario } from '../usuario/usuario.reducer';
import { PendenciaOptions } from './pendencia-options';
import { AxiosResponse } from 'axios';

export const Pendencia = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const jhipsterId = parseInt(Storage.session.get('ID_USUARIO'));
  const [userRole, setUserRole] = useState<Array<String>>(Storage.local.get('ROLE'));
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );
  const [pendenciasList, setPendenciasList] = React.useState<IPendencia[]>([]);

  // const pendenciaList: IPendencia[] = useAppSelector(state => state.all4qmsmsgateway.pendencia.entities);
  // const loading = useAppSelector(state => state.all4qmsmsgateway.pendencia.loading);
  const totalItems = useAppSelector(state => state.all4qmsmsgateway.pendencia.totalItems);
  const userQms = useAppSelector(state => state.authentication.accountQms);

  const getAllPendencias = async () => {
    try {
      const user = userQms?.id ? userQms : JSON.parse(await Storage.session.get('USUARIO_QMS'));
      const resPendencias = await dispatch(
        getPendenciasByUser({
          page: 1,
          size: 10,
          sort: `id,desc`,
          idUser: user.id,
        })
      );
      const pendencias: IPendencia[] = (resPendencias.payload as AxiosResponse).data;
      setPendenciasList(pendencias);
    } catch (err) {
      console.error('header getAllEntities: ', err);
    }
  };

  const sortEntities = () => {
    getAllPendencias();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (location.search !== endURL) {
      navigate(`${location.pathname}${endURL}`);
    }
  };

  // useEffect(() => {
  //   dispatch(getUsuario(jhipsterId));
  // }, []);

  useEffect(() => {
    // dispatch(getUsuario(jhipsterId));
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

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };
  const handleDeleteUser = (loginJhUser: any, idRncUser: any) => {
    // dispatch(deleteRNCUser(idRncUser.toString())).then(() => {
    //   dispatch(deleteJhipsterUser(loginJhUser.toString())).then(() => {
    //     sortEntities();
    //   });
    // });
  };

  const columns = ['Nome', 'Status', 'Lida Em', 'Link', 'Tipo', 'Criado Por', 'Ações'];

  const renderTable = () => {
    if (columns.length > 0 && pendenciasList.length > 0) {
      return (
        <>
          <TableContainer component={Paper} style={{ marginTop: '30px', boxShadow: 'none' }}>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  {columns.map(col => (
                    <TableCell align="left">{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pendenciasList.map((pendencia, i) => (
                  <TableRow>
                    <TableCell>{pendencia.nome}</TableCell>
                    <TableCell>{pendencia.status ? 'true' : 'false'}</TableCell>
                    <TableCell>{pendencia.lidaEm}</TableCell>
                    <TableCell>{pendencia.link}</TableCell>
                    <TableCell>{pendencia.tipo?.toString()}</TableCell>
                    <TableCell>
                      {pendencia.criadoPor ? <Link to={`/usuario/${pendencia.criadoPor.id}`}>{pendencia.criadoPor.nome}</Link> : ''}
                    </TableCell>
                    <TableCell>
                      <PendenciaOptions userRole={userRole} pendencia={pendencia} deleteUser={handleDeleteUser} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </>
      );
    } else {
      return (
        <Row className="justify-content-center mt-5">
          <span style={{ color: '#7d7d7d' }}>Nenhum item encontrado.</span>
        </Row>
      );
    }
  };

  return (
    <>
      {pendenciasList.length < 1 ? (
        <Box
          sx={{
            display: 'flex',
            width: '100vw',
            height: '100vh',
            background: '#c6c6c6',
            zIndex: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={80} />
        </Box>
      ) : (
        <div className="padding-container">
          <div className="container-style">
            <Breadcrumbs aria-label="breadcrumb">
              <Link style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }} to={'/'}>
                Home
              </Link>
              <Typography className="link">Usuários</Typography>
            </Breadcrumbs>
            <h1 className="title">Pendências</h1>
            <div style={{ paddingBottom: '30px' }}>
              <Button
                variant="contained"
                className="primary-button"
                style={{ marginRight: '10px' }}
                onClick={() => navigate('/pendencia/new')}
              >
                CADASTRAR
              </Button>
              <Button variant="contained" className="update-button" onClick={() => getAllPendencias()}>
                ATUALIZAR
              </Button>
            </div>
            <Divider sx={{ borderColor: '#7d7d7d' }}></Divider>
            {renderTable()}
          </div>
        </div>
      )}
    </>
  );
};

export default Pendencia;
