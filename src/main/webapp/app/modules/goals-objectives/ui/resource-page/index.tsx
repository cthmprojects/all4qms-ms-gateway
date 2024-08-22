import {
  Box,
  Breadcrumbs,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  TextField,
  Button,
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MetaRecurso } from '../../models/goals';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { usePaginator } from 'app/shared/hooks/usePaginator';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-toastify';
import { editResourceRequest, getPaginatedResources, saveResourceRequest } from '../../goal-resource.service';
import { ResourceForm } from '../components/ResourceForm';

const deleteResourceRequest = async (payload: Partial<MetaRecurso>) => {
  try {
    const { data } = await axios.delete<MetaRecurso>('/services/all4qmsmsmetaind/api/metaobj/recursos/' + payload.id);
    queryClient.invalidateQueries({ queryKey: ['meta/resources/page'] });
    toast.success('Recurso excluído com sucesso');
    return data;
  } catch (error) {
    toast.error('Erro ao excluir recurso');
    toast.error('Tente novamente');
  }
};

const errorOnSave = () => {
  toast.error('Erro ao salvar recurso');
  toast.error('Tente novamente');
};

const queryClient = new QueryClient();

const columns = ['Item', 'Recurso', 'Ação'];

export const ResourcePage = () => {
  const { data: resourcesPage, isLoading: isLoadingResourcesPage } = useQuery(
    {
      queryKey: [`meta/resources/page`],
      queryFn: () => getPaginatedResources({ page, size: pageSize, ...(filtro ? { filtro } : {}) }),
      staleTime: 60000, // Dados ficam atualizados por 1 minuto,
    },
    queryClient
  );

  const totaItens = useMemo(() => resourcesPage?.totalElements || 0, [resourcesPage?.totalElements]);

  const { page, pageSize, paginator } = usePaginator(totaItens);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [initialPayload, setInitialPayload] = useState(null);
  const [filtro] = useDebounce(search, 400);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['meta/resources/page'] });
  }, [page, pageSize, filtro]);

  function onClose() {
    setOpen(false);
    setTimeout(() => {
      setInitialPayload(null);
    }, 200);
  }

  function onEdit(payload: MetaRecurso) {
    setInitialPayload(payload);
    setOpen(true);
  }

  const whenSave = () => {
    queryClient.invalidateQueries({ queryKey: [`meta/resources/page`] }); // Invalida as queries para atualizar a lista de registros
    onClose();
    toast.success('Recurso salvo com sucesso');
  };

  const createMutation = useMutation(
    {
      mutationFn: saveResourceRequest,
      onSuccess: whenSave,
      onError: errorOnSave,
    },
    queryClient
  );

  const editMutation = useMutation(
    {
      mutationFn: editResourceRequest,
      onSuccess: whenSave,
      onError: errorOnSave,
    },
    queryClient
  );

  function saveResource(payload: Partial<MetaRecurso>) {
    payload.id ? editMutation.mutate(payload) : createMutation.mutate(payload);
  }

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Link to={'/goals'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Metas e Objetivos
          </Link>
          <Typography className="link">Cadastro de Recursos</Typography>
        </Breadcrumbs>
        <h1 className="title">Cadastro de Recursos</h1>
        <Box display="flex" justifyContent="space-between" marginY="24px">
          <Button
            variant="contained"
            className="primary-button"
            style={{ marginRight: '10px', height: '54px', width: '150px', fontSize: 'initial' }}
            onClick={_ => setOpen(true)}
            title="Novo Registro"
          >
            Novo
          </Button>

          <TextField value={search} onChange={_ => setSearch(_.target.value)} label="pesquisar" sx={{ width: '20rem' }} variant="filled" />
        </Box>

        <TableContainer component={Paper} style={{ marginTop: '30px', boxShadow: 'none' }}>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                {columns.map(col => (
                  // eslint-disable-next-line react/jsx-key
                  <TableCell align={col != 'Ações' ? 'left' : 'center'}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {resourcesPage?.content?.map((resource: MetaRecurso, index) => (
                <TableRow className="table-row" key={resource.id}>
                  <TableCell>{resource.id}</TableCell>
                  <TableCell>{resource.recursoNome}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <IconButton title="Editar" color="primary" onClick={_ => onEdit(resource)}>
                        <EditIcon sx={{ color: '#e6b200' }} />
                      </IconButton>
                      <IconButton title="Excluir" color="primary" onClick={_ => deleteResourceRequest(resource)}>
                        <DeleteIcon sx={{ color: '#A23900' }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {paginator}
      </div>

      <Dialog open={open} onClose={onClose}>
        <ResourceForm
          onClose={onClose}
          initialPayload={initialPayload}
          onSave={saveResource}
          pendingRequest={createMutation.isPending || editMutation.isPending}
        />
      </Dialog>
    </div>
  );
};
