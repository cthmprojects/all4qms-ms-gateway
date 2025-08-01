import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Table } from 'reactstrap';
import { getSortState, JhiPagination, Storage } from 'react-jhipster';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './usuario.reducer';
import { deleteUser as deleteJhipsterUser } from 'app/modules/administration/user-management/user-management.reducer';
import { deleteEntity as deleteRNCUser } from './usuario.reducer';
import { UsarioOptions } from './usuario-options';
import { getEntities as getFuncaos } from 'app/entities/funcao/funcao.reducer';
import { getEntities as getSetors } from 'app/entities/setor/setor.reducer';
import { getEntities as getProcessos } from 'app/entities/processo/processo.reducer';

import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Divider,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import './usuario.scss';

export const Usuario = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState<Array<String>>(Storage.local.get('ROLE') || []);
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userAuthorities, setUserAuthorities] = useState<{ [key: number]: string[] }>({});
  const authoritiesFetchedRef = useRef<Set<number>>(new Set());

  // Estados para filtros
  const [filters, setFilters] = useState({
    nome: '',
    email: '',
    funcao: '',
    gestor: '',
    setor: '',
    isGestor: '',
    perfil: '',
    processo: '',
  });

  const usuarioList = useAppSelector(state => state.all4qmsmsgateway.usuario.entities);
  const totalItems = useAppSelector(state => state.all4qmsmsgateway.usuario.totalItems);

  // Dados para filtros
  const funcaos = useAppSelector(state => state.all4qmsmsgateway.funcao.entities);
  const setors = useAppSelector(state => state.all4qmsmsgateway.setor.entities);
  const processos = useAppSelector(state => state.all4qmsmsgateway.processo.entities);

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

  // Carregar dados para filtros
  useEffect(() => {
    dispatch(getFuncaos({}));
    dispatch(getSetors({}));
    dispatch(getProcessos({}));
  }, [dispatch]);

  // Função incremental para buscar apenas authorities faltantes
  const fetchMissingUserAuthorities = async (userIds: number[]) => {
    const missingIds = userIds.filter(id => !userAuthorities[id] && !authoritiesFetchedRef.current.has(id));
    if (missingIds.length === 0) return;
    authoritiesFetchedRef.current = new Set([...authoritiesFetchedRef.current, ...missingIds]);
    try {
      const response = await fetch('/api/usuarios/authorities-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(missingIds),
      });
      if (response.ok) {
        const authoritiesMap = await response.json();
        setUserAuthorities(prev => ({ ...prev, ...authoritiesMap }));
      }
    } catch (error) {
      console.error('Erro ao buscar authorities dos usuários:', error);
    }
  };

  const formatAuthority = (authority: string): string => {
    return authority.replace('ROLE_', '');
  };

  const clearFilters = () => {
    setFilters({
      nome: '',
      email: '',
      funcao: '',
      gestor: '',
      setor: '',
      isGestor: '',
      perfil: '',
      processo: '',
    });
  };

  const filteredUsuarioList = usuarioList.filter(usuario => {
    const nomeMatch = !filters.nome || usuario.nome?.toLowerCase().includes(filters.nome.toLowerCase());

    const emailMatch = !filters.email || usuario.email?.toLowerCase().includes(filters.email.toLowerCase());

    const funcaoMatch = !filters.funcao || usuario.funcao?.nome?.toLowerCase().includes(filters.funcao.toLowerCase());

    const gestorMatch = !filters.gestor || usuario.gestor?.nome?.toLowerCase().includes(filters.gestor.toLowerCase());

    const setorMatch = !filters.setor || usuario.setor?.nome?.toLowerCase().includes(filters.setor.toLowerCase());

    const isGestorMatch =
      !filters.isGestor || (filters.isGestor === 'SIM' && usuario.isGestor) || (filters.isGestor === 'NÃO' && !usuario.isGestor);

    const perfilMatch =
      !filters.perfil ||
      userAuthorities[usuario.id]?.some(authority => formatAuthority(authority).toLowerCase().includes(filters.perfil.toLowerCase()));

    const processoMatch =
      !filters.processo || usuario.processos?.some(processo => processo.nome?.toLowerCase().includes(filters.processo.toLowerCase()));

    return nomeMatch && emailMatch && funcaoMatch && gestorMatch && setorMatch && isGestorMatch && perfilMatch && processoMatch;
  });

  // Nunca limpe o cache de authorities ao filtrar. Só limpe ao trocar de página ou sort.
  useEffect(() => {
    authoritiesFetchedRef.current.clear();
    setUserAuthorities({});
  }, [paginationState.activePage, paginationState.sort, paginationState.order]);

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
  }, [location.search, navigate, paginationState]);

  // Buscar authorities incrementais dos usuários filtrados
  useEffect(() => {
    if (filteredUsuarioList.length > 0) {
      const userIds = filteredUsuarioList.map(usuario => usuario.id);
      fetchMissingUserAuthorities(userIds);
    }
  }, [filteredUsuarioList]);

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleDeleteUser = (loginJhUser: any, idRncUser: any) => {
    dispatch(deleteRNCUser(idRncUser.toString())).then(() => {
      dispatch(deleteJhipsterUser(loginJhUser.toString())).then(() => {
        sortEntities();
      });
    });
  };

  const columns = ['Nome', 'E-mail', 'Função', 'Setor', 'Gestor', 'É Gestor?', 'Perfil', 'Processos', 'Ações'];

  const renderTable = () => {
    if (columns.length > 0 && filteredUsuarioList.length > 0) {
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
                {filteredUsuarioList.map(usuario => (
                  <TableRow>
                    <TableCell>{usuario.nome}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.funcao.nome}</TableCell>
                    <TableCell>{usuario.setor.nome}</TableCell>
                    <TableCell>{usuario.gestor.nome}</TableCell>
                    <TableCell>
                      <Chip
                        label={usuario.isGestor ? 'SIM' : 'NÃO'}
                        size="small"
                        variant="outlined"
                        color={usuario.isGestor ? 'success' : 'error'}
                        sx={{ fontSize: '0.75rem', height: '20px' }}
                      />
                    </TableCell>
                    <TableCell>
                      {userAuthorities[usuario.id] && userAuthorities[usuario.id].length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {userAuthorities[usuario.id].map((authority, index) => (
                            <Chip
                              key={index}
                              label={formatAuthority(authority)}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ fontSize: '0.75rem', height: '20px' }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <span style={{ color: '#999' }}>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {usuario.processos?.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {usuario.processos.map((processo, index) => (
                            <Chip
                              key={index}
                              label={processo.nome}
                              size="small"
                              variant="outlined"
                              color="secondary"
                              sx={{ fontSize: '0.75rem', height: '20px' }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <span style={{ color: '#999' }}>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <UsarioOptions userRole={userRole} user={usuario} deleteUser={handleDeleteUser} />
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
      {usuarioList.lenght > 0 ? (
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
            <h1 className="title">Usuários</h1>
            <div style={{ paddingBottom: '30px' }}>
              <Button
                variant="contained"
                className="primary-button"
                style={{ marginRight: '10px' }}
                onClick={() => navigate('/usuario/new')}
              >
                CADASTRAR
              </Button>
              <Button variant="contained" className="update-button" onClick={() => getAllEntities()}>
                ATUALIZAR
              </Button>
            </div>
            <Divider sx={{ borderColor: '#7d7d7d' }}></Divider>

            {/* Filtros */}
            <Box sx={{ padding: '20px 0', display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Nome"
                value={filters.nome}
                onChange={e => setFilters({ ...filters, nome: e.target.value })}
                size="small"
                sx={{ minWidth: 150 }}
              />

              <TextField
                label="E-mail"
                value={filters.email}
                onChange={e => setFilters({ ...filters, email: e.target.value })}
                size="small"
                sx={{ minWidth: 200 }}
              />

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Função</InputLabel>
                <Select value={filters.funcao} onChange={e => setFilters({ ...filters, funcao: e.target.value })} label="Função">
                  <MenuItem value="">Todas</MenuItem>
                  {funcaos.map(funcao => (
                    <MenuItem key={funcao.id} value={funcao.nome}>
                      {funcao.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Setor</InputLabel>
                <Select value={filters.setor} onChange={e => setFilters({ ...filters, setor: e.target.value })} label="Setor">
                  <MenuItem value="">Todos</MenuItem>
                  {setors.map(setor => (
                    <MenuItem key={setor.id} value={setor.nome}>
                      {setor.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Gestor"
                value={filters.gestor}
                onChange={e => setFilters({ ...filters, gestor: e.target.value })}
                size="small"
                sx={{ minWidth: 150 }}
              />

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>É Gestor?</InputLabel>
                <Select value={filters.isGestor} onChange={e => setFilters({ ...filters, isGestor: e.target.value })} label="É Gestor?">
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="SIM">SIM</MenuItem>
                  <MenuItem value="NÃO">NÃO</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Perfil"
                value={filters.perfil}
                onChange={e => setFilters({ ...filters, perfil: e.target.value })}
                size="small"
                sx={{ minWidth: 150 }}
              />

              <TextField
                label="Processo"
                value={filters.processo}
                onChange={e => setFilters({ ...filters, processo: e.target.value })}
                size="small"
                sx={{ minWidth: 150 }}
              />

              <Button
                variant="contained"
                onClick={clearFilters}
                sx={{
                  height: '40px',
                  backgroundColor: '#6c757d',
                  '&:hover': { backgroundColor: '#5a6268' },
                }}
              >
                Limpar
              </Button>
            </Box>

            {renderTable()}
          </div>
        </div>
      )}
    </>
  );
};

export default Usuario;
