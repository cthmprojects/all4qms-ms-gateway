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
  Tabs,
  Tab,
  Tooltip,
  TextField,
  TablePagination,
  Grid,
  Input,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from 'react-router-dom';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
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
import { parseISO, format } from 'date-fns';

import { Storage } from 'react-jhipster';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';

import axios, { AxiosResponse } from 'axios';
import { Process } from 'app/modules/rnc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { ListMeta, Meta, MetaResultado } from '../../models/goals';
import { EnumSituacao, EnumTemporal } from '../../models/enums';
import { getAllMetasFilter, ListMetasInterface, ListPaginationMeta } from '../../reducers/metas-list.reducer';

// Registra a localidade
registerLocale('pt-BR', ptBR);

const HomeGoalsList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const processes = useAppSelector<Array<Process>>(state => state.all4qmsmsgatewayrnc.process.entities);
  const metasLista: ListPaginationMeta = useAppSelector<ListPaginationMeta>(state => state.all4qmsmsmetaind.metasLista.entity);

  const [startDate, setStartDate] = useState(new Date());
  const [totalItems, setTotalItems] = useState(0);
  const userLoginID = parseInt(Storage.session.get('ID_USUARIO'));
  // const [usersSGQ, setUsersSGQ] = useState<[]>([]);
  const [isSGQ, setIsSGQ] = useState<Boolean>(false);
  const [goalsList, setGoalsList] = useState<ListMeta[]>([]);
  /**
   * Filters
   */
  const [filters, setFilters] = useState<ListMetasInterface>({ idProcesso: processes[0]?.id });

  /**
   * Pagination
   */
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(5);

  function displayedRowsLabel({ from, to, count }) {
    return `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`;
  }

  const onPageChanged = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  };

  const onRowsPerPageChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (parseInt(event.target.value, 10) > totalItems) {
      setPageSize(parseInt(event.target.value, 10));
      setPage(0);
    } else {
      setPageSize(parseInt(event.target.value, 10));
    }
  };

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
    dispatch(getUsers({}));
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
        idProcesso: idProcesso || processes[0]?.id,
        ano: ano instanceof Date ? ano.getFullYear().toString() : ano,
        mes: mes instanceof Date ? format(mes, 'MM') : mes,
        situacao: situacao,
        pesquisa: pesquisa,
        size: pageSize,
        page: page,
      })
    );
  };

  const clearFilters = () => {
    setFilters({
      idProcesso: 0,
      ano: new Date(),
      mes: new Date(),
      situacao: '',
      pesquisa: '',
    });
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
                        <IconButton title="Editar" color="primary" onClick={event => null}>
                          {' '}
                          {/*disabled={goalResult.doc.enumSituacao != 'H'}*/}
                          <EditIcon sx={{ color: '#e6b200' }} />
                        </IconButton>
                        <IconButton
                          id="btn-view"
                          title="Resultado"
                          color="primary"
                          onClick={() => navigate(`/goals/${goalResult.idMetaResultado}/results`)}
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
            <TablePagination
              component="div"
              count={totalItems}
              labelDisplayedRows={displayedRowsLabel}
              labelRowsPerPage="Itens por página:"
              onPageChange={onPageChanged}
              onRowsPerPageChange={onRowsPerPageChanged}
              page={page}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
              style={{ display: 'flex', alignContent: 'center', width: '390px' }}
            />
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
            <TablePagination
              component="div"
              count={totalItems}
              labelDisplayedRows={displayedRowsLabel}
              labelRowsPerPage="Itens por página:"
              onPageChange={onPageChanged}
              onRowsPerPageChange={onRowsPerPageChanged}
              page={page}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
              style={{ display: 'flex', alignContent: 'center', width: '390px' }}
            />
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
            className="primary-button infodoc-list-form-field"
            style={{ marginRight: '10px', height: '54px', width: '100px' }}
            onClick={event => navigate('/goals/1/results')}
            title="Novo Registro"
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
                <MenuItem value={0}>Selecionar</MenuItem>
                {processes?.map((process, index) => (
                  <MenuItem key={index} value={process.id}>
                    {process.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={1.5}>
            <FormControl fullWidth>
              <DatePicker
                selected={filters.ano || ''}
                onChange={date => setFilters({ ...filters, ano: new Date(date), mes: filters.mes ? filters.mes : new Date(date) })}
                showYearPicker
                dateFormat="yyyy"
                className="metas-list-date-picker"
                id="ano-date-picker"
                placeholderText="Ano"
                locale="pt-BR" // Define o idioma para português do Brasil
              />
              <label htmlFor="start-date-picker" className="infodoc-list-date-label">
                Ano
              </label>
            </FormControl>
          </Grid>
          <Grid item xs={1.5}>
            <FormControl fullWidth>
              <DatePicker
                selected={filters.mes || ''}
                onChange={date => setFilters({ ...filters, mes: new Date(date) })}
                showMonthYearPicker
                dateFormat="MMMM"
                className="metas-list-date-picker"
                id="ano-date-picker"
                placeholderText="Mês"
                locale="pt-BR" // Define o idioma para português do Brasil
              />
              <label htmlFor="mes-date-picker" className="infodoc-list-date-label">
                Mês
              </label>
            </FormControl>
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

          {/* <Button
            variant="contained"
            className="secondary-button rnc-list-form-field"
            style={{ height: '49px', width: '60px', marginLeft: '7px' }}
            onClick={clearFilters}
            title="Limpar"
          >
            Limpar
          </Button> */}
        </Grid>

        <Box sx={{ width: '100%' }}>{renderTable()}</Box>
      </div>
    </div>
  );
};

export default HomeGoalsList;
