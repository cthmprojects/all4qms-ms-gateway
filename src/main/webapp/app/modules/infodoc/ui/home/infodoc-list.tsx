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
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import CancelIcon from '@mui/icons-material/Cancel';
import DatePicker from 'react-datepicker';
import React, { useEffect, useState } from 'react';
import { Card, Row } from 'reactstrap';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import PrintDisabledIcon from '@mui/icons-material/PrintDisabled';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import './infodoc.css';
import { InfoDoc, StatusEnum } from '../../models';
import { listdocs } from '../../reducers/infodoc.reducer';
import UploadInfoFile from '../dialogs/upload-dialog/upload-files';
import { RequestCopyDialog } from '../dialogs/request-copy-dialog/request-copy-dialog';
import { CancelDocumentDialog } from '../dialogs/cancel-document-dialog/cancel-document-dialog';
import { DistributionDialog } from '../dialogs/distribution-dialog/distribution-dialog';
import { Storage } from 'react-jhipster';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';

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

/* Codigo vai ser removido quando o reducer for implementado a partir do endpoint correto */
const infodocA = {
  codigo: 'string',
  titulo: 'string',
  emissor: 'string',
  revisao: 'string',
  data: new Date(),
  area_processo: 'string',
  origem: 'string',
  situacao: 'Emissão',
  /* status: 'Concluído', */
  distribuicao: 'string',
};

/* ----------------------------------------------------------------  */

const getSituacaoIcon = situacao => {
  switch (situacao) {
    case 'Emissão':
      return { icon: <EditIcon />, text: 'Em Emissão' };
    case 'Homologado':
      return { icon: <CheckCircleIcon />, text: 'Homologado' };
    case 'Revisão':
      return { icon: <HourglassEmptyIcon />, text: 'Em Revisão' };
    case 'Obsoleto':
      return { icon: <BlockIcon />, text: 'Obsoleto' };
    case 'Cancelado':
      return { icon: <CancelIcon />, text: 'Cancelado' };
    default:
      return { icon: <InfoIcon />, text: 'Indefinido' };
  }
};

/* const getStatusIcon = status => {
  switch (status) {
    case 'Em Emissão':
      return { icon: <EditIcon />, text: 'Em Emissão' };
    case 'Em Validação':
      return { icon: <HourglassEmptyIcon />, text: 'Em Validação' };
    case 'Em Aprovação':
      return { icon: <ThumbUpIcon />, text: 'Em Aprovação' };
    case 'Em Revisão':
      return { icon: <HourglassEmptyIcon />, text: 'Em Revisão' };
    case 'Em Validação da Revisão':
      return { icon: <HourglassEmptyIcon />, text: 'Em Validação da Revisão' };
    case 'Em Aprovação da Revisão':
      return { icon: <ThumbUpIcon />, text: 'Em Aprovação da Revisão' };
    case 'Em Distribuição':
      return { icon: <HourglassFullIcon />, text: 'Em Distribuição' };
    case 'Em Assinatura':
      return { icon: <AssignmentIndIcon />, text: 'Em Assinatura' };
    case 'Em Cancelamento':
      return { icon: <CancelIcon />, text: 'Em Cancelamento' };
    case 'Em Aprovação do Cancelamento':
      return { icon: <ThumbDownIcon />, text: 'Em Aprovação do Cancelamento' };
    case 'Concluído':
      return { icon: <DoneAllIcon />, text: 'Concluído' };
    default:
      return { icon: <InfoIcon />, text: 'Indefinido' };
  }
}; */

const InfodocList = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [pageSize, setPageSize] = useState<number>(5);
  const [value, setValue] = useState(0);
  const [distributionModal, setDistributionModal] = useState(false);
  const [uploadFileModal, setUploadFileModal] = useState(false);
  const [requestCopyModal, setRequestCopyModal] = useState(false);
  const [cancelDocumentModal, setCancelDocumentModal] = useState(false);
  const dispatch = useAppDispatch();
  const statusValues = Object.keys(StatusEnum) as Array<keyof typeof StatusEnum>;
  /* const enums = useAppSelector<Enums | null>(state => state.all4qmsmsgateway.enums.enums);
  const processes = useAppSelector<Array<Process>>(state => state.all4qmsmsgateway.process.entities); */

  const userLoginID = parseInt(Storage.session.get('ID_USUARIO'));
  const users = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    dispatch(listdocs({}));
  }, []);
  const infodocs: Array<InfoDoc> = useAppSelector(state => state.all4qmsmsgateway.infodoc.entities);

  const filterUser = (id: number) => {
    if (!users || users.length <= 0) {
      return null;
    }
    return users.find(user => user.id === id);
  };

  //---------------------------------------------------------------
  const [filters, setFilters] = useState({
    dtIni: null,
    dtFim: null,
    idProcesso: null,
    situacao: '',
    pesquisa: '',
  });

  const handleApplyFilters = () => {
    const { dtIni, dtFim, idProcesso, situacao, pesquisa } = filters;
    dispatch(
      listdocs({
        page: 0,
        size: pageSize,
        dtIni: dtIni,
        dtFim: dtFim,
        idProcesso,
        situacao: situacao,
        pesquisa: pesquisa,
      })
    );
  };

  useEffect(() => {
    setFilters({ ...filters });
  }, [filters]);

  const clearFilters = () => {
    dispatch(
      listdocs({
        page: 0,
        size: pageSize,
        dtIni: new Date(),
        dtFim: new Date(),
        idProcesso: 0,
        situacao: '',
        pesquisa: '',
      })
    );
    setFilters({
      dtIni: null,
      dtFim: null,
      idProcesso: null,
      situacao: null,
      pesquisa: null,
    });
  };

  //---------------------------------------------------------------

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (infodocs?.length > 0) {
      localStorage.setItem('infodoc', infodocs.length.toString());
    } else {
      localStorage.setItem('infodoc', '0');
    }
  }, [infodocs]);

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
    'Distribuição',
    'Ações',
    '',
  ];

  const handleCloseUploadFileModal = () => {
    setUploadFileModal(false);
  };

  const handleCloseRequestCopyModal = () => {
    setRequestCopyModal(false);
  };

  const handleCancelDocumentModal = () => {
    setCancelDocumentModal(false);
  };

  const handleDistributionModal = () => {
    setDistributionModal(false);
  };

  const formatDateToString = (date: Date) => {
    console.log(date);

    return '';
    // const day = date.getDate().toString().padStart(2, '0');
    // const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // const year = date.getFullYear().toString();

    // return `${day}/${month}/${year}`;
  };

  const onEditClicked = (id: string, event: React.MouseEvent<HTMLButtonElement>): void => {
    // navigate(`/somepath/${id}`);
    alert('Editar Doc - Em Desenvolvimento!');
  };

  const onViewClicked = (id: string, event: React.MouseEvent<HTMLButtonElement>): void => {
    // navigate(`/somepath/${id}`);
    alert('Visualizar Doc - Em Desenvolvimento!');
  };

  const onPrintClicked = (id: string, event: React.MouseEvent<HTMLButtonElement>): void => {
    // navigate(`/somepath/${id}`);
    alert('Imprimir Doc - Em Desenvolvimento!');
  };

  const onCancelClicked = (id: string, event: React.MouseEvent<HTMLButtonElement>): void => {
    // navigate(`/somepath/${id}`);
    alert('Cancelar Doc - Em Desenvolvimento!');
  };

  const onOpenUploadFileModal = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const userLogin = filterUser(userLoginID);
    console.log(userLogin);
    setUploadFileModal(true);
    // TEM O USUARIO, MAS NAO VEM AS PERMISSOES.
    // TODO:  PEGAR A LISTA DE PROCESSOS E PEDIR AS PERMISSOES PARA PODER VALIDAR AS ACOES DO USUARIO
  };

  const renderTable = () => {
    if (infodocs?.length > 0) {
      return (
        <>
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
                {infodocs?.map((infodoc: InfoDoc) => (
                  <TableRow key={infodoc.codigo}>
                    <Tooltip title={infodoc.titulo}>
                      <TableCell>{infodoc.codigo}</TableCell>
                    </Tooltip>
                    <TableCell>{infodoc.titulo}</TableCell>
                    <TableCell>{infodoc.emissor}</TableCell>
                    <TableCell>{infodoc.revisao}</TableCell>
                    <TableCell>a{/* {formatDateToString(infodoc.dataCricao)} */}</TableCell>
                    <TableCell>{infodoc.areaProcesso}</TableCell>
                    <TableCell>{infodoc.origem}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {getSituacaoIcon(infodoc.enumSituacao).icon}
                        {infodoc.enumSituacao}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {/* {getStatusIcon(infodoc.status).icon} */}
                        {infodoc.status}
                      </Box>
                    </TableCell>
                    <TableCell>{infodoc.distribuicao}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={event => onEditClicked(infodoc.codigo, event)}>
                        <EditIcon sx={{ color: '#e6b200' }} />
                      </IconButton>
                      <IconButton color="primary" onClick={event => onViewClicked(infodoc.codigo, event)}>
                        <VisibilityIcon sx={{ color: '#0EBDCE' }} />
                      </IconButton>
                      <IconButton color="primary" onClick={event => onPrintClicked(infodoc.codigo, event)}>
                        <PrintIcon sx={{ color: '#03AC59' }} />
                      </IconButton>
                      <IconButton color="primary" onClick={event => onCancelClicked(infodoc.codigo, event)}>
                        <CancelIcon sx={{ color: '#FF0000' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Row className="justify-content-center mt-5">
            <Pagination count={10} style={{ width: '370px' }} />
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
    //////////////////////////////////////
    <div className="padding-container">
      <div className="container-style">
        <DistributionDialog
          open={distributionModal}
          handleClose={handleDistributionModal}
          documentTitle="Documento M4-04-001 - Manual da Qualidade Tellescom Revisao - 04"
        />
        <UploadInfoFile open={uploadFileModal} handleClose={handleCloseUploadFileModal} />
        <RequestCopyDialog
          open={requestCopyModal}
          handleClose={handleCloseRequestCopyModal}
          documentTitle="Documento M4-04-001 - Manual da Qualidade Tellescom Revisao - 04"
        />
        <CancelDocumentDialog
          open={cancelDocumentModal}
          handleClose={handleCancelDocumentModal}
          documentTitle="Documento M4-04-001 - Manual da Qualidade Tellescom Revisao - 04"
        />
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">Informação Documentada</Typography>
          <Typography className="link">Consultar Documentos</Typography>
        </Breadcrumbs>
        <h1 className="title">Lista Informações Documentais</h1>

        <div style={{ paddingBottom: '30px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
          <Button
            variant="contained"
            className="primary-button me-2 infodoc-list-form-field"
            style={{ marginRight: '10px', height: '58px' }}
            onClick={event => onOpenUploadFileModal(event)}
          >
            Novo Registro
          </Button>

          <FormControl className="me-2">
            <DatePicker
              selected={filters.dtIni}
              onChange={date => setFilters({ ...filters, dtIni: date })}
              dateFormat="dd/MM/yyyy"
              className="infodoc-list-date-picker mt-4"
              locale="pt-BR"
              id="start-date-picker"
              placeholderText="Data de início"
            />
            <label htmlFor="start-date-picker" className="infodoc-list-date-label">
              Início
            </label>
          </FormControl>
          <FormControl className="infodoc-list-form-field me-2">
            <DatePicker
              selected={filters.dtFim}
              onChange={date => setFilters({ ...filters, dtFim: date })}
              dateFormat={'dd/MM/yyyy'}
              className="infodoc-list-date-picker mt-4"
              placeholderText="Data de fim"
            />
            <label htmlFor="" className="infodoc-list-date-label">
              Fim
            </label>
          </FormControl>
          <FormControl className="infodoc-list-form-field me-2">
            <InputLabel>Processo</InputLabel>
            <Select
              value={filters.idProcesso}
              onChange={e => setFilters({ ...filters, idProcesso: parseInt(e.target.value.toString()) })}
              label="Processo"
            >
              {/* {processes?.map((process, index) => (
                    <MenuItem key={index} value={process.id}>
                      {process.descricao}
                    </MenuItem>
                  ))} */}
            </Select>
          </FormControl>

          {/* <FormControl className="me-2">
            <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={e => setFilters({ ...filters, status: e.target.value })}
                  label="Status"
                >
                  {enums?.docStatus.map((situacao, index) => (
                    <MenuItem key={index} value={status.value}>
                      {status.value}
                    </MenuItem>
                  ))}
                </Select>

          </FormControl> */}

          <FormControl className="infodoc-list-form-field me-2">
            <InputLabel>Situação</InputLabel>
            <Select value={filters.situacao} onChange={e => setFilters({ ...filters, situacao: e.target.value })} label="Situação">
              {statusValues.map(key => (
                <MenuItem value={key}>{StatusEnum[key]}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl id="search-filter">
            <TextField
              className="m-2"
              label="Descrição"
              onChange={event => {
                setFilters({ ...filters, pesquisa: event.target.value });
              }}
              placeholder="Descrição"
              value={filters.pesquisa || ''}
            />
          </FormControl>

          <Button
            variant="contained"
            className="update-button me-2 rnc-list-form-field"
            style={{ height: '49px', width: '60px', marginLeft: '7px' }}
            onClick={handleApplyFilters}
          >
            Pesquisar
          </Button>

          <Button
            variant="contained"
            className="secondary-button me-2 rnc-list-form-field"
            style={{ height: '49px', width: '60px', marginLeft: '7px' }}
            onClick={clearFilters}
          >
            Limpar
          </Button>
        </div>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Formulários" {...a11yProps(0)} />
              <Tab label="Processo" {...a11yProps(1)} />
              <Tab label="Instrução" {...a11yProps(2)} />
              <Tab label="Distribuição" {...a11yProps(3)} />
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
        </Box>
      </div>
    </div>
  );
};

export default InfodocList;
