import {
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
import { useQuery } from '@tanstack/react-query';
import { usePaginator } from 'app/shared/hooks/usePaginator';
import { TiposAuditoria } from 'app/shared/model/constants';
import { MaterialSelect } from 'app/shared/components/select/material-select';
import { getPaginatedAgendamento, getPaginatedPlanejamento } from '../audit-service';
import { handleFilter, renderValueCronograma } from '../audit-helper';
import { AgendamentoAuditoria, CronogramaAuditoria, PlanejamentoAuditoria } from '../audit-models';
import { Edit as EditIcon, Event as EventIcon } from '@mui/icons-material';
import { capitalize } from 'lodash';

const columns = ['Data', 'Tipo de Auditoria', 'RNC', 'ROM', 'Início', 'Término', 'Ações'];

export const AuditorshipTabContent = () => {
  const navigate = useNavigate();

  const { data: schedules, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ['schedule/list'],
    queryFn: () => getPaginatedAgendamento({ page, size: pageSize, finalizado: false, ...handleFilter(getValues()) }),
    staleTime: 60000, // Dados ficam atualizados por 1 minuto,
  });

  const totaItens = useMemo(() => schedules?.totalElements || 0, [schedules?.totalElements]);

  const { page, pageSize, paginator } = usePaginator(totaItens);

  const { control, register, getValues, reset } = useForm({
    defaultValues: {
      search: '',
      tipo: '',
      finalizado: false,
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const form = useWatch({ control });
  const [filtro] = useDebounce(form, 400);

  useEffect(() => {
    queryClientAudit.invalidateQueries({ queryKey: ['schedule/list'] });
  }, [page, pageSize, filtro]);

  return (
    <div>
      <div
        style={{
          paddingBottom: '30px',
          display: 'inline-flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
        }}
      >
        <Stack gap="12px" flexDirection="row" sx={{ flexGrow: 0.4, display: 'inline-flex' }}>
          <Controller
            name="tipo"
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
            {schedules?.content.map((schedule, index) => (
              <TableRow
                className="table-row"
                key={schedule.id}
                sx={schedule.isReagendado ? { opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed', height: '57px' } : {}}
              >
                <TableCell>{schedule.dataAuditoria.toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{schedule?.planejamento?.cronograma?.modelo?.tipo}</TableCell>
                <TableCell>{schedule.ncsNumber}</TableCell>
                <TableCell>{schedule.omsNumber}</TableCell>
                <TableCell>{schedule.horaInicial.toLocaleTimeString('pt-BR')}</TableCell>
                <TableCell>{schedule.horaFinal.toLocaleTimeString('pt-BR')}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                    {schedule.isReagendado ? (
                      '[REAGENDADO]'
                    ) : (
                      <IconButton
                        title="Editar"
                        color="primary"
                        onClick={() =>
                          navigate(
                            schedule?.isFinalizado
                              ? `/audit/auditorship/edit/${schedule.id}`
                              : `/audit/planning/${schedule?.planejamento?.id}/schedule?idSchedule=${schedule?.id}`
                          )
                        }
                      >
                        <EditIcon sx={{ color: '#e6b200' }} />
                      </IconButton>
                    )}
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
