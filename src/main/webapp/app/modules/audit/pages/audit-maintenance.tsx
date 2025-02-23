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
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { usePaginator } from 'app/shared/hooks/usePaginator';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-toastify';
import { getPaginatedAuditor, saveAuditor, updateAuditor } from '../audit-service';
import { queryClientAudit } from '..';
import { Auditor } from '../audit-models';
import { AuditorForm } from '../components/auditor-form';

const deleteResourceRequest = async (payload: Partial<Auditor>) => {
  try {
    const { data } = await axios.delete<Auditor>('/services/all4qmsmsauditplan/api/auditoria/auditores/' + payload.id);
    queryClientAudit.invalidateQueries({ queryKey: [`audit/auditor`] });
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

const columns = ['Auditor', 'E-mail', 'Ação'];

export const AuditMaintenance = () => {
  const { data: resourcesPage, isLoading: isLoadingResourcesPage } = useQuery({
    queryKey: [`audit/auditor`],
    queryFn: () => getPaginatedAuditor({ page, size: pageSize, ...(filtro ? { filtro } : {}) }),
    staleTime: 60000, // Dados ficam atualizados por 1 minuto,
  });

  const totaItens = useMemo(() => resourcesPage?.totalElements || 0, [resourcesPage?.totalElements]);

  const { page, pageSize, paginator } = usePaginator(totaItens);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [initialPayload, setInitialPayload] = useState(null);
  const [filtro] = useDebounce(search, 400);

  useEffect(() => {
    queryClientAudit.invalidateQueries({ queryKey: [`audit/auditor`] });
  }, [page, pageSize, filtro]);

  function onClose() {
    setOpen(false);
    setTimeout(() => {
      setInitialPayload(null);
    }, 200);
  }

  function onEdit(payload: Auditor) {
    setInitialPayload(payload);
    setOpen(true);
  }

  const whenSave = () => {
    queryClientAudit.invalidateQueries({ queryKey: [`audit/auditor`] }); // Invalida as queries para atualizar a lista de registros
    onClose();
    toast.success('Recurso salvo com sucesso');
  };

  const createMutation = useMutation({
    mutationFn: saveAuditor,
    onSuccess: whenSave,
    onError: errorOnSave,
  });

  const editMutation = useMutation({
    mutationFn: updateAuditor,
    onSuccess: whenSave,
    onError: errorOnSave,
  });

  function saveResource(payload: Auditor) {
    payload.id ? editMutation.mutate(payload) : createMutation.mutate(payload);
  }

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">Auditoria</Typography>
          <Typography className="link">Manutenção de Auditoria</Typography>
        </Breadcrumbs>
        <h1 className="title">Manutenção de Auditoria</h1>
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
              {resourcesPage?.content?.map((auditor: Auditor, index) => (
                <TableRow className="table-row" key={auditor.id}>
                  <TableCell>{auditor.nomeAuditor}</TableCell>
                  <TableCell>{auditor.emailAuditor}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <IconButton title="Editar" color="primary" onClick={_ => onEdit(auditor)}>
                        <EditIcon sx={{ color: '#e6b200' }} />
                      </IconButton>
                      <IconButton title="Excluir" color="primary" onClick={_ => deleteResourceRequest(auditor)}>
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
        <AuditorForm
          onClose={onClose}
          initialPayload={initialPayload}
          onSave={saveResource}
          pendingRequest={createMutation.isPending || editMutation.isPending}
        />
      </Dialog>
    </div>
  );
};
