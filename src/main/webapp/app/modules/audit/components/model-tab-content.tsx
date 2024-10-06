import { useNavigate } from 'react-router-dom';
import { Box, IconButton, MenuItem, Stack, TextField } from '@mui/material';
import { Button } from 'reactstrap';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { MaterialSelect } from 'app/shared/components/select/material-select';
import { TiposAuditoria } from 'app/shared/model/constants';
import { EnumTemporal } from 'app/modules/goals-objectives/models/enums';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getPaginatedModelos } from '../audit-service';
import { handleFilter } from '../audit-helper';
import { Row } from 'reactstrap';
import { usePaginator } from 'app/shared/hooks/usePaginator';
import { useEffect, useMemo } from 'react';
import { ModeloAuditoria } from '../audit-models';
import { Edit as EditIcon, Event as EventIcon } from '@mui/icons-material';
import { queryClientAudit } from '..';

export const ModelTabContent = () => {
  const navigate = useNavigate();

  const { control, register, reset, getValues } = useForm({
    defaultValues: {
      search: '',
      tipo: '',
      frequencia: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const filtro = useWatch({ control });

  const columns = ['Tipo de Auditoria', 'Frequência', 'Tipo', 'Ações'];

  const { data: modelList, isLoading: isLoadingmodelList } = useQuery({
    queryKey: ['model/list'],
    queryFn: () => getPaginatedModelos({ page, size: pageSize, ...handleFilter(getValues()) }),
    staleTime: 60000,
  });

  const totaItens = useMemo(() => modelList?.totalElements || 0, [modelList?.totalElements]);
  const { page, pageSize, paginator } = usePaginator(totaItens);

  useEffect(() => {
    queryClientAudit.invalidateQueries({ queryKey: ['model/list'] });
  }, [page, pageSize, filtro]);

  return (
    <div>
      <div style={{ paddingBottom: '30px', display: 'inline-flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          className="primary-button me-2 infodoc-list-form-field"
          style={{ marginRight: '10px', height: '58px', textTransform: 'uppercase' }}
          onClick={() => navigate('/audit/model/new')}
          title="Novo Modelo"
        >
          Novo Modelo
        </Button>

        <div style={{ flexGrow: 0.4, display: 'inline-flex' }}>
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

            <Controller
              name="frequencia"
              control={control}
              render={({ field }) => (
                <MaterialSelect variant="outlined" label="Frequencia" fullWidth {...field} sx={{ minWidth: '190px' }}>
                  {Object.values(EnumTemporal).map((value, idx) => (
                    <MenuItem key={idx} value={value}>
                      {value}
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
            {modelList?.content.map((model: ModeloAuditoria, index) => (
              <TableRow className="table-row" key={model.id}>
                <TableCell>{model.nomeAuditoria}</TableCell>
                <TableCell>{model.frequencia}</TableCell>
                <TableCell>{model.tipo}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconButton title="Editar" color="primary" onClick={() => navigate(`/audit/model/edit/${model.id}`)}>
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
