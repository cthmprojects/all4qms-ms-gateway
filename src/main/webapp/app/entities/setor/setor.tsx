import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row } from 'reactstrap';
import { getSortState, JhiPagination } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { ISetor } from 'app/shared/model/setor.model';
import { IUsuario } from 'app/shared/model/usuario.model';
import { getEntities, deleteEntity, createEntity, updateEntity } from './setor.reducer';

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
} from '@mui/material';
import { useConfirmDialog } from 'app/shared/hooks/useConfirmDialog';

export const Setor = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  // Estados para filtros
  const [filters, setFilters] = useState({
    nome: '',
    descricao: '',
  });

  // Estados para modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSetor, setEditingSetor] = useState<ISetor | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });

  const setorList = useAppSelector(state => state.all4qmsmsgateway.setor.entities);
  const loading = useAppSelector(state => state.all4qmsmsgateway.setor.loading);
  const totalItems = useAppSelector(state => state.all4qmsmsgateway.setor.totalItems);
  const updateSuccess = useAppSelector(state => state.all4qmsmsgateway.setor.updateSuccess);

  // Usuário logado
  const accountQms = useAppSelector(state => state.authentication.accountQms);

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

  const clearFilters = () => {
    setFilters({
      nome: '',
      descricao: '',
    });
  };

  const filteredSetorList = setorList.filter(setor => {
    const nomeMatch = !filters.nome || setor.nome?.toLowerCase().includes(filters.nome.toLowerCase());

    const descricaoMatch = !filters.descricao || setor.descricao?.toLowerCase().includes(filters.descricao.toLowerCase());

    return nomeMatch && descricaoMatch;
  });

  const handleDelete = (id: number) => {
    showDialog({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja excluir este setor?',
      onConfirm: () => {
        dispatch(deleteEntity(id));
      },
    });
  };

  const handleOpenCreateModal = () => {
    setEditingSetor(null);
    setFormData({ nome: '', descricao: '' });
    setModalOpen(true);
  };

  const handleOpenEditModal = (setor: ISetor) => {
    setEditingSetor(setor);
    setFormData({
      nome: setor.nome || '',
      descricao: setor.descricao || '',
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingSetor(null);
    setFormData({ nome: '', descricao: '' });
  };

  const handleSave = () => {
    if (!formData.nome.trim()) {
      return; // Nome é obrigatório
    }

    const setorData = {
      ...editingSetor,
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim(),
    };

    if (editingSetor) {
      // Edição: mantém o criador original, atualiza apenas o atualizador
      setorData.atualizadoPor = accountQms as IUsuario;
    } else {
      // Criação: define tanto criador quanto atualizador
      setorData.criadoPor = accountQms as IUsuario;
      setorData.atualizadoPor = accountQms as IUsuario;
    }

    if (editingSetor) {
      dispatch(updateEntity(setorData));
    } else {
      dispatch(createEntity(setorData));
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
              <Typography className="link">Setores</Typography>
            </Breadcrumbs>
            <h1 className="title">Setores</h1>
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
            {filteredSetorList && filteredSetorList.length > 0 ? (
              <TableContainer component={Paper} style={{ marginTop: '30px', boxShadow: 'none' }}>
                <Table sx={{ width: '100%' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Criado por</TableCell>
                      <TableCell>Data criação</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSetorList.map((setor, i) => (
                      <TableRow key={`entity-${i}`} data-cy="entityTable">
                        <TableCell>{setor.nome}</TableCell>
                        <TableCell>{setor.descricao}</TableCell>
                        <TableCell>
                          {setor.criadoPor ? (
                            <Chip
                              label={setor.criadoPor.nome}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ fontSize: '0.75rem', height: '20px' }}
                            />
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>{setor.criadoEm ? new Date(setor.criadoEm).toLocaleDateString('pt-BR') : '-'}</TableCell>
                        <TableCell align="center">
                          <IconButton color="primary" size="small" onClick={() => handleOpenEditModal(setor)} data-cy="entityEditButton">
                            <FontAwesomeIcon icon="pencil-alt" />
                          </IconButton>
                          <IconButton color="error" size="small" onClick={() => handleDelete(setor.id)} data-cy="entityDeleteButton">
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
                <span style={{ color: '#7d7d7d' }}>Nenhum setor encontrado.</span>
              </Row>
            )}

            {/* Paginação */}
            {totalItems ? (
              <div className={filteredSetorList && filteredSetorList.length > 0 ? '' : 'd-none'}>
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
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSetor ? 'Editar Setor' : 'Criar Setor'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
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

export default Setor;
