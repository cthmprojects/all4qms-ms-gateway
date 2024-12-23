import {
  Alert,
  Box,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Table } from 'reactstrap';
import { useDebounce } from 'use-debounce';
import { queryClientAudit } from '..';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePaginator } from 'app/shared/hooks/usePaginator';
import { TiposAuditoria } from 'app/shared/model/constants';
import { MaterialSelect } from 'app/shared/components/select/material-select';
import { getPaginatedAuditor, getPaginatedPlanejamento } from '../audit-service';
import { handleFilter, renderValueCronograma } from '../audit-helper';
import { CronogramaAuditoria, PlanejamentoAuditoria } from '../audit-models';
import { Edit as EditIcon, Event as EventIcon } from '@mui/icons-material';
import { capitalize } from 'lodash';

const columns = ['ID', 'Tipo de Auditoria', 'Cronograma', 'Escopo', 'Ações'];

export const PlanningTabContent = () => {
  const navigate = useNavigate();

  const { data: plannings, isLoading: isLoadingtimelineList } = useQuery({
    queryKey: ['plannings/list'],
    queryFn: () => getPaginatedPlanejamento({ page, size: pageSize, ...handleFilter(getValues()) }),
    staleTime: 60000, // Dados ficam atualizados por 1 minuto,
  });

  const totaItens = useMemo(() => plannings?.totalElements || 0, [plannings?.totalElements]);

  const { page, pageSize, paginator } = usePaginator(totaItens);

  const { control, register, getValues, reset } = useForm({
    defaultValues: {
      search: '',
      tipoAuditoria: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const form = useWatch({ control });
  const [filtro] = useDebounce(form, 400);

  useEffect(() => {
    queryClientAudit.invalidateQueries({ queryKey: ['plannings/list'] });
  }, [page, pageSize, filtro]);

  const {
    data: auditors,
    mutate: getAuditors,
    isPending,
  } = useMutation({
    mutationFn: () => getPaginatedAuditor({}),
  });

  useEffect(() => {
    getAuditors;
  }, []);

  if (!isPending && auditors?.empty) {
    return (
      <Box display="flex" rowGap="20px" flexDirection="column">
        <Alert severity="info">Para acessar essa aba primeiro é necessário cadastrar auditores no botão abaixo</Alert>
        <Button
          variant="contained"
          className="primary-button infodoc-list-form-field"
          style={{ marginRight: '10px', height: '58px' }}
          onClick={() => navigate('/audit/maintenance')}
          title="Auditores"
        >
          Auditores
        </Button>
      </Box>
    );
  }

  return (
    <div>
      <div
        style={{
          paddingBottom: '30px',
          display: 'inline-flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="contained"
          className="primary-button infodoc-list-form-field"
          style={{ marginRight: '10px', height: '58px' }}
          onClick={() => navigate('/audit/planning/new')}
          title="Novo Registro"
        >
          Novo Planejamento
        </Button>

        <Stack gap="12px" flexDirection="row" sx={{ flexGrow: 0.4, display: 'inline-flex' }}>
          <Controller
            name="tipoAuditoria"
            control={control}
            render={({ field }) => (
              <MaterialSelect onChange={null} label="Tipo de auditoria" fullWidth {...field} sx={{ minWidth: '190px' }}>
                {TiposAuditoria.map(item => (
                  <MenuItem key={item.name} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </MaterialSelect>
            )}
          />

          <TextField label="Pesquisa" style={{ minWidth: '16vw' }} placeholder="Descrição" {...register('search')} />

          <Button
            variant="contained"
            className="secondary-button rnc-list-form-field"
            style={{ height: '49px' }}
            onClick={() => reset()}
            title="Pesquisar"
          >
            LIMPAR
          </Button>
        </Stack>
      </div>

      <TableContainer component={Paper} style={{ marginTop: '30px', boxShadow: 'none' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                // eslint-disable-next-line react/jsx-key
                <TableCell key={col} align={col != 'Ações' ? 'left' : 'center'}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {plannings?.content.map((planning: PlanejamentoAuditoria, index) => (
              <TableRow className="table-row" key={planning.id}>
                <TableCell>{planning.id}</TableCell>
                <TableCell>{capitalize(planning.cronograma.modelo.tipo)}</TableCell>
                <TableCell>{renderValueCronograma(planning.cronograma as CronogramaAuditoria)}</TableCell>
                <TableCell>{planning.escopo}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                    <IconButton title="Editar" color="primary" onClick={() => navigate(`/audit/planning/edit/${planning.id}`)}>
                      <EditIcon sx={{ color: '#e6b200' }} />
                    </IconButton>
                    <IconButton title="Agendar" color="primary" onClick={() => navigate(`/audit/planning/${planning.id}/schedule`)}>
                      <EventIcon sx={{ color: '#0EBDCE' }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Row className="justify-content-center mt-5" style={{ flex: 1 }}>
        {paginator}
      </Row>
    </div>
  );
};
