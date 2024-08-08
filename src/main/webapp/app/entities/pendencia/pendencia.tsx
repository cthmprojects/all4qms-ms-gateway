import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState, JhiPagination, JhiItemCount, Storage } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { Modal } from 'app/shared/components-form/Modal';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { IPendencia } from '../../shared/model/pendencia.model';
import { getEntitiesById as getPendenciasByUser, deleteEntity as deletePendenciaId } from './pendencia.reducer';
import { getEntity as getUsuario } from '../usuario/usuario.reducer';
import { PendenciaOptions } from './pendencia-options';
import { PendenciaDetail } from './pendencia-detail';
import { AxiosResponse } from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export const Pendencia = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();

  const location = useLocation();
  const navigate = useNavigate();

  const jhipsterId = parseInt(Storage.session.get('ID_USUARIO'));
  const [userRole, setUserRole] = useState<Array<String>>(Storage.local.get('ROLE'));
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );
  const [pendenciasList, setPendenciasList] = React.useState<IPendencia[]>([]);
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const [idPendenciaSelect, setIdPendenciaSelect] = React.useState<number>(-1);

  // const pendenciaList: IPendencia[] = useAppSelector(state => state.all4qmsmsgateway.pendencia.entities);
  // const loading = useAppSelector(state => state.all4qmsmsgateway.pendencia.loading);
  const totalItems = useAppSelector(state => state.all4qmsmsgateway.pendencia.totalItems);
  const userQms = useAppSelector(state => state.authentication.accountQms);

  const getAllPendencias = async () => {
    try {
      const user = userQms?.id ? userQms : JSON.parse(await Storage.session.get('USUARIO_QMS'));
      const resPendencias = await dispatch(
        getPendenciasByUser({
          page: paginationState.activePage,
          size: 5,
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

  useEffect(() => {
    if (id) {
      setIdPendenciaSelect(Number(id));
      setIsOpenModal(true);
    }
  }, [id]);

  useEffect(() => {
    // dispatch(getUsuario(jhipsterId));
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort, isOpenModal]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        itemsPerPage: 5,
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
  const deletePendencia = (id: any) => {
    dispatch(deletePendenciaId(id.toString())).then(() => {
      sortEntities();
    });
  };

  const openLink = link => {
    navigate(link);
  };

  const columns = ['Tipo', 'Descrição', 'Link', 'status', 'Criado Em', 'Ações'];

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
                    {/* <TableCell>{pendencia.id}</TableCell> */}
                    <TableCell width={120}>{pendencia.tipo?.toString()}</TableCell>
                    <TableCell>{pendencia.nome}</TableCell>
                    <TableCell>
                      <Button variant="text" onClick={() => openLink(pendencia.link)}>
                        Abrir
                      </Button>
                    </TableCell>
                    <TableCell>
                      {pendencia.status ? (
                        <Tooltip title="Visto">
                          <IconButton>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Não visto">
                          <IconButton>
                            <VisibilityOffIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell width={120}>{new Date(String(pendencia.criadoEm)).toLocaleDateString()}</TableCell>
                    {/* <TableCell>
                      {pendencia.criadoPor ? <Link to={`/usuario/${pendencia.criadoPor.id}`}>{pendencia.criadoPor.nome}</Link> : ''}
                    </TableCell> */}
                    <TableCell width={100}>
                      <PendenciaOptions
                        userRole={userRole}
                        pendencia={pendencia}
                        deletePendencia={deletePendencia}
                        setIdPendenciaSelect={setIdPendenciaSelect}
                        setIsOpenModal={setIsOpenModal}
                      />
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
      <Modal
        backgroundColor="#839AC4"
        open={isOpenModal}
        // handleClose={() => setIsOpenModal(false)}
        maxWidth={'sm'}
        fullWidth={true}
        color="#fff"
        colorIcon="#fff"
      >
        <PendenciaDetail id={idPendenciaSelect} handleClose={() => setIsOpenModal(false)} />
      </Modal>
    </>
  );
};

export default Pendencia;
