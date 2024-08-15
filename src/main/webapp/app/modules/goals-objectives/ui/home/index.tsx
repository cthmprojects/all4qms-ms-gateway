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

import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import CancelIcon from '@mui/icons-material/Cancel';
import DatePicker from 'react-datepicker';
import React, { useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import { Link, useNavigate } from 'react-router-dom';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SearchIcon from '@mui/icons-material/Search';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import InfoIcon from '@mui/icons-material/Info';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import './infodoc.css';

import { Storage } from 'react-jhipster';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { getUsersAsAdminSGQ } from 'app/modules/administration/user-management/user-management.reducer';

import axios, { AxiosResponse } from 'axios';
import { Process } from 'app/modules/rnc/models';

const getSituacaoIcon = situacao => {
  switch (situacao) {
    case 'E':
      // return { icon: <EditIcon />, text: 'Em Emissão' };
      return { icon: <EditIcon />, text: 'Em Edição' };
    case 'H':
      return { icon: <CheckCircleIcon />, text: 'Homologado' };
    case 'R':
      return { icon: <HourglassEmptyIcon />, text: 'Em Revisão' };
    case 'O':
      return { icon: <BlockIcon />, text: 'Obsoleto' };
    case 'C':
      return { icon: <CancelIcon />, text: 'Cancelado' };
    default:
      return { icon: <InfoIcon />, text: 'Indefinido' };
  }
};

const HomeGoalsList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [totalItems, setTotalItems] = useState(0);
  const userLoginID = parseInt(Storage.session.get('ID_USUARIO'));
  const [usersSGQ, setUsersSGQ] = useState<[]>([]);
  const [goalsList, setGoalsList] = useState<[]>([]);

  const processes = useAppSelector<Array<Process>>(state => state?.all4qmsmsgatewayrnc?.process?.entities);
  // const users = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);

  /**
   * Filters
   */
  const [filters, setFilters] = useState({
    processo: '',
    ano: '',
    mes: '',
    situacao: '',
    pesquisa: '',
  });

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

  const getUsersSGQ = async () => {
    const resUsers = await dispatch(getUsersAsAdminSGQ('ROLE_SGQ'));
    const users_ = (resUsers.payload as AxiosResponse).data || [];

    // const filteredUser = users.filter(user => users_.some(firstUser => firstUser.id === user.user.id));
    // setUsersSGQ(filteredUser);
  };

  useEffect(() => {}, []);

  useEffect(() => {
    handleApplyFilters();
  }, [filters, page, pageSize]);

  // const filterUser = (id: number) => {
  //   if (!users || users.length <= 0) {
  //     return '-';
  //   }

  //   if (id) {
  //     return users.find(user => user.id === id);
  //   }

  //   return '-';
  // };

  //---------------------------------------------------------------

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // E - Edição
    // R - revisão
    // H - homolog
    // O - obsoleto
    // C - cancelado

    let type: string = '';
    switch (newValue) {
      case 1:
        type = 'E';
        break;
      case 2:
        type = 'R';
        break;
      case 3:
        type = 'H';
        break;
      case 4:
        type = 'O';
        break;
      case 5:
        type = 'C';
        break;
    }

    const { processo, ano, mes, situacao } = filters;
    // dispatch(
    //   listdocs({
    //     dtIni: dtIni?.toISOString(),
    //     dtFim: dtFim?.toISOString(),
    //     idProcesso,
    //     origem,
    //     situacao: type,
    //     size: pageSize,
    //     page: 0,
    //   })
    // );

    // setValue(newValue);
  };

  const columns = [
    'Código',
    'Título',
    'Emissor',
    'Revisão',
    'Data',
    'Área/Processo',
    'Origem',
    'Situação',
    // 'Status',
    // 'Distribuição',
    'Ações',
  ];

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
    const { processo, ano, mes, situacao, pesquisa } = filters;

    // dispatch(
    //   listdocs({
    //     dtIni: dtIni?.toISOString(),
    //     dtFim: dtFim?.toISOString(),
    //     idProcesso,
    //     origem,
    //     situacao,
    //     size: pageSize,
    //     pesquisa,
    //     page: page,
    //   })
    // );
  };

  const clearFilters = () => {
    setFilters({
      processo: '',
      ano: '',
      mes: '',
      situacao: '',
      pesquisa: '',
    });
  };

  const renderTable = () => {
    if (goalsList?.length > 0) {
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
                {goalsList?.map((goal: any) => (
                  <TableRow className="table-row" key={goal.doc.id}>
                    <Tooltip onClick={event => null} title={goal.doc.titulo}>
                      <TableCell>{goal.doc.codigo}</TableCell>
                    </Tooltip>
                    <TableCell onClick={event => null}>{goal.doc.titulo}</TableCell>
                    <TableCell onClick={event => null}> {/* {filterUser(goal.doc.idUsuarioCriacao)?.nome} */}</TableCell>
                    <TableCell onClick={event => null}>-</TableCell>
                    <TableCell onClick={event => null}>
                      {goal.doc.dataCricao ? formatDateToString(new Date(goal.doc.dataCricao)) : '-'}
                    </TableCell>
                    <TableCell onClick={event => null}></TableCell>
                    <TableCell onClick={event => null}></TableCell>
                    <TableCell onClick={event => null}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{getSituacaoIcon(goal?.doc.enumSituacao).text}</Box>
                    </TableCell>
                    {/* <TableCell onClick={event => null}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{getStatusIcon(goal.doc.status).icon}</Box>
                    </TableCell> */}
                    <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton title="Editar" color="primary" disabled={goal.doc.enumSituacao != 'H'} onClick={event => null}>
                        <EditIcon sx={{ color: goal.doc.enumSituacao != 'H' ? '#cacaca' : '#e6b200' }} />
                      </IconButton>
                      <IconButton id="btn-view" title="Visualizar" color="primary" onClick={event => null}>
                        <VisibilityIcon sx={{ color: '#0EBDCE' }} />
                      </IconButton>
                      <IconButton
                        id="btn-print"
                        title="Imprimir"
                        color="primary"
                        onClick={event => null}
                        // disabled={goal.doc.enumSituacao == 'C'}
                        disabled
                      >
                        {/* <PrintIcon sx={{ color: goal.doc.enumSituacao == 'C' ? '#cacaca' : '#03AC59' }} /> */}
                        <PrintIcon sx={{ color: '#cacaca' }} />
                      </IconButton>
                      <IconButton
                        id="btn-cancel"
                        title="Cancelar"
                        color="primary"
                        onClick={event => null}
                        disabled={goal.doc.enumSituacao == 'C'}
                      >
                        <CancelIcon sx={{ color: goal.doc.enumSituacao == 'C' ? '#cacaca' : '#FF0000' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
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
            onClick={event => null}
            title="Novo Registro"
          >
            Novo
          </Button>
          <Grid item xs={1.5}>
            <FormControl fullWidth>
              <InputLabel>Processo</InputLabel>
              <Select
                sx={{ height: '56px' }}
                value={filters.processo}
                onChange={e => setFilters({ ...filters, processo: e.target.value.toString() })}
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
              <InputLabel>Ano</InputLabel>
              <Select
                sx={{ height: '56px' }}
                value={filters.processo}
                onChange={e => setFilters({ ...filters, ano: e?.target?.value?.toString() })}
                label="ano"
              >
                <MenuItem value={0}>Selecionar</MenuItem>
                {['2024', '2023']?.map((ano, index) => (
                  <MenuItem key={index} value={ano}>
                    {ano}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={1.5}>
            <FormControl fullWidth>
              <InputLabel>Mês</InputLabel>
              <Select
                sx={{ height: '56px' }}
                value={filters.processo}
                onChange={e => setFilters({ ...filters, ano: e?.target?.value?.toString() })}
                label="Mês"
              >
                <MenuItem value={0}>Selecionar</MenuItem>
                {['Janeiro', 'Fevereiro']?.map((ano, index) => (
                  <MenuItem key={index} value={ano}>
                    {ano}
                  </MenuItem>
                ))}
              </Select>
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
                <MenuItem value={0}>Selecionar</MenuItem>
                {['Finalizado', 'Parcial']?.map((ano, index) => (
                  <MenuItem key={index} value={ano}>
                    {ano}
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
