import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row } from 'reactstrap';
import { getSortState, JhiPagination } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IProcesso } from 'app/shared/model/processo.model';
import { IUsuario } from 'app/shared/model/usuario.model';
import { getEntities, deleteEntity, createEntity, updateEntity } from './processo.reducer';

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
  TextField,
  IconButton,
  Chip,
  Table,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useConfirmDialog } from 'app/shared/hooks/useConfirmDialog';

export const Processo = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  // Estados para filtros
  const [filters, setFilters] = useState({
    numero: '',
    nome: '',
    descricao: '',
    setor: '',
    responsavel: '',
  });

  // Estados para modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProcesso, setEditingProcesso] = useState<IProcesso | null>(null);
  const [formData, setFormData] = useState({
    numero: '',
    nome: '',
    descricao: '',
    setor: '',
    responsavel: '',
  });

  const processoList = useAppSelector(state => state.all4qmsmsgateway.processo.entities);
  const loading = useAppSelector(state => state.all4qmsmsgateway.processo.loading);
  const totalItems = useAppSelector(state => state.all4qmsmsgateway.processo.totalItems);
  const updateSuccess = useAppSelector(state => state.all4qmsmsgateway.processo.updateSuccess);

  // Usuário logado
  const accountQms = useAppSelector(state => state.authentication.accountQms);

  // Dados para filtros
  const setors = useAppSelector(state => state.all4qmsmsgateway.setor.entities);
  const usuarios = useAppSelector(state => state.all4qmsmsgateway.usuario.entities);

  const { ConfirmDialog, showDialog } = useConfirmDialog();

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

  // Recarregar lista quando houver sucesso na criação/edição
  useEffect(() => {
    if (updateSuccess) {
      getAllEntities();
    }
  }, [updateSuccess]);

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

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const clearFilters = () => {
    setFilters({
      numero: '',
      nome: '',
      descricao: '',
      setor: '',
      responsavel: '',
    });
  };

  const filteredProcessoList = processoList.filter(processo => {
    const numeroMatch = !filters.numero || processo.numero?.toLowerCase().includes(filters.numero.toLowerCase());

    const nomeMatch = !filters.nome || processo.nome?.toLowerCase().includes(filters.nome.toLowerCase());

    const descricaoMatch = !filters.descricao || processo.descricao?.toLowerCase().includes(filters.descricao.toLowerCase());

    const setorMatch = !filters.setor || processo.setor?.toLowerCase().includes(filters.setor.toLowerCase());

    const responsavelMatch = !filters.responsavel || processo.responsavel?.toLowerCase().includes(filters.responsavel.toLowerCase());

    return numeroMatch && nomeMatch && descricaoMatch && setorMatch && responsavelMatch;
  });

  const handleDelete = (id: number) => {
    showDialog({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja excluir este processo?',
      onConfirm: () => {
        dispatch(deleteEntity(id));
      },
    });
  };

  const handleOpenCreateModal = () => {
    setEditingProcesso(null);
    setFormData({ numero: '', nome: '', descricao: '', setor: '', responsavel: '' });
    setModalOpen(true);
  };

  const handleOpenEditModal = (processo: IProcesso) => {
    setEditingProcesso(processo);
    setFormData({
      numero: processo.numero || '',
      nome: processo.nome || '',
      descricao: processo.descricao || '',
      setor: processo.setor || '',
      responsavel: processo.responsavel || '',
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProcesso(null);
    setFormData({ numero: '', nome: '', descricao: '', setor: '', responsavel: '' });
  };

  const handleSave = () => {
    if (!formData.nome.trim()) {
      return; // Apenas nome é obrigatório
    }

    const processoData = {
      ...editingProcesso,
      numero: formData.numero.trim(),
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim(),
      setor: formData.setor.trim(),
      responsavel: formData.responsavel.trim(),
    };

    if (editingProcesso) {
      // Edição: mantém o criador original, atualiza apenas o atualizador
      processoData.atualizadoPor = accountQms as IUsuario;
    } else {
      // Criação: define tanto criador quanto atualizador
      processoData.criadoPor = accountQms as IUsuario;
      processoData.atualizadoPor = accountQms as IUsuario;
    }

    if (editingProcesso) {
      dispatch(updateEntity(processoData));
    } else {
      dispatch(createEntity(processoData));
    }

    handleCloseModal();
  };

  return (
    <>
      {loading ? (
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
              <Typography className="link">Processos</Typography>
            </Breadcrumbs>
            <h1 className="title">Processos</h1>
            <div style={{ paddingBottom: '30px' }}>
              <Button variant="contained" className="primary-button" style={{ marginRight: '10px' }} onClick={handleOpenCreateModal}>
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
                label="Número"
                value={filters.numero}
                onChange={e => setFilters({ ...filters, numero: e.target.value })}
                size="small"
                sx={{ minWidth: 150 }}
              />

              <TextField
                label="Nome"
                value={filters.nome}
                onChange={e => setFilters({ ...filters, nome: e.target.value })}
                size="small"
                sx={{ minWidth: 200 }}
              />

              <TextField
                label="Descrição"
                value={filters.descricao}
                onChange={e => setFilters({ ...filters, descricao: e.target.value })}
                size="small"
                sx={{ minWidth: 200 }}
              />

              <TextField
                label="Setor"
                value={filters.setor}
                onChange={e => setFilters({ ...filters, setor: e.target.value })}
                size="small"
                sx={{ minWidth: 150 }}
              />

              <TextField
                label="Responsável"
                value={filters.responsavel}
                onChange={e => setFilters({ ...filters, responsavel: e.target.value })}
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

            {/* Tabela */}
            {filteredProcessoList && filteredProcessoList.length > 0 ? (
              <TableContainer component={Paper} style={{ marginTop: '30px', boxShadow: 'none' }}>
                <Table sx={{ width: '100%' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Número</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Setor</TableCell>
                      <TableCell>Responsável</TableCell>
                      <TableCell>Criado por</TableCell>
                      <TableCell>Data criação</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProcessoList.map((processo, i) => (
                      <TableRow key={`entity-${i}`} data-cy="entityTable">
                        <TableCell>{processo.numero}</TableCell>
                        <TableCell>{processo.nome}</TableCell>
                        <TableCell>{processo.descricao}</TableCell>
                        <TableCell>{processo.setor}</TableCell>
                        <TableCell>{processo.responsavel}</TableCell>
                        <TableCell>
                          {processo.criadoPor ? (
                            <Chip
                              label={processo.criadoPor.nome}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ fontSize: '0.75rem', height: '20px' }}
                            />
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>{processo.criadoEm ? new Date(processo.criadoEm).toLocaleDateString('pt-BR') : '-'}</TableCell>
                        <TableCell align="center">
                          <IconButton color="primary" size="small" onClick={() => handleOpenEditModal(processo)} data-cy="entityEditButton">
                            <FontAwesomeIcon icon="pencil-alt" />
                          </IconButton>
                          <IconButton color="error" size="small" onClick={() => handleDelete(processo.id)} data-cy="entityDeleteButton">
                            <FontAwesomeIcon icon="trash" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Row className="justify-content-center mt-5">
                <span style={{ color: '#7d7d7d' }}>Nenhum processo encontrado.</span>
              </Row>
            )}

            {/* Paginação */}
            {totalItems ? (
              <div className={filteredProcessoList && filteredProcessoList.length > 0 ? '' : 'd-none'}>
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
            ) : null}
          </div>
        </div>
      )}
      {ConfirmDialog}

      {/* Modal de Criação/Edição */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>{editingProcesso ? 'Editar Processo' : 'Criar Processo'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Número"
              value={formData.numero}
              onChange={e => setFormData({ ...formData, numero: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Nome *"
              value={formData.nome}
              onChange={e => setFormData({ ...formData, nome: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Descrição"
              value={formData.descricao}
              onChange={e => setFormData({ ...formData, descricao: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Setor"
              value={formData.setor}
              onChange={e => setFormData({ ...formData, setor: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Responsável"
              value={formData.responsavel}
              onChange={e => setFormData({ ...formData, responsavel: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={!formData.nome.trim()}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Processo;
