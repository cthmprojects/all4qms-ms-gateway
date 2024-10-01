import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { usePaginator } from 'app/shared/hooks/usePaginator';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Table } from 'reactstrap';
import { getPaginatedCronograma } from '../audit-service';
import { forwardRef, useEffect, useMemo } from 'react';
import { queryClientAudit } from '..';
import { MaterialSelect } from 'app/shared/components/select/material-select';
import { TiposAuditoria } from 'app/shared/model/constants';
import { CronogramaAuditoria } from '../audit-models';
import { Edit as EditIcon } from '@mui/icons-material';
import { EnumStatusAuditoria } from 'app/shared/model/enumerations/enum-status-auditoria';

import DatePicker from 'react-datepicker';
import { partesLabel, renderValueModelo } from '../audit-helper';

const columns = ['Modelo de auditoria', 'Data', 'Parte', 'Status', 'Ações'];

const Custom = forwardRef(({ children, onClick }: any, ref) => (
  <Box onClick={onClick} ref={ref}>
    {children}
  </Box>
));

export const TimelineTabContent = () => {
  const navigate = useNavigate();

  const { data: timelineList, isLoading: isLoadingtimelineList } = useQuery({
    queryKey: ['timeline/list'],
    queryFn: () => getPaginatedCronograma({ page, size: pageSize, ...(false ? {} : {}) }),
    staleTime: 60000, // Dados ficam atualizados por 1 minuto,
  });

  const totaItens = useMemo(() => timelineList?.totalElements || 0, [timelineList?.totalElements]);

  const { page, pageSize, paginator } = usePaginator(totaItens);

  useEffect(() => {
    queryClientAudit.invalidateQueries({ queryKey: ['timeline/list'] });
  }, [page, pageSize]);

  return (
    <div>
      <div style={{ paddingBottom: '30px', display: 'inline-flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          className="primary-button infodoc-list-form-field"
          style={{ marginRight: '10px', height: '58px' }}
          onClick={() => navigate('/audit/timeline/new')}
          title="Novo Registro"
        >
          Novo Cronograma
        </Button>

        <Stack gap="12px" flexDirection="row" sx={{ flexGrow: 0.4, display: 'inline-flex' }}>
          <MaterialSelect onChange={null} label="Tipo de auditoria" fullWidth sx={{ minWidth: '190px' }}>
            {TiposAuditoria.map(item => (
              <MenuItem key={item.name} value={item.value}>
                {item.name}
              </MenuItem>
            ))}
          </MaterialSelect>

          <MaterialSelect variant="outlined" label="Status" fullWidth sx={{ minWidth: '190px' }}>
            {Object.values(EnumStatusAuditoria).map((value, idx) => (
              <MenuItem key={idx} value={value}>
                {value}
              </MenuItem>
            ))}
          </MaterialSelect>

          <TextField label="Pesquisa" style={{ minWidth: '16vw' }} onChange={null} placeholder="Descrição" value={null} />

          <Button
            variant="contained"
            className="secondary-button rnc-list-form-field"
            style={{ height: '49px' }}
            onClick={null}
            title="Pesquisar"
          >
            Pesquisar
          </Button>
        </Stack>
      </div>

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
            {timelineList?.content.map((timeline: CronogramaAuditoria, index) => (
              <TableRow className="table-row" key={timeline.id}>
                <TableCell>{renderValueModelo(timeline.modelo)}</TableCell>

                <TableCell>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    startDate={timeline.periodoInicial}
                    maxDate={timeline.periodoFinal}
                    minDate={timeline.periodoInicial}
                    endDate={timeline.periodoFinal}
                    selectsRange={true}
                    locale="pt-BR"
                    selected={null}
                    popperClassName="onlyView"
                    filterDate={date => {
                      return date >= timeline.periodoInicial && date <= timeline.periodoFinal;
                    }}
                    onChange={() => {}}
                    customInput={
                      <Custom>
                        {timeline.periodoInicial.toLocaleDateString('pt-BR')} até {timeline.periodoFinal.toLocaleDateString('pt-BR')}
                      </Custom>
                    }
                  />
                </TableCell>
                <TableCell>{partesLabel(timeline.parte)}</TableCell>
                <TableCell>{timeline.status}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconButton title="Editar" color="primary" onClick={() => navigate(`/audit/timeline/edit/${timeline.id}`)}>
                      <EditIcon sx={{ color: '#e6b200' }} />
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
