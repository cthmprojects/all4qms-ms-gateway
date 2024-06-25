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
import { downloadAnexo } from '../../reducers/anexo.reducer';
import UploadInfoFile from '../dialogs/upload-dialog/upload-files';
import { RequestCopyDialog } from '../dialogs/request-copy-dialog/request-copy-dialog';
import { CancelDocumentDialog } from '../dialogs/cancel-document-dialog/cancel-document-dialog';
import { DistributionDialog } from '../dialogs/distribution-dialog/distribution-dialog';
import { Storage } from 'react-jhipster';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { Process } from 'app/modules/rnc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { listEnums } from '../../reducers/enums.reducer';
import UploadInfoFileUpdate from '../dialogs/upload-file-update-dialog/upload-file-update';
import axios from 'axios';

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

const getStatusIcon = status => {
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
};

const InfodocList = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [value, setValue] = useState(0);
  const [distributionModal, setDistributionModal] = useState(false);
  const [uploadFileModal, setUploadFileModal] = useState(false);
  const [requestCopyModal, setRequestCopyModal] = useState(false);
  const [cancelDocumentModal, setCancelDocumentModal] = useState(false);
  const dispatch = useAppDispatch();
  const statusValues = Object.keys(StatusEnum) as Array<keyof typeof StatusEnum>;
  const userLoginID = parseInt(Storage.session.get('ID_USUARIO'));
  const [uploadFileUpdate, setUploadFileUpdate] = useState(false);
  const [idDocUpdating, setIdDocUpdating] = useState(0);

  /**
   * Filters
   */
  const [filters, setFilters] = useState({
    dtIni: null,
    dtFim: null,
    idProcesso: 0,
    origem: null,
    situacao: null,
    pesquisa: null,
  });

  /**
   * Pagination
   */
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalItems, setTotalItems] = useState(10);

  function displayedRowsLabel({ from, to, count }) {
    return `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`;
  }

  const onPageChanged = (event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  const onRowsPerPageChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1);
  };

  useEffect(() => {
    if (page <= 0) {
      return;
    }

    handleApplyFilters();
  }, [page]);

  useEffect(() => {
    const { dtIni, dtFim, idProcesso, origem, situacao } = filters;
    dispatch(
      listdocs({
        dtIni: dtIni?.toISOString(),
        dtFim: dtFim?.toISOString(),
        idProcesso,
        origem,
        situacao,
        size: pageSize,
        page: 0,
      })
    );

    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    dispatch(getProcesses());
    dispatch(listEnums());
  }, []);

  useEffect(() => {
    handleApplyFilters();
  }, [filters]);

  const infodocs: Array<InfoDoc> = useAppSelector(state => state.all4qmsmsgateway.infodoc.entities);
  const users = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  const processes = useAppSelector<Array<Process>>(state => state.all4qmsmsgatewayrnc.process.entities);
  const enums = useAppSelector(state => state.all4qmsmsgateway.enums.enums);

  const filterUser = (id: number) => {
    if (!users || users.length <= 0) {
      return '-';
    }

    if (id) {
      return users.find(user => user.id === id);
    }

    return '-';
  };

  const filterProcess = (id: number) => {
    if (!processes || processes.length <= 0) {
      return '-';
    }

    if (id) {
      return processes.find(process => process.id === id).nome;
    }

    return '-';
  };

  const filterOrigin = (type: string) => {
    if (!enums || enums.origem.length <= 0) {
      return '-';
    }

    if (type) {
      return enums.origem.find(o => o.nome === type).valor;
    }

    return '-';
  };

  //---------------------------------------------------------------

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  let currentInfodoc = infodocs[0];

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
    if (!date) {
      return '';
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
  };

  const onEditClicked = (id: number, event: React.MouseEvent<HTMLButtonElement>): void => {
    // navigate(`upload-file/update/${id}`);
    setIdDocUpdating(id);
    setUploadFileUpdate(true);
  };

  const onViewClicked = (infodocEvent: InfoDoc, event: React.MouseEvent<HTMLButtonElement>): void => {
    downloadDocument(infodocEvent.doc?.idArquivo);
  };

  const onPrintClicked = (infodocEvent: InfoDoc, event: React.MouseEvent<HTMLButtonElement>): void => {
    // navigate(`/somepath/${id}`);
    currentInfodoc = infodocEvent;
    alert('Imprimir Doc - Em Desenvolvimento!');
  };

  const onCancelClicked = (infodocEvent: InfoDoc, event: React.MouseEvent<HTMLButtonElement>): void => {
    // navigate(`/somepath/${id}`);
    // alert('Cancelar Doc - Em Desenvolvimento!');
    currentInfodoc = infodocEvent;
    setCancelDocumentModal(true);
  };

  const handleCloseUpdateModal = () => {
    setUploadFileUpdate(false);
  };

  const downloadDocument = async (id: number) => {
    if (id) {
      const downloadUrl = `services/all4qmsmsinfodoc/api/infodoc/anexos/download/${id}`;

      await axios
        .request({
          responseType: 'arraybuffer',
          url: downloadUrl,
          method: 'get',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        })
        .then(result => {
          var fileDownload = require('js-file-download');
          let fileName = result.headers['content-disposition'].split(';')[1];
          fileName = fileName.split('=')[1];

          const file = new Blob([result.data], { type: 'application/octet-stream' });

          fileDownload(file, `${fileName}.pdf`);
        });
    }
  };

  const onOpenUploadFileModal = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const userLogin = filterUser(userLoginID);
    setUploadFileModal(true);
    // TEM O USUARIO, MAS NAO VEM AS PERMISSOES.
    // TODO:  PEGAR A LISTA DE PROCESSOS E PEDIR AS PERMISSOES PARA PODER VALIDAR AS ACOES DO USUARIO
  };

  const handleApplyFilters = () => {
    const { dtIni, dtFim, idProcesso, origem, situacao, pesquisa } = filters;

    dispatch(
      listdocs({
        dtIni: dtIni?.toISOString(),
        dtFim: dtFim?.toISOString(),
        idProcesso,
        origem,
        situacao,
        size: pageSize,
        pesquisa,
        page: page,
      })
    );
  };

  const clearFilters = () => {
    setFilters({
      dtIni: null,
      dtFim: null,
      idProcesso: 0,
      origem: null,
      situacao: null,
      pesquisa: null,
    });
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
                  <TableRow key={infodoc.doc.id}>
                    <Tooltip title={infodoc.doc.titulo}>
                      <TableCell>{infodoc.doc.codigo}</TableCell>
                    </Tooltip>
                    <TableCell>{infodoc.doc.titulo}</TableCell>
                    <TableCell>{filterUser(infodoc.doc.idUsuarioCriacao)?.nome}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>{infodoc.doc.dataCricao ? formatDateToString(new Date(infodoc.doc.dataCricao)) : '-'}</TableCell>
                    <TableCell>{filterProcess(infodoc.doc.idProcesso)}</TableCell>
                    <TableCell>{filterOrigin(infodoc.doc.origem)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{getSituacaoIcon(infodoc.doc.enumSituacao).icon}</Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{getStatusIcon(infodoc.doc.status).icon}</Box>
                    </TableCell>
                    <TableCell>
                      <IconButton title="Editar" color="primary" onClick={event => onEditClicked(infodoc.doc.id, event)}>
                        <EditIcon sx={{ color: '#e6b200' }} />
                      </IconButton>
                      <IconButton title="Visualizar" color="primary" onClick={event => onViewClicked(infodoc, event)}>
                        <VisibilityIcon sx={{ color: '#0EBDCE' }} />
                      </IconButton>
                      <IconButton title="Imprimir" color="primary" onClick={event => onPrintClicked(infodoc, event)}>
                        <PrintIcon sx={{ color: '#03AC59' }} />
                      </IconButton>
                      <IconButton title="Cancelar" color="primary" onClick={event => onCancelClicked(infodoc, event)}>
                        <CancelIcon sx={{ color: '#FF0000' }} />
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
        <UploadInfoFileUpdate open={uploadFileUpdate} handleClose={handleCloseUpdateModal} id={idDocUpdating} />
        <DistributionDialog open={distributionModal} handleClose={handleDistributionModal} documentTitle={currentInfodoc?.doc?.titulo} />
        <UploadInfoFile open={uploadFileModal} handleClose={handleCloseUploadFileModal} />
        <RequestCopyDialog open={requestCopyModal} handleClose={handleCloseRequestCopyModal} documentTitle={currentInfodoc?.doc?.titulo} />
        <CancelDocumentDialog
          open={cancelDocumentModal}
          handleClose={handleCancelDocumentModal}
          documentTitle={currentInfodoc?.doc?.titulo}
          infodoc={currentInfodoc}
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
            title="Novo Registro"
          >
            Novo Registro
          </Button>

          <FormControl className="me-2">
            <DatePicker
              selected={filters.dtIni}
              onChange={date => setFilters({ ...filters, dtIni: date })}
              dateFormat="dd/MM/yyyy"
              className="infodoc-list-date-picker mt-4"
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
              <MenuItem value={0}>Selecionar</MenuItem>
              {processes?.map((process, index) => (
                <MenuItem key={index} value={process.id}>
                  {process.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <TextField
              label="Pesquisa"
              style={{ minWidth: '20vw' }}
              onChange={event => {
                setFilters({ ...filters, pesquisa: event.target.value });
              }}
              placeholder="Descrição"
              value={filters.pesquisa || ''}
            />
          </FormControl>

          <Button
            variant="contained"
            className="secondary-button me-2 rnc-list-form-field"
            style={{ height: '49px', width: '60px', marginLeft: '7px' }}
            onClick={clearFilters}
            title="Limpar"
          >
            Limpar
          </Button>
        </div>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Formulários" {...a11yProps(0)} />
              {/* <Tab label="Processo" {...a11yProps(1)} />
              <Tab label="Instrução" {...a11yProps(2)} />
              <Tab label="Distribuição" {...a11yProps(3)} /> */}
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            {renderTable()}
          </CustomTabPanel>
          {/* <CustomTabPanel value={value} index={1}>
            {renderTable()}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            {renderTable()}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            {renderTable()}
          </CustomTabPanel> */}
        </Box>
      </div>
    </div>
  );
};

export default InfodocList;
