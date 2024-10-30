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
import { getSwotAllFilter } from '../../reducers/swot.reducer';

// Registra a localidade
registerLocale('pt-BR', ptBR);

const columns = ['SWOT', 'Descrição', 'Habilitado', 'Status', 'Ações'];
enum StatusType {
  PENDENTE = 'PENDENTE',
  CONTROLADO = 'CONTROLADO',
  TRATATIVA = 'TRATATIVA',
}
enum EixoType {
  FORCAS = 'FORCAS',
  FRAQUEZAS = 'FRAQUEZAS',
  OPORTUNIDADES = 'OPORTUNIDADES',
  AMEACAS = 'AMEACAS',
}
type FilterSwotType = {
  isEnableRO?: string;
  status?: StatusType;
  eixo?: EixoType;
  pesquisa?: string;
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
  const [filters, setFilters] = useState<FilterSwotType>({ isEnableRO: '', pesquisa: '' });

  const swotList: Array<EixosSwot> = useAppSelector(state => state.all4qmsmsgatewayauditplan.swot.entities);
  const totalItems = useAppSelector(state => state.all4qmsmsgatewayauditplan.swot.totalItems);
  const { page, pageSize, paginator } = usePaginator(totalItems || 0);
  // const { page, pageSize, paginator } = usePaginator(0);

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

    dispatch(getSwotAllFilter({ size: pageSize, page: page }));
  }, []);

  useEffect(() => {
    handleApplyFilters();
  }, [filters, page, pageSize]);

  //---------------------------------------------------------------

  const handleApplyFilters = () => {
    if (!filters) getSwotAllFilter({ size: pageSize, page: page });

    const { isEnableRO, status, eixo, pesquisa } = filters;

    dispatch(
      getSwotAllFilter({
        eixo: eixo,
        habilitado: isEnableRO == 'Sim' ? true : isEnableRO == 'Não' ? false : undefined,
        status: status,
        pesquisa: pesquisa,
        size: pageSize,
        page: page,
      })
    );
  };

  const clearFilters = () => {
    setFilters({});
  };

  const renderTable = () => {
    if (swotList.length > 0) {
      return (
        <>
          <TableContainer component={Paper} style={{ marginTop: '30px', boxShadow: 'none' }}>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  {columns.map((col, indx) => (
                    <TableCell key={indx} align={col != 'Ações' ? 'left' : 'center'}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {swotList &&
                  swotList.map((swotItem: EixosSwot, index) => (
                    // <Tooltip title={goalResult.meta.metaObjetivo.desdobramentoSGQ}>
                    <TableRow className="table-row" key={index}>
                      <TableCell>{swotItem.eixo}</TableCell>
                      <TableCell>{swotItem.descricao}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Switch checked={swotItem.isAnalisar} />
                        </Box>
                      </TableCell>
                      <TableCell>{swotItem.status}</TableCell>
                      <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                        {isSGQ && (
                          <IconButton
                            title="Criar Risco e Oportunidade"
                            color="primary"
                            onClick={() => navigate('/risks-opportunities/risk', { state: { from: 'strategic-planning', data: swotItem } })}
                          >
                            <EditNoteIcon sx={{ color: '#e6b200' }} />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
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
                onChange={e => setFilters({ ...filters, status: e.target.value.toString() as StatusType })}
                label="Status"
              >
                <MenuItem value={''}>Selecionar</MenuItem>
                {['PENDENTE', 'CONTROLADO', 'TRATATIVA']?.map((status, index) => (
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
                onChange={e => setFilters({ ...filters, eixo: e.target.value.toString() as EixoType })}
                label="Eixo"
              >
                <MenuItem value={''}>Selecionar</MenuItem>
                {['FORCAS', 'FRAQUEZAS', 'OPORTUNIDADES', 'AMEACAS']?.map((status, index) => (
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
              <OutlinedInput
                fullWidth
                label="Pesquisa"
                onChange={e => setFilters({ ...filters, pesquisa: e.target.value.toString() })}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleApplyFilters} onMouseDown={() => null}>
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
