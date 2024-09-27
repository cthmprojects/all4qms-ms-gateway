import React from 'react';
import {
  Breadcrumbs,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  Box,
  Tooltip,
  Grid,
  InputAdornment,
  OutlinedInput,
  Switch,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';

import { Storage } from 'react-jhipster';
import { usePaginator } from 'app/shared/hooks/usePaginator';
import { EixosSwot, SwotList } from '../../models/swot';

// Registra a localidade
registerLocale('pt-BR', ptBR);

const columns = ['SWOT', 'Descrição', 'Habilitado', 'Status', 'Ações'];

type FilterSwotType = {
  isEnableRO?: string;
  status?: string;
  eixo?: string;
};
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userLoginID = parseInt(Storage.session.get('ID_USUARIO'));
  // const [usersSGQ, setUsersSGQ] = useState<[]>([]);
  const [isSGQ, setIsSGQ] = useState<Boolean>(false);
  // const [swotList, setSwotList] = useState<SwotList[]>([]);
  /**
   * Filters
   */
  const [filters, setFilters] = useState<FilterSwotType>({ isEnableRO: '', status: '', eixo: '' });

  // const { page, pageSize, paginator } = usePaginator(metasLista.totalElements);
  const { page, pageSize, paginator } = usePaginator(0);

  const swotList: Array<EixosSwot> = useAppSelector(state => state.all4qmsmsgatewayauditplan.swot.entities);

  useEffect(() => {
    if (page <= 0) {
      return;
    }

    handleApplyFilters();
  }, [page]);

  useEffect(() => {
    const roles = Storage.local.get('ROLE');
    const isSGQ = ['ROLE_ADMIN', 'ROLE_SGQ'].some(item => roles.includes(item));
    setIsSGQ(isSGQ);
  }, []);

  useEffect(() => {
    handleApplyFilters();
  }, [filters, page, pageSize]);

  //---------------------------------------------------------------

  const handleApplyFilters = () => {
    const { isEnableRO, status, eixo } = filters;

    // !processes && dispatch(getProcesses());

    //   dispatch(
    //     getAllMetasFilter({
    //       idProcesso: idProcesso || processes[0]?.id,
    //       ano: ano instanceof Date ? ano.getFullYear().toString() : ano,
    //       mes: mes instanceof Date ? format(mes, 'MM') : mes,
    //       situacao: situacao,
    //       pesquisa: pesquisa,
    //       size: pageSize,
    //       page: page,
    //     })
    //   );
  };

  const clearFilters = () => {
    setFilters({ isEnableRO: '', status: '', eixo: '' });
  };

  const renderTable = () => {
    if (swotList.length > 0) {
      return (
        <>
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
                {swotList &&
                  swotList.map((swotItem: EixosSwot, index) => (
                    // <Tooltip title={goalResult.meta.metaObjetivo.desdobramentoSGQ}>
                    <Tooltip title={''}>
                      <TableRow className="table-row" key={index}>
                        <TableCell onClick={event => null}>{swotItem.eixo}</TableCell>
                        <TableCell onClick={event => null}>{swotItem.descricao}</TableCell>
                        <TableCell onClick={event => null}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Switch checked={swotItem.isAnalisar} />
                          </Box>
                        </TableCell>
                        <TableCell onClick={event => null}>{swotItem.status}</TableCell>
                        <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                          {isSGQ && (
                            <IconButton
                              title="Editar"
                              color="primary"
                              // onClick={() => navigate(`/goals/edit/${swotItem.idMeta}`, { state: swotItem })}
                            >
                              <EditNoteIcon sx={{ color: '#e6b200' }} />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    </Tooltip>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Row className="justify-content-center mt-5" style={{ flex: 1 }}>
            {/* <Pagination count={10} style={{ width: '370px' }} /> */}
            {paginator}
          </Row>
        </>
      );
    } else {
      return (
        <>
          <Row className="justify-content-center mt-5">
            <span style={{ color: '#7d7d7d' }}>Nenhum item encontrado.</span>
          </Row>
          <Row className="justify-content-center mt-5" style={{ flex: 1 }}>
            {/* <Pagination count={10} style={{ width: '370px' }} /> */}
            {paginator}
          </Row>
        </>
      );
    }
  };

  return (
    //////////////////////////////////////
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">Planejamento Estratégico</Typography>
        </Breadcrumbs>
        <h1 className="title">Planejamento Estratégico</h1>

        <Grid container gap={1}>
          <Button
            variant="contained"
            className="infodoc-list-form-field"
            style={{ marginRight: '10px', height: '54px', width: '100px', backgroundColor: isSGQ ? '#e6b200' : '#a3a3a3' }}
            onClick={event => navigate(`/strategic-planning/swot`)}
            title="Novo Registro"
            disabled={!isSGQ}
          >
            SWOT
          </Button>
          <Button
            variant="outlined"
            className="infodoc-list-form-field"
            style={{ marginRight: '10px', height: '54px', width: '100px' }}
            onClick={event => navigate(`/strategic-planning/institutional`)}
            title="Novo Registro"
            disabled={!isSGQ}
          >
            INSTITUCIONAL
          </Button>
          <Grid item xs={1.5}>
            <FormControl fullWidth>
              <InputLabel>Habilitado para RO</InputLabel>
              <Select
                sx={{ height: '56px' }}
                value={filters.isEnableRO}
                onChange={e => setFilters({ ...filters, isEnableRO: e.target.value.toString() })}
                label="Habilitado para RO"
              >
                <MenuItem value={''}>Selecionar</MenuItem>
                {['Sim', 'Não']?.map((isRO, index) => (
                  <MenuItem key={index} value={isRO}>
                    {isRO}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={1.5}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                sx={{ height: '56px' }}
                value={filters.status}
                onChange={e => setFilters({ ...filters, status: e.target.value.toString() })}
                label="Status"
              >
                <MenuItem value={''}>Selecionar</MenuItem>
                {['PENDENTE', 'CONTROLADO', 'EMTRATATIVA']?.map((status, index) => (
                  <MenuItem key={index} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={1.5}>
            <FormControl fullWidth>
              <InputLabel>Eixo</InputLabel>
              <Select
                sx={{ height: '56px' }}
                value={filters.eixo}
                onChange={e => setFilters({ ...filters, eixo: e.target.value.toString() })}
                label="Eixo"
              >
                <MenuItem value={''}>Selecionar</MenuItem>
                {['FORCA', 'FRAQUEZA', 'OPORTUNIDADE', 'AMEACA']?.map((status, index) => (
                  <MenuItem key={index} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <InputLabel>Pesquisa</InputLabel>
              {/* <TextField
                    label="Pesquisa"
                    style={{ minWidth: '20vw'  }}
                    onChange={event => {
                    setFilters({ ...filters, pesquisa: event?.target?.value || '' });
                    }}
                    placeholder="Descrição"
                    value={filters.pesquisa || ''}
                /> */}
              <OutlinedInput
                fullWidth
                label="Pesquisa"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={() => null} onMouseDown={() => null}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>

          <Button
            variant="contained"
            className="secondary-button rnc-list-form-field"
            style={{ height: '54px', width: '60px', marginLeft: '7px' }}
            onClick={clearFilters}
            title="Limpar"
          >
            Limpar
          </Button>
        </Grid>

        <Box sx={{ width: '100%' }}>{renderTable()}</Box>
      </div>
    </div>
  );
};

export default Home;
