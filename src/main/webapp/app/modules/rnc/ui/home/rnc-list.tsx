/* eslint-disable no-console */
/* eslint-disable no-empty-pattern */
/* eslint-disable react/jsx-key */
import { Search } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Pagination,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { getUsers as getManagementUsers } from 'app/modules/administration/user-management/user-management.reducer';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Storage } from 'react-jhipster';
import { Link, useNavigate } from 'react-router-dom';
import { Row } from 'reactstrap';
import { Enums, ExtendedNc, Rnc } from '../../models';
import { reset as DescriptionResetEntity } from '../../reducers/description.reducer';
import { listEnums } from '../../reducers/enums.reducer';
import { listNonConformities } from '../../reducers/non-conformity.reducer';
import { list, listAprovacaoNC, reset } from '../../reducers/rnc.reducer';
import MenuOptions from '../components/table-menu/table-menu-options';
import './rnc.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const RncList = ({}) => {
  const navigate = useNavigate();
  const [dtIni, setdtIni] = useState(new Date());
  const [dtFim, setdtFim] = useState(new Date());
  const [value, setValue] = useState(0);
  const [userId, setUserId] = useState(Storage.session.get('ID_USUARIO'));
  const [userLogin, setUserLogin] = useState(Storage.session.get('LOGIN'));
  const [userRole, setUserRole] = useState(Storage.local.get('ROLE'));
  const [page, setPage] = useState<number>(1);

  const [filters, setFilters] = useState({
    dtIni: new Date(),
    dtFim: new Date(),
    statusAtual: '',
    processoNC: 0,
    tipoNC: '',
  });

  const handleApplyFilters = () => {
    const { dtIni, dtFim, statusAtual, processoNC, tipoNC } = filters;
    dispatch(
      list({
        page: 0,
        size: 20,
        dtIni: dtIni.toISOString(),
        dtFim: dtFim.toISOString(),
        statusAtual,
        processoNC,
        tipoNC,
      })
    );
    dispatch(
      listNonConformities({
        page: 0,
        size: 20,
        dtIni: dtIni.toISOString(),
        dtFim: dtFim.toISOString(),
        statusAtual,
        processoNC,
        tipoNC,
      })
    );
  };

  // Dispatcher
  const dispatch = useAppDispatch();

  // Reducer states
  const rncs: Array<Rnc> = useAppSelector(state => state.all4qmsmsgateway.rnc.entities);
  const totalCount: number = useAppSelector(state => state.all4qmsmsgateway.rnc.totalItems);
  const loading: boolean = useAppSelector(state => state.all4qmsmsgateway.rnc.loading);
  const nonConformities: Array<ExtendedNc> = useAppSelector(state => state.all4qmsmsgateway.nonConformities.entities);
  const nonConformitiesCount: number = useAppSelector(state => state.all4qmsmsgateway.nonConformities.totalItems);
  const loadingNonConformities: boolean = useAppSelector(state => state.all4qmsmsgateway.nonConformities.loading);
  const users = useAppSelector(state => state.all4qmsmsgateway.users.entities);
  const managementUsers = useAppSelector(state => state.userManagement.users);
  const enums = useAppSelector<Enums | null>(state => state.all4qmsmsgateway.enums.enums);

  useEffect(() => {
    dispatch(list({ page: 0, size: 20, dtIni: '', dtFim: '', statusAtual: '', processoNC: 0, tipoNC: '' }));
    dispatch(listNonConformities({ page: 0, size: 20, dtIni: '', dtFim: '', statusAtual: '', processoNC: 0, tipoNC: '' }));
    dispatch(getUsers({}));
    dispatch(listEnums());
    dispatch(getManagementUsers({ page: 0, size: 100, sort: 'ASC' }));
  }, []);

  useEffect(() => {
    dispatch(list({ page: page - 1, size: 20 }));
    dispatch(listNonConformities({ page: page - 1, size: 20 }));
  }, [page]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(listAprovacaoNC({}));
  }, [rncs]);

  const reloadInfo = () => {
    dispatch(reset());
    dispatch(DescriptionResetEntity());
    setTimeout(() => {
      dispatch(list({ page: 0, size: 20, dtIni: '', dtFim: '', statusAtual: '', processoNC: 0, tipoNC: '' }));
    }, 500);
  };

  const columns = [
    'Número',
    'Emissão',
    'Emissor',
    'Descrição',
    'Responsável',
    // 'Prazo',
    // 'Ações',
    'Verificação',
    'Eficácia',
    'Fechamento',
    'Status',
    '',
  ];

  const formatDateToString = (date: Date | null | undefined) => {
    if (!date) {
      return '';
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
  };

  const filterUser = (id: number) => {
    if (!users || users.length <= 0) {
      return null;
    }

    return users.find(user => user.id === id);
  };

  const onPageChanged = (event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  const renderTable = () => {
    if (loadingNonConformities) {
      return (
        <Row className="justify-content-center mt-5">
          <span style={{ color: '#7d7d7d' }}>Carregando...</span>
        </Row>
      );
    }

    if (nonConformities?.length > 0) {
      return (
        <>
          <TableContainer component={Paper} style={{ marginTop: '30px', boxShadow: 'none' }}>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  {columns.map(col => (
                    <TableCell align="left">{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {nonConformities?.map(rnc => {
                  const { nc, dados } = rnc;
                  const {
                    dtNC,
                    idEmissorNC,
                    idReceptorNC,
                    idUsuarioAtual,
                    origemNC,
                    possuiReincidencia,
                    processoEmissor,
                    processoNC,
                    statusAtual,
                    tipoNC,
                    acoesImediatas,
                    aprovacao,
                    aprovacaoNC,
                    atualizadoEm,
                    criadoEm,
                    decisaoNC,
                    id,
                    ncOutros,
                    numNC,
                    vinculoAuditoria,
                    vinculoCliente,
                    vinculoDocAnterior,
                    vinculoProduto,
                  } = nc;
                  const { descricao, eficacia, emissor, fechamento, idNc, responsavel, verificacao } = dados;

                  const emissorNc = filterUser(idEmissorNC);
                  const receptorNc = filterUser(idReceptorNC);
                  const usuarioAtual = filterUser(idUsuarioAtual);

                  return (
                    <TableRow key={id}>
                      <TableCell>{numNC}</TableCell>
                      <TableCell>{formatDateToString(new Date(criadoEm))}</TableCell>
                      <TableCell>{emissorNc?.nome || '-'}</TableCell>
                      <TableCell> {descricao ?? '-'}</TableCell>
                      <TableCell>{usuarioAtual?.nome || '-'}</TableCell>
                      {/* <TableCell> {aprovacao ? formatDateToString(new Date(aprovacao?.dataEficacia)) : '-'} </TableCell>
                      <TableCell> {aprovacao ? formatDateToString(new Date(rnc.aprovacao?.dataFechamento)) : '-'} </TableCell> */}
                      <TableCell> {formatDateToString(new Date(dtNC))} </TableCell>
                      <TableCell> {eficacia ? formatDateToString(new Date(eficacia)) : '-'} </TableCell>
                      <TableCell> {verificacao ? formatDateToString(new Date(verificacao)) : '-'} </TableCell>
                      <TableCell>{statusAtual}</TableCell>
                      <TableCell>
                        <MenuOptions rnc={nc} userId={userId} userRole={userRole} reload={reloadInfo} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Row className="justify-content-center mt-5">
            <Pagination
              count={Math.floor(nonConformitiesCount / 20) + (nonConformitiesCount % 20 > 0 ? 1 : 0)}
              onChange={onPageChanged}
              page={page}
              style={{ width: '370px' }}
            />
          </Row>
        </>
      );
    } else {
      return (
        <Row className="justify-content-center mt-5">
          <span style={{ color: '#7d7d7d' }}>Nenhum item encontrado.</span>
        </Row>
      );
    }
  };

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">RNC-OM</Typography>
        </Breadcrumbs>
        <h1 className="title">Lista RNC-OM</h1>
        <div style={{ paddingBottom: '30px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
          <Button
            variant="contained"
            className="primary-button me-2 rnc-list-form-field"
            style={{ height: '49px' }}
            onClick={() => navigate('/rnc/new')}
          >
            Novo Registro
          </Button>

          <FormControl className="me-2">
            <DatePicker
              selected={filters.dtIni}
              onChange={date => setFilters({ ...filters, dtIni: date })}
              dateFormat="dd/MM/yyyy"
              className="rnc-list-date-picker mt-4"
              locale="pt-BR"
              id="start-date-picker"
            />
            <label htmlFor="start-date-picker" className="rnc-list-date-label">
              Início
            </label>
          </FormControl>
          <FormControl className="me-2">
            <DatePicker
              selected={filters.dtFim}
              onChange={date => setFilters({ ...filters, dtFim: date })}
              dateFormat={'dd/MM/yyyy'}
              className="rnc-list-date-picker mt-4"
            />
            <label htmlFor="" className="rnc-list-date-label">
              Fim
            </label>
          </FormControl>
          <FormControl className="rnc-list-form-field me-2">
            <InputLabel>Status</InputLabel>
            <Select
              label="Selecione"
              name=""
              value={filters.statusAtual}
              onChange={event => setFilters({ ...filters, statusAtual: event.target.value as string })}
            >
              <MenuItem value="FINALIZADO">Finalizado</MenuItem>
              <MenuItem value="PREENCHIMENTO">Preenhimento</MenuItem>
              <MenuItem value="OUTRO">Outro</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="rnc-list-form-field me-2">
            <InputLabel>Processo</InputLabel>
            <Select
              label="Selecione"
              name=""
              value={filters.processoNC}
              onChange={event => setFilters({ ...filters, processoNC: parseInt(event.target.value as string, 10) })}
            >
              <MenuItem value={1}>Produção</MenuItem>
              <MenuItem value={2}>Outro</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="rnc-list-form-field me-2">
            <InputLabel>Tipo</InputLabel>
            <Select
              label="Selecione"
              name=""
              value={filters.tipoNC}
              onChange={event => setFilters({ ...filters, tipoNC: event.target.value })}
            >
              <MenuItem value="NC">NC</MenuItem>
              <MenuItem value="OM">OM</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            className="primary-button me-2 rnc-list-form-field"
            style={{ height: '49px' }}
            onClick={handleApplyFilters}
          >
            Aplicar Filtros
          </Button>
          <FormControl id="search-filter">
            <InputLabel htmlFor="outlined-adornment-search" className="mui-label-transform">
              Pesquisar
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-search"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" edge="end">
                    <Search />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Todos" {...a11yProps(0)} />
              <Tab label="Auditoria" {...a11yProps(1)} />
              <Tab label="Reclamação" {...a11yProps(2)} />
              <Tab label="Material" {...a11yProps(3)} />
              <Tab label="Produto" {...a11yProps(4)} />
              <Tab label="Procedimento" {...a11yProps(5)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            {renderTable()}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {renderTable()}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            {renderTable()}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            {renderTable()}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            {renderTable()}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            {renderTable()}
          </CustomTabPanel>
        </Box>
      </div>
    </div>
  );
};

export default RncList;
