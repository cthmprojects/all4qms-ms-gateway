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
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import InfoIcon from '@mui/icons-material/Info';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import './infodoc.css';
import { EnumStatusDoc, EnumTipoMovDoc, InfoDoc, StatusEnum } from '../../models';
import { getInfoDocById, listdocs } from '../../reducers/infodoc.reducer';
import UploadInfoFile from '../dialogs/upload-dialog/upload-files';
import { RequestCopyDialog } from '../dialogs/request-copy-dialog/request-copy-dialog';
import { CancelDocumentDialog } from '../dialogs/cancel-document-dialog/cancel-document-dialog';
import { DistributionDialog } from '../dialogs/distribution-dialog/distribution-dialog';
import { Storage } from 'react-jhipster';
import { getUsers, UserQMS } from 'app/entities/usuario/reducers/usuario.reducer';
import { getUsersAsAdminSGQ } from 'app/modules/administration/user-management/user-management.reducer';
import { Process } from 'app/modules/rnc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { listEnums } from '../../reducers/enums.reducer';
import UploadInfoFileUpdate from '../dialogs/upload-file-update-dialog/upload-file-update';
import axios, { AxiosResponse } from 'axios';
import { getUsersAsGQ } from '../../../../entities/usuario/usuario.reducer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { listarDistribuicao } from '../../reducers/distribuicao.reducer';
import { DistribuicaoCompleta } from '../../models/distribuicao';

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
    case 'D':
      return { icon: <CancelIcon />, text: 'Em Distribuição' };
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
  const [userQMS, setUserQMS] = useState<UserQMS>(JSON.parse(Storage.session.get('USUARIO_QMS')));
  const [uploadFileUpdate, setUploadFileUpdate] = useState(false);
  const [usersSGQ, setUsersSGQ] = useState<[]>([]);
  const [idDocUpdating, setIdDocUpdating] = useState(0);
  const [isSGQ, setIsSGQ] = useState(false);
  const [currentInfodoc, setCurrentInfodoc] = useState<InfoDoc>();

  const infodocs: Array<InfoDoc> = useAppSelector(state => state.all4qmsmsgateway.infodoc.entities);
  const users = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  const processes = useAppSelector<Array<Process>>(state => state.all4qmsmsgatewayrnc.process.entities);
  const enums = useAppSelector(state => state.all4qmsmsgateway.enums.enums);
  const totalItems = useAppSelector(state => state.all4qmsmsgateway.infodoc.totalItems);
  const distribuitions: Array<DistribuicaoCompleta> = useAppSelector(state => state.all4qmsmsgateway.distribuicao.entities);

  /**
   * Filters
   */
  const [filters, setFilters] = useState({
    dtIni: null,
    dtFim: null,
    idProcesso: 0,
    origem: null,
    situacao: 'H',
    pesquisa: null,
  });

  /**
   * Pagination
   */
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(5);

  function displayedRowsLabel({ from, to, count }) {
    return `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`;
  }

  const onPageChanged = (event: React.ChangeEvent<unknown>, page: number) => {
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
    const resUsers = await dispatch(getUsersAsGQ('ROLE_SGQ'));
    const users_ = (resUsers.payload as AxiosResponse).data || [];

    const filteredUser = users.filter(user => users_.some(firstUser => firstUser.id === user.user.id));
    setUsersSGQ(filteredUser);
  };

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

    dispatch(listarDistribuicao({ page: page, size: pageSize, sort: 'id,DESC' }));

    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' })).then(() => {
      getUsersSGQ();
    });
    dispatch(getProcesses());
    dispatch(listEnums());

    const roles = Storage.local.get('ROLE');
    const _isSGQ = ['ROLE_ADMIN', 'ROLE_SGQ'].some(item => roles.includes(item));
    setIsSGQ(_isSGQ);
  }, []);

  useEffect(() => {
    handleApplyFilters();
  }, [filters, page, pageSize, cancelDocumentModal]);

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

  // ---------------------------------------------------------------

  // D (Distribuir),
  // E (Edicao),
  // R (Revisao),
  // O (Obsoleto),
  // C (Cancelado)
  // H (Homologado),

  const switchSituationByTab = (newValue: number) => {
    let type = '';
    switch (newValue) {
      case 0:
        type = 'D';
        break;
      case 1:
        type = 'E';
        break;
      case 2:
        type = 'R';
        break;
      case 3:
        type = 'C';
        break;
      case 4:
        type = 'O';
        break;
      case 5:
        type = 'H';
        break;
      default:
        return 'H';
    }

    return type;
  };

  const handleChange = (event: React.SyntheticEvent | null, newValue: number) => {
    const type: string = switchSituationByTab(newValue);

    if (type == 'D') {
      dispatch(listarDistribuicao({ page: page, size: pageSize, sort: 'id,DESC' }));
      setValue(newValue);
      return;
    }
    const { dtIni, dtFim, idProcesso, origem, situacao } = filters;
    dispatch(
      listdocs({
        dtIni: dtIni?.toISOString(),
        dtFim: dtFim?.toISOString(),
        idProcesso,
        origem,
        situacao: type,
        size: pageSize,
        page: 0,
      })
    );

    setValue(newValue);
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

  const columnsDistribuicao = [
    'Código',
    'Título',
    // 'Emissor',
    'Revisão',
    'Data',
    'Área/Processo',
    // 'Origem',
    'Status',
    // 'Status',
    // 'Distribuição',
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
    handleChange(null, 3);
  };

  const handleDistributionModal = () => {
    setDistributionModal(false);
    handleChange(null, 0);
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

  const onEditClicked = (infodoc: InfoDoc, event: React.MouseEvent<HTMLButtonElement>): void => {
    setIdDocUpdating(infodoc.doc.id!!);
    setUploadFileUpdate(true);

    // H - homolog
    // R - revisão
    // O - obsoleto
    // C - cancelado
  };

  const openDocToValidation = (event, infodoc: InfoDoc) => {
    // console.log(infodoc);

    if (
      infodoc?.movimentacao?.enumStatus === EnumStatusDoc.VALIDACAO ||
      infodoc?.movimentacao?.enumStatus === EnumStatusDoc.VALIDAREV
      // || (infodoc?.movimentacao?.enumStatus === EnumStatusDoc.REVISAO &&  infodoc?.movimentacao?.enumTipoMovDoc == EnumTipoMovDoc.EMITIR)
    ) {
      navigate(`/infodoc/validation/${infodoc.doc.id}`);
    } else if (
      infodoc?.movimentacao?.enumStatus === EnumStatusDoc.APROVACAO ||
      infodoc?.movimentacao?.enumStatus === EnumStatusDoc.APROVAREV ||
      infodoc?.movimentacao?.enumStatus === EnumStatusDoc.CANCELAMENTO
    ) {
      navigate(`/infodoc/approval/${infodoc.doc.id}`);
    } else if (infodoc?.movimentacao?.enumStatus === EnumStatusDoc.EMISSAO) {
      navigate(`upload-file/update/${infodoc.doc.id}/${infodoc.doc.idArquivo}`);
    }
  };

  const onViewClicked = (infodocEvent: InfoDoc, event: React.MouseEvent<HTMLButtonElement>): void => {
    downloadDocument(infodocEvent.doc?.idArquivo!!);
  };

  const onPrintClicked = (infodocEvent: InfoDoc, event: React.MouseEvent<HTMLButtonElement>): void => {
    // navigate(`/somepath/${id}`);
    setCurrentInfodoc(infodocEvent);
    setDistributionModal(true);
    // alert('Imprimir Doc - Em Desenvolvimento!');
  };

  const onCancelClicked = (infodocEvent: InfoDoc, event: React.MouseEvent<HTMLButtonElement>): void => {
    // navigate(`/somepath/${id}`);
    // alert('Cancelar Doc - Em Desenvolvimento!');
    setCurrentInfodoc(infodocEvent);
    setCancelDocumentModal(true);
  };

  const onCancelDistribuition = async (distribuition: DistribuicaoCompleta, event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    const resDoc = await dispatch(getInfoDocById(distribuition.idDocumentacao!!));
    const infoDoc = resDoc.payload as InfoDoc;

    setCurrentInfodoc(infoDoc);
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
          const fileDownload = require('js-file-download');
          let fileName = result.headers['content-disposition'].split(';')[1];
          fileName = fileName.split('=')[1];
          fileName = fileName.split('_').slice(5).join('_');

          const file = new Blob([result.data], { type: 'application/octet-stream' });

          fileDownload(file, `${fileName}`);
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

    const _situacao = switchSituationByTab(value);

    dispatch(
      listdocs({
        dtIni: dtIni?.toISOString(),
        dtFim: dtFim?.toISOString(),
        idProcesso,
        origem,
        situacao: _situacao,
        size: pageSize,
        pesquisa,
        page,
      })
    );
  };

  const clearFilters = () => {
    setFilters({
      dtIni: null,
      dtFim: null,
      idProcesso: 0,
      origem: null,
      situacao: switchSituationByTab(value),
      pesquisa: null,
    });
  };

  // const verifyUser = (doc: InfoDoc) => doc.doc.idUsuarioCriacao == userLoginID

  const handleClickDistribuition = (distribuicao: DistribuicaoCompleta) => {
    navigate(`receive/${distribuicao.idDistribuicaoDoc}`, { state: distribuicao });
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
                    <TableCell align={col != 'Ações' ? 'left' : 'center'}>{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {infodocs
                  ?.filter((infodoc: InfoDoc) => infodoc.doc.idUsuarioCriacao === userQMS.id || isSGQ)
                  ?.map((infodoc: InfoDoc) => (
                    <TableRow key={infodoc.doc.id} style={{ cursor: infodoc.doc.enumSituacao !== 'H' ? 'pointer' : 'auto' }}>
                      <Tooltip title={infodoc.doc.descricaoDoc}>
                        <TableCell>{infodoc.doc.codigo}</TableCell>
                      </Tooltip>
                      <TableCell onClick={event => openDocToValidation(event, infodoc)}>{infodoc.doc.titulo}</TableCell>
                      <TableCell onClick={event => openDocToValidation(event, infodoc)}>
                        {filterUser(infodoc.doc.idUsuarioCriacao)?.nome}
                      </TableCell>
                      <TableCell onClick={event => openDocToValidation(event, infodoc)}>{infodoc.doc.revisao ?? 0}</TableCell>
                      <TableCell onClick={event => openDocToValidation(event, infodoc)}>
                        {infodoc.doc.dataCricao ? formatDateToString(new Date(infodoc.doc.dataCricao)) : '-'}
                      </TableCell>
                      <TableCell onClick={event => openDocToValidation(event, infodoc)}>{filterProcess(infodoc.doc.idProcesso)}</TableCell>
                      <TableCell onClick={event => openDocToValidation(event, infodoc)}>{filterOrigin(infodoc.doc.origem)}</TableCell>
                      <TableCell onClick={event => openDocToValidation(event, infodoc)}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {getSituacaoIcon(infodoc?.doc.enumSituacao).text}
                        </Box>
                      </TableCell>
                       {/* <TableCell onClick={event => openDocToValidation(event, infodoc)}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{getStatusIcon(infodoc.doc.status).icon}</Box>
                    </TableCell> */}
                      <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                        <IconButton
                          title="Revisar"
                          color="primary"
                          disabled={infodoc.doc.enumSituacao !== 'H' || !isSGQ}
                          onClick={event => onEditClicked(infodoc, event)}
                          // onClick={event => openDocToValidation(event, infodoc)}
                        >
                          <EditIcon sx={{ color: infodoc.doc.enumSituacao !== 'H' || !isSGQ ? '#cacaca' : '#e6b200' }} />
                        </IconButton>
                        <IconButton id="btn-view" title="Visualizar" color="primary" onClick={event => onViewClicked(infodoc, event)}>
                          <VisibilityIcon sx={{ color: '#0EBDCE' }} />
                        </IconButton>
                        <IconButton
                          id="btn-print"
                          title="Imprimir"
                          color="primary"
                          onClick={event => onPrintClicked(infodoc, event)}
                          // onClick={event => setDistributionModal(true)}
                          disabled={
                            infodoc.doc.enumSituacao === 'C' ||
                            (!isSGQ && infodoc.doc.idUsuarioCriacao !== userQMS.id) ||
                            (infodoc.doc.enumSituacao === 'H' && !isSGQ)
                          }
                          // disabled
                        >
                          <PrintIcon sx={{ color: infodoc.doc.enumSituacao != 'H' ? '#cacaca' : '#03AC59' }} />
                          {/* <PrintIcon sx={{ color: '#cacaca' }} /> */}
                        </IconButton>
                        <Tooltip title="Somente SGQ pode Cancelar documentos homologados">
                          <Box>
                            <IconButton
                              id="btn-cancel"
                              title="Cancelar"
                              color="primary"
                              onClick={event => onCancelClicked(infodoc, event)}
                              // disabled={infodoc.doc.enumSituacao === 'H' && !isSGQ && infodoc.doc.idUsuarioCriacao !== userQMS.id}
                              disabled={infodoc.doc.enumSituacao !== 'H' && !isSGQ}
                            >
                              <CancelIcon
                                sx={{
                                  color:
                                    infodoc.doc.enumSituacao === 'H' && (isSGQ || infodoc.doc.idUsuarioCriacao == userQMS.id)
                                      ? '#FF0000'
                                      : '#cacaca',
                                }}
                              />
                            </IconButton>
                          </Box>
                        </Tooltip>
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

  const renderTableDistribuition = () => {
    if (distribuitions?.length > 0) {
      return (
        <>
          <TableContainer component={Paper} style={{ marginTop: '30px', boxShadow: 'none' }}>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  {columnsDistribuicao.map(col => (
                    // eslint-disable-next-line react/jsx-key
                    <TableCell align={col != 'Ações' ? 'left' : 'center'}>{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {distribuitions
                  ?.filter((distribuicao: DistribuicaoCompleta) =>
                    userQMS.processos.some(processo => processo.id === distribuicao.idProcesso)
                  )
                  ?.map((distribuicao: DistribuicaoCompleta) => (
                    <TableRow
                      key={distribuicao.idDistribuicaoDoc}
                      style={{ cursor: 'pointer' }}
                      onClick={event => handleClickDistribuition(distribuicao)}
                    >
                      <Tooltip title={distribuicao.codigo}>
                        <TableCell>{distribuicao.codigo}</TableCell>
                      </Tooltip>
                      <TableCell>{distribuicao.titulo}</TableCell>
                      {/* <TableCell>{filterUser(distribuicao.idUsuarioDevolucao)?.nome}</TableCell> */}
                      <TableCell>{distribuicao.revisao}</TableCell>
                      <TableCell>{distribuicao.dataEntrega ? formatDateToString(new Date(distribuicao.dataEntrega)) : '-'}</TableCell>
                      <TableCell>{filterProcess(distribuicao.idProcesso)}</TableCell>
                      {/* <TableCell>{filterOrigin('')}</TableCell> */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{distribuicao.enumStatusDoc}</Box>
                      </TableCell>
                      {/* <TableCell onClick={event => openDocToValidation(event, distribuicao)}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{getStatusIcon(distribuicao.doc.status).icon}</Box>
                    </TableCell> */}
                      <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                        {/* <IconButton
                        title="Revisar"
                        color="primary"
                        disabled={distribuicao.doc.enumSituacao !== 'H' || !isSGQ}
                        onClick={event => onEditClicked(distribuicao, event)}
                        // onClick={event => openDocToValidation(event, distribuicao)}
                      >
                        <EditIcon sx={{ color: distribuicao.doc.enumSituacao !== 'H' || !isSGQ ? '#cacaca' : '#e6b200' }} />
                      </IconButton> */}
                        <IconButton id="btn-view" title="Visualizar" color="primary" onClick={event => null}>
                          <VisibilityIcon sx={{ color: '#0EBDCE' }} />
                        </IconButton>
                        {/* <IconButton
                        id="btn-print"
                        title="Imprimir"
                        color="primary"
                        onClick={event => onPrintClicked(infodoc, event)}
                        // onClick={event => setDistributionModal(true)}
                        disabled={
                          infodoc.doc.enumSituacao === 'C' ||
                          (!isSGQ && infodoc.doc.idUsuarioCriacao !== userQMS.id) ||
                          (infodoc.doc.enumSituacao === 'H' && !isSGQ)
                        }
                      >
                        <PrintIcon sx={{ color: '#cacaca' }} />
                      </IconButton> */}
                        <Tooltip title="Somente SGQ e usuario criador podem cancelar">
                          <Box>
                            <IconButton
                              id="btn-cancel"
                              title="Cancelar"
                              color="primary"
                              onClick={event => {
                                event.stopPropagation();
                                onCancelDistribuition(distribuicao, event);
                              }}
                              disabled={!isSGQ && distribuicao.idUsuarioEntrega !== userQMS.id}
                            >
                              <CancelIcon
                                sx={{
                                  color: !isSGQ && distribuicao.idUsuarioEntrega !== userQMS.id ? '#cacaca' : '#FF0000',
                                }}
                              />
                            </IconButton>
                          </Box>
                        </Tooltip>
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

  const account = useAppSelector(state => state.authentication.account);
  const isSgq = hasAnyAuthority(account.authorities, [AUTHORITIES.SGQ]);

  return (
    // ////////////////////////////////////
    <div className="padding-container">
      <div className="container-style">
        <UploadInfoFileUpdate open={uploadFileUpdate} handleClose={handleCloseUpdateModal} id={idDocUpdating} />
        <DistributionDialog
          open={distributionModal}
          handleClose={handleDistributionModal}
          documentTitle={currentInfodoc?.doc?.titulo!!}
          idDoc={currentInfodoc?.doc.id}
        />
        <UploadInfoFile open={uploadFileModal} handleClose={handleCloseUploadFileModal} />
        <RequestCopyDialog
          open={requestCopyModal}
          handleClose={handleCloseRequestCopyModal}
          documentTitle={currentInfodoc?.doc?.titulo!!}
        />
        <CancelDocumentDialog
          open={cancelDocumentModal}
          handleClose={handleCancelDocumentModal}
          documentTitle={currentInfodoc?.doc?.titulo}
          infodoc={currentInfodoc}
          userId={userLoginID}
          usersSGQ={usersSGQ}
        />
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">Informação Documentada</Typography>
          <Typography className="link">Consultar Documentos</Typography>
        </Breadcrumbs>
        <h1 className="title">Lista Informação Documentada</h1>

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
              <Tab label="Cópia Controlada" {...a11yProps(0)} />
              <Tab label="Solicitação e Validação" {...a11yProps(1)} />
              <Tab label="Aprovação" {...a11yProps(2)} />
              {/* <Tab label="Lista Mestra" {...a11yProps(3)} /> */}
              {isSgq && <Tab label="Cancelado" {...a11yProps(4)} />}
              {isSgq && <Tab label="Obsoleto" {...a11yProps(5)} />}
              {isSgq && <Tab label="Homologados" {...a11yProps(6)} />}
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            {renderTableDistribuition()}
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
          {/* <CustomTabPanel value={value} index={4}>
            {renderTable()}
          </CustomTabPanel> */}
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

export default InfodocList;
