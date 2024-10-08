/* eslint-disable radix */
/* eslint-disable no-console */
import { Check, Visibility } from '@mui/icons-material';
import BlockIcon from '@mui/icons-material/Block';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import InfoIcon from '@mui/icons-material/Info';
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
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Process } from 'app/modules/infodoc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { a11yProps, CustomTabPanel } from 'app/shared/components/tabs';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Configuration, RawRiskOpportunity } from '../../models';
import { getComplexities } from '../../reducers/complexities.reducer';
import { getImprovements } from '../../reducers/improvements.reducer';
import { getProbabilities } from '../../reducers/probabilities.reducer';
import { getRiskDecisions } from '../../reducers/risk-decisions.reducer';
import { listROs } from '../../reducers/risks-opportunities.reducer';
import { getSeverities } from '../../reducers/severities.reducer';

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
  const rolist: Array<RawRiskOpportunity> = useAppSelector(state => state.all4qmsmsgatewayro.risco.entities);
  const riskDecisions: Array<Configuration> = useAppSelector<Array<Configuration>>(
    state => state.all4qmsmsgatewayro.riskDecisions.entities
  );
  const opportunityDecisions: Array<Configuration> = useAppSelector<Array<Configuration>>(
    state => state.all4qmsmsgatewayro.opportunityDecisions.entities
  );
  const complexities: Array<Configuration> = useAppSelector<Array<Configuration>>(state => state.all4qmsmsgatewayro.complexities.entities);
  const improvements: Array<Configuration> = useAppSelector<Array<Configuration>>(state => state.all4qmsmsgatewayro.improvements.entities);
  const probabilities: Array<Configuration> = useAppSelector<Array<Configuration>>(
    state => state.all4qmsmsgatewayro.probabilities.entities
  );
  const severities: Array<Configuration> = useAppSelector<Array<Configuration>>(state => state.all4qmsmsgatewayro.severities.entities);

  const risks = useMemo<Array<RawRiskOpportunity>>(() => {
    if (!rolist || rolist.length <= 0) {
      return [];
    }

    return rolist.filter(ro => ro.tipoRO === 'R');
  }, [rolist]);

  const opportunities = useMemo<Array<RawRiskOpportunity>>(() => {
    if (!rolist || rolist.length <= 0) {
      return [];
    }

    return rolist.filter(ro => ro.tipoRO === 'O');
  }, [rolist]);

  const [tab, setTab] = useState(0);
  const [filters, setFilters] = useState({
    idProcesso: null,
    probabilidade: null,
    severidade: null,
    decisao: null,
    pesquisa: null as string,
  });
  const navigate = useNavigate();

  // Maybe...
  const clearFilters = () => {
    setFilters({
      idProcesso: null,
      probabilidade: null,
      severidade: null,
      decisao: null,
      pesquisa: null,
    });
  };

  useEffect(() => {
    const { idProcesso, probabilidade, severidade, decisao, pesquisa } = filters;
    dispatch(
      // listROFiltro({
      //   idProcesso,
      //   probabilidadeComplexidade: probabilidade,
      //   severidadeMelhoria: severidade,
      //   decisao,
      //   pesquisa,
      //   size: pageSize,
      //   page,
      // })
      listROs({})
    );

    dispatch(getComplexities());
    dispatch(getImprovements());
    dispatch(getProcesses());
    dispatch(getProbabilities());
    dispatch(getSeverities());
    dispatch(getRiskDecisions());
  }, []);

  const handleChangeTag = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    // R - risco
    // O - oportunidade

    let type = newValue == 1 ? 'R' : 'O';

    // dispatch(
    //   listROFiltro({
    //     tipoRO: type,
    //     page,
    //     size: pageSize,
    //   })
    // );
  };

  /**
   * Pagination
   */
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(10);

  function getLabelGrauRO(letter: string) {
    const levels = {
      A: 'ALTO',
      B: 'BAIXO',
      M: 'MÉDIO',
    };
    return levels[letter] || 'N/A';
  }

  useEffect(listRo, [filters, page, pageSize]);

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
          {(tab === 0 ? risks : opportunities).map((ro: RawRiskOpportunity) => {
            const {
              atualizadoEm,
              atualizadoPor,
              criadoEm,
              criadoPor,
              dataRegistro,
              descricao1,
              descricao2,
              descricao3,
              descricaoControle,
              id,
              idEmissor,
              idLinhaConfigControle1,
              idLinhaConfigControle2,
              idPartesInteressadas,
              idProcesso,
              idsAnaliseROS,
              nomeAtividade,
              nomeFluxo,
              tipoRO,
              linhaConfigControle1,
              linhaConfigControle2,
            } = ro;

            const path: string = tipoRO === 'R' ? 'risk' : 'opportunity';

            const process: Process = processes.find(p => p.id === idProcesso);

            return (
              <TableRow key={id}>
                <TableCell>{nomeFluxo ?? '-'}</TableCell>
                <TableCell>{nomeAtividade ?? '-'}</TableCell>
                <TableCell>{descricao1 ?? '-'}</TableCell>
                <TableCell>{descricao2 ?? '-'}</TableCell>
                <TableCell>{descricao3 ?? '-'}</TableCell>
                <TableCell>{process?.nome ?? '-'}</TableCell>
                <TableCell>{idLinhaConfigControle1 ?? linhaConfigControle1?.descricaoRO ?? '-'}</TableCell>
                <TableCell>{idLinhaConfigControle2 ?? linhaConfigControle2?.descricaoRO ?? '-'}</TableCell>
                <TableCell>{descricaoControle ?? '-'}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <Tooltip title="Editar">
                      <IconButton color="primary" onClick={() => navigate(`${path}/${id}`)}>
                        <EditIcon sx={{ color: '#e6b200' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Visualizar">
                      <IconButton color="primary" onClick={() => navigate(`${path}/view/${id}`)}>
                        <Visibility sx={{ color: '#0EBDCE' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Imprimir">
                      <IconButton color="primary" onClick={() => {}}>
                        <Check sx={{ color: '#03AC59' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancelar">
                      <IconButton color="primary" onClick={() => {}}>
                        <CancelIcon sx={{ color: '#FF0000' }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
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
          navigate(tab === 0 ? '/risks-opportunities/risk' : '/risks-opportunities/opportunity');
        }}
        title="Novo Registro"
      >
        Novo
      </Button>
      <div style={{ flex: 0.9, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', alignContent: 'stretch', gap: '10px' }}>
        <FormControl className=" me-2">
          <InputLabel>Processo</InputLabel>
          <Select onChange={e => setFilters({ ...filters, idProcesso: parseInt(e.target.value.toString()) })} label="Processo">
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
            {probabilities?.map((probability, index) => (
              <MenuItem key={index} value={probability.id}>
                {probability.descricaoRO}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className=" me-2">
          <InputLabel>Severidade</InputLabel>
          <Select onChange={e => setFilters({ ...filters, severidade: parseInt(e.target.value.toString()) })} label="Processo">
            {severities?.map((severity, index) => (
              <MenuItem key={index} value={severity.id}>
                {getLabelGrauRO(severity.grauRO)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className=" me-2">
          <InputLabel>Decisão</InputLabel>
          <Select onChange={e => setFilters({ ...filters, decisao: parseInt(e.target.value.toString()) })} label="Processo">
            {(tab === 0 ? opportunityDecisions : riskDecisions)?.map((decision, index) => (
              <MenuItem key={index} value={decision.id}>
                {decision.descricaoRO}
              </MenuItem>
            ))}
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

      <Button
        variant="contained"
        className="secondary-button me-2"
        style={{ marginRight: '10px', height: '42px', width: '185px' }}
        onClick={() => {
          navigate('configurations');
        }}
        title="Configurações"
      >
        Configurações
      </Button>
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

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={handleChangeTag}>
              <Tab label="Riscos" {...a11yProps(0)} />
              <Tab label="Oportunidades" {...a11yProps(1)} />
            </Tabs>
          </Box>
        </Box>
        <CustomTabPanel value={tab} index={0}>
          {TableRendered}
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={1}>
          {TableRendered}
        </CustomTabPanel>
      </div>
    </div>
  );
};

export default Home;
