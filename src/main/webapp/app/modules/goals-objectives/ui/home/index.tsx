/* eslint-disable radix */
/* eslint-disable no-console */
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
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import './metas.css';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

import { Storage } from 'react-jhipster';

import axios, { AxiosResponse } from 'axios';
import { Process } from 'app/modules/rnc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { ListMeta, Meta, MetaResultado } from '../../models/goals';
import { EnumSituacao } from '../../models/enums';
import { getAllMetasFilter, ListMetasInterface, ListPaginationMeta } from '../../reducers/metas-list.reducer';
import { usePaginator } from 'app/shared/hooks/usePaginator';
import { MaterialDatepicker } from 'app/shared/components/input/material-datepicker';

// Registra a localidade
registerLocale('pt-BR', ptBR);

const initialFilter = {
  idProcesso: '' as unknown as number,
  ano: '',
  mes: '',
  situacao: '',
  pesquisa: '',
};

const HomeGoalsList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const processes = useAppSelector<Array<Process>>(state => state.all4qmsmsgatewayrnc.process.entities);
  const metasLista: ListPaginationMeta = useAppSelector<ListPaginationMeta>(state => state.all4qmsmsmetaind.metasLista.entity);

  const [startDate, setStartDate] = useState(new Date());
  const userLoginID = parseInt(Storage.session.get('ID_USUARIO'));
  // const [usersSGQ, setUsersSGQ] = useState<[]>([]);
  const [isSGQ, setIsSGQ] = useState<Boolean>(false);
  const [goalsList, setGoalsList] = useState<ListMeta[]>([]);
  /**
   * Filters
   */
  const [filters, setFilters] = useState<ListMetasInterface>(initialFilter);

  const { page, pageSize, paginator } = usePaginator(metasLista.totalElements);

  useEffect(() => {
    if (page <= 0) {
      return;
    }

    handleApplyFilters();
  }, [page]);

  // const getUsersSGQ = async () => {
  //   const resUsers = await dispatch(getUsersAsAdminSGQ('ROLE_SGQ'));
  //   const users_ = (resUsers.payload as AxiosResponse).data || [];

  //   const filteredUser = users.filter(user => users_.some(firstUser => firstUser.id === user.user.id));
  //   setUsersSGQ(filteredUser);
  // };

  // const enums: Enums = useAppSelector<Enums>(state => state.all4qmsmsgatewayro.enums.entity);

  const fetchMetasAllFilter = async () => {
    const resMetasContent = await dispatch(getAllMetasFilter({}));
    const listMetasRes: ListPaginationMeta = (resMetasContent.payload as AxiosResponse).data || {};
    setGoalsList(listMetasRes.content);
  };

  useEffect(() => {
    dispatch(getProcesses());
    // dispatch(getUsers({}));
    dispatch(getAllMetasFilter({}));
    // fetchMetasAllFilter();

    const roles = Storage.local.get('ROLE');
    const isSGQ = ['ROLE_ADMIN', 'ROLE_SGQ'].some(item => roles.includes(item));
    setIsSGQ(isSGQ);
  }, []);

  useEffect(() => {
    handleApplyFilters();
  }, [filters, page, pageSize]);

  //---------------------------------------------------------------

  const columns = ['Metas', 'Resultados', 'Situação', 'Atualização', 'Ações'];
  const getSituacaoIcon = (parcial, metaAtingida) => {
    if (parcial && metaAtingida) return { icon: <CheckIcon color="success" />, text: 'Meta Atingida' };
    if (parcial || metaAtingida) return { icon: <TaskAltIcon color="success" />, text: 'Meta Parcial' };
    else return { icon: <CancelOutlinedIcon color="error" />, text: 'Meta Não Atingida' };
  };

  const formatDateToString = (date: Date) => {
    if (!date) {
      return '';
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
  };

  const handleApplyFilters = () => {
    const { idProcesso, ano, mes, situacao, pesquisa } = filters;

    // !processes && dispatch(getProcesses());

    dispatch(
      getAllMetasFilter({
        idProcesso: idProcesso || ('' as unknown as number),
        ano: ano instanceof Date ? ano.getFullYear().toString() : '',
        mes: mes instanceof Date ? format(mes, 'MM') : '',
        situacao: situacao || '',
        pesquisa: pesquisa || '',
        size: pageSize,
        page: page,
      })
    );
  };

  const clearFilters = () => {
    setFilters(initialFilter);
  };

  const renderTable = () => {
    if (metasLista?.content.length > 0) {
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
                {metasLista?.content.map((goalResult: ListMeta, index) => (
                  // <Tooltip title={goalResult.meta.metaObjetivo.desdobramentoSGQ}>
                  <Tooltip title={''}>
                    <TableRow className="table-row" key={index}>
                      {/* <TableCell onClick={event => null}>{goalResult.meta.descricao}</TableCell> */}
                      <TableCell onClick={event => null}>{goalResult.descricao}</TableCell>
                      {/* <TableCell onClick={event => null}>{goalResult.meta.avaliacaoResultado}</TableCell> */}
                      <TableCell onClick={event => null}>
                        {goalResult.avaliacao}
                        <br />
                        {goalResult.analise}
                      </TableCell>
                      <TableCell onClick={event => null}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {getSituacaoIcon(goalResult.parcial, goalResult.metaAtingida).icon}
                        </Box>
                      </TableCell>
                      <TableCell onClick={event => null}>
                        {goalResult.lancadoEm ? formatDateToString(new Date(goalResult.lancadoEm)) : '-'}
                      </TableCell>
                      <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                        {isSGQ ? (
                          <IconButton
                            title="Editar"
                            color="primary"
                            onClick={() => navigate(`/goals/edit/${goalResult.idMeta}`, { state: goalResult })}
                          >
                            <EditIcon sx={{ color: '#e6b200' }} />
                          </IconButton>
                        ) : (
                          <IconButton title="Visualizar" color="primary" onClick={event => null}>
                            <VisibilityIcon sx={{ color: '#e6b200' }} />
                          </IconButton>
                        )}
                        <IconButton
                          id="btn-view"
                          title="Resultado"
                          color="primary"
                          onClick={() => navigate(`/goals/${goalResult.idMeta}/results`)}
                        >
                          <NoteAltOutlinedIcon sx={{ color: '#2196F3' }} />
                        </IconButton>
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
          <Typography className="link">Metas e Objetivos </Typography>
        </Breadcrumbs>
        <h1 className="title">Metas</h1>

        <Grid container gap={1}>
          <Button
            variant="contained"
            className="infodoc-list-form-field"
            style={{ marginRight: '10px', height: '54px', width: '100px', backgroundColor: isSGQ ? '#e6b200' : '#a3a3a3' }}
            onClick={event => navigate(`/goals/new`)}
            title="Novo Registro"
            disabled={!isSGQ}
          >
            Novo
          </Button>
          <Grid item xs={1.5}>
            <FormControl fullWidth>
              <InputLabel>Processo</InputLabel>
              <Select
                sx={{ height: '56px' }}
                value={filters.idProcesso}
                onChange={e => setFilters({ ...filters, idProcesso: Number(e.target.value.toString()) })}
                label="Processo"
              >
                {/* <MenuItem value={0}>Selecionar</MenuItem> */}
                {processes?.map((process, index) => (
                  <MenuItem key={index} value={process.id}>
                    {process.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={1.5}>
            <MaterialDatepicker
              label="Ano"
              selected={filters.ano as Date}
              showYearPicker
              onChange={date => setFilters({ ...filters, ano: new Date(date) })}
              dateFormat="yyyy"
            />
          </Grid>
          <Grid item xs={1.5}>
            <MaterialDatepicker
              label="Mês"
              selected={filters.mes as Date}
              showMonthYearPicker
              hideHeader
              onChange={date => setFilters({ ...filters, mes: new Date(date) })}
              dateFormat="MMMM"
            />
          </Grid>
          <Grid item xs={1.5}>
            <FormControl fullWidth>
              <InputLabel>Situação</InputLabel>
              <Select
                sx={{ height: '56px' }}
                value={filters.situacao}
                onChange={e => setFilters({ ...filters, situacao: e?.target?.value?.toString() })}
                label="Situação"
              >
                {['FINALIZADO', 'PARCIAL']?.map(
                  (
                    situacao,
                    index // F = Finalizado; P = Parcial
                  ) => (
                    <MenuItem key={index} value={EnumSituacao[situacao]}>
                      {situacao}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <TextField
              label="Pesquisa"
              fullWidth
              onChange={event => {
                setFilters({ ...filters, pesquisa: event?.target?.value || '' });
              }}
              value={filters.pesquisa || ''}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={() => null} onMouseDown={() => null}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
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

export default HomeGoalsList;
