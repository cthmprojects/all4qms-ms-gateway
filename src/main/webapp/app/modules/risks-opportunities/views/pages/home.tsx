/* eslint-disable radix */
/* eslint-disable no-console */
import {
  Breadcrumbs,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Pagination,
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
} from '@mui/material';

import { Visibility, Edit, Check } from '@mui/icons-material';

import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';

import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

import InfoIcon from '@mui/icons-material/Info';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Process } from 'app/modules/infodoc/models';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
// Example
const getSituacaoIcon = situacao => {
  switch (situacao) {
    case 'E':
      return { icon: <EditIcon />, text: 'Em Emissão' };
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

const columns = ['Fluxo', 'Atividade', 'Descrição', 'Causa', 'Efeito', 'Área/Processo', 'Probabilidade', 'Severidade', 'Decisão', 'Ações'];

const Home = () => {
  const dispatch = useAppDispatch();
  const processes = useAppSelector<Array<Process>>(state => state.all4qmsmsgatewayrnc.process.entities);
  const [filters, setFilters] = useState({
    idProcesso: null,
    probabilidade: null,
    severidade: 0,
    decisao: null,
    pesquisa: null as string,
  });

  // Maybe...
  const clearFilters = () => {
    setFilters({
      idProcesso: null,
      probabilidade: null,
      severidade: 0,
      decisao: null,
      pesquisa: null,
    });
  };

  useEffect(() => {
    dispatch(getProcesses());
  }, []);

  const TableRendered = (
    <TableContainer component={Paper} style={{ marginTop: '30px', boxShadow: 'none' }}>
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              // eslint-disable-next-line react/jsx-key
              <TableCell align="left">{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[{ doc: { id: 1 } }]?.map((infodoc: any) => (
            <TableRow key={infodoc.doc.id}>
              <Tooltip title={infodoc.doc.titulo}>
                <TableCell>Fluxo 1</TableCell>
              </Tooltip>
              <TableCell>Atividade 1</TableCell>
              <TableCell>Descrição Longa</TableCell>
              <TableCell>Causa 1</TableCell>
              <TableCell>Efeito 1</TableCell>
              <TableCell>Area 1</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Probabilidade</Box>
              </TableCell>
              <TableCell>Severidade 1</TableCell>
              <TableCell>Decisão 1</TableCell>

              <TableCell>
                <IconButton title="Editar" color="primary" onClick={() => {}}>
                  <EditIcon sx={{ color: '#e6b200' }} />
                </IconButton>
                <IconButton title="Visualizar" color="primary" onClick={() => {}}>
                  <Visibility sx={{ color: '#0EBDCE' }} />
                </IconButton>
                <IconButton title="Imprimir" color="primary" onClick={() => {}}>
                  <Check sx={{ color: '#03AC59' }} />
                </IconButton>
                {/* <IconButton title="Cancelar" color="primary" onClick={() => {}}>
                  <CancelIcon sx={{ color: '#FF0000' }} />
                </IconButton> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const RenderedFilters = (
    <div
      style={{
        paddingBottom: '30px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <Button
        variant="contained"
        className="primary-button me-2"
        style={{ marginRight: '10px', height: '42px', width: '185px' }}
        onClick={() => {}}
        title="Novo Registro"
      >
        Novo
      </Button>
      <div style={{ flex: 0.9, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', alignContent: 'stretch', gap: '10px' }}>
        <FormControl className=" me-2">
          <InputLabel>Processo</InputLabel>
          <Select onChange={e => setFilters({ ...filters, idProcesso: parseInt(e.target.value.toString()) })} label="Processo">
            <MenuItem value={0}>Selecionar</MenuItem>
            {processes?.map((process, index) => (
              <MenuItem key={index} value={process.id}>
                {process.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className=" me-2">
          <InputLabel>Probabilidade</InputLabel>
          <Select onChange={e => setFilters({ ...filters, probabilidade: parseInt(e.target.value.toString()) })} label="Probabilidade">
            <MenuItem value={0}>Selecionar</MenuItem>
            {/* {(processes || [])?.map((process, index) => (
              <MenuItem key={index} value={process.id}>
                {process.nome}
              </MenuItem>
            ))} */}
            <MenuItem value={0}>Alta</MenuItem>
            <MenuItem value={0}>Média</MenuItem>
            <MenuItem value={0}>Baixa</MenuItem>
          </Select>
        </FormControl>

        <FormControl className=" me-2">
          <InputLabel>Severidade</InputLabel>
          <Select onChange={e => setFilters({ ...filters, severidade: parseInt(e.target.value.toString()) })} label="Processo">
            <MenuItem value={0}>Selecionar</MenuItem>
            {/* {processes?.map((process, index) => (
            <MenuItem key={index} value={process.id}>
              {process.nome}
            </MenuItem>
          ))} */}
            <MenuItem value={0}>Alta</MenuItem>
            <MenuItem value={0}>Média</MenuItem>
            <MenuItem value={0}>Baixa</MenuItem>
          </Select>
        </FormControl>

        <FormControl className=" me-2">
          <InputLabel>Decisão</InputLabel>
          <Select onChange={e => setFilters({ ...filters, decisao: parseInt(e.target.value.toString()) })} label="Processo">
            <MenuItem value={0}>Selecionar</MenuItem>
            {/* {processes?.map((process, index) => (
            <MenuItem key={index} value={process.id}>
              {process.nome}
            </MenuItem>
          ))} */}
            <MenuItem value={0}>Decisao 1</MenuItem>
            <MenuItem value={0}>Média</MenuItem>
            <MenuItem value={0}>Baixa</MenuItem>
          </Select>
        </FormControl>
      </div>

      <FormControl>
        <TextField
          size="small"
          label="Pesquisa"
          style={{ minWidth: '20vw' }}
          onChange={event => {
            setFilters({ ...filters, pesquisa: event.target.value });
          }}
          placeholder="Descrição"
          value={filters.pesquisa || ''}
          variant="filled"
        />
      </FormControl>
    </div>
  );

  return (
    //////////////////////////////////////
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">Riscos</Typography>
        </Breadcrumbs>
        {RenderedFilters}
      </div>

      {TableRendered}
    </div>
  );
};

export default Home;
