/* eslint-disable radix */
/* eslint-disable no-console */
import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import { Check, Visibility } from '@mui/icons-material';

import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { listROs } from '../../reducers/risks-opportunities.reducer';

import InfoIcon from '@mui/icons-material/Info';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Process } from 'app/modules/infodoc/models';
import { RiskOpportunity } from '../../models';

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
  const rolist: Array<RiskOpportunity> = useAppSelector(state => state.all4qmsmsgatewayro.risco.entities);
  const [filters, setFilters] = useState({
    idProcesso: null,
    probabilidade: null,
    severidade: 0,
    decisao: null,
    pesquisa: null as string,
  });
  const navigate = useNavigate();

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
    const { idProcesso, probabilidade, severidade, decisao } = filters;
    dispatch(
      listROs({
        size: pageSize,
        page,
      })
    );

    dispatch(getProcesses());
  }, []);

  /**
   * Pagination
   */
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(5);

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
          {rolist?.map((ro: RiskOpportunity) => (
            <TableRow key={ro.id}>
              {/* <TableCell>{ro.fluxo ? ro.fluxo : 'Fluxo mock'}</TableCell>
              <TableCell>{ro.atividade ? ro.atividade : 'Atividade 1 mock'}</TableCell>
              <TableCell>{ro.descricao ? ro.descricao : 'Descrição 1 mock'}</TableCell>
              <TableCell>{ro.causa ? ro.causa : 'Causa mock'}</TableCell>
              <TableCell>{ro.efeito ? ro.efeito : 'Efeito mock'}</TableCell>
              <TableCell>{ro.areaProcesso ? ro.areaProcesso : 'Area mock'}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {ro.areaProcesso ? ro.areaProcesso : 'Probabilidade mock'}
                </Box>
              </TableCell>
              <TableCell>{ro.serveridade ? ro.serveridade : 'Severidade mock'}</TableCell>
              <TableCell>{ro.decisao ? ro.decisao : 'Decisão mock'}</TableCell> */}

              {/* <TableCell> */}
              {/* <IconButton title="Editar" color="primary" onClick={() => {}}>
                  <EditIcon sx={{ color: '#e6b200' }} />
                </IconButton>
                <IconButton title="Visualizar" color="primary" onClick={() => {}}>
                  <Visibility sx={{ color: '#0EBDCE' }} />
                </IconButton>
                <IconButton title="Imprimir" color="primary" onClick={() => {}}>
                  <Check sx={{ color: '#03AC59' }} />
                </IconButton> */}
              {/* <IconButton title="Cancelar" color="primary" onClick={() => {}}>
                  <CancelIcon sx={{ color: '#FF0000' }} />
                </IconButton> */}
              {/* </TableCell> */}
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
        onClick={() => {
          navigate('/risks-opportunities/risk');
        }}
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
