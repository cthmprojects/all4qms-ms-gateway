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
import ShareIcon from '@mui/icons-material/Share';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptIcon from '@mui/icons-material/Receipt';
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
import ControlledCopyTab from './tabs/controlled-copy-tab';
import DistributionTab from './tabs/distribution-tab';
import DocumentsTable from './tabs/documents-table';
import FilterSection from './components/filter-section';
import { IUser } from 'app/shared/model/user.model';
import { toast } from 'react-toastify';

interface TabPanelProps {
  children?: React.ReactNode;
  index: TabIdentifier;
  value: TabIdentifier;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(id: TabIdentifier) {
  return {
    id: `simple-tab-${id}`,
    'aria-controls': `simple-tabpanel-${id}`,
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

const getTipoControleText = (tipo: string) => {
  switch (tipo) {
    case 'C':
      return 'CONTROLADA';
    case 'N':
      return 'NÃO CONTROLADA';
    default:
      return tipo || '-';
  }
};

enum TabIdentifier {
  COPIA_CONTROLADA = 'COPIA_CONTROLADA',
  DISTRIBUICAO = 'DISTRIBUICAO',
  SOLICITACAO_VALIDACAO = 'SOLICITACAO_VALIDACAO',
  APROVACAO = 'APROVACAO',
  CANCELADO = 'CANCELADO',
  OBSOLETO = 'OBSOLETO',
  HOMOLOGADOS = 'HOMOLOGADOS',
}

interface TabInfo {
  id: TabIdentifier;
  label: string;
  situacao: string;
  requiresPermission?: string[];
}

const TABS_CONFIG: TabInfo[] = [
  { id: TabIdentifier.COPIA_CONTROLADA, label: 'Cópia Controlada', situacao: 'D' },
  { id: TabIdentifier.DISTRIBUICAO, label: 'Distribuição', situacao: 'D', requiresPermission: [AUTHORITIES.SGQ] },
  {
    id: TabIdentifier.SOLICITACAO_VALIDACAO,
    label: 'Solicitação e Validação',
    situacao: 'E',
    requiresPermission: [AUTHORITIES.ADMIN, AUTHORITIES.SGQ, 'ROLE_EMISSOR', 'ROLE_APROVADOR'],
  },
  {
    id: TabIdentifier.APROVACAO,
    label: 'Aprovação',
    situacao: 'R',
    requiresPermission: [AUTHORITIES.ADMIN, AUTHORITIES.SGQ, 'ROLE_APROVADOR'],
  },
  { id: TabIdentifier.CANCELADO, label: 'Cancelado', situacao: 'C', requiresPermission: [AUTHORITIES.SGQ] },
  { id: TabIdentifier.OBSOLETO, label: 'Obsoleto', situacao: 'O', requiresPermission: [AUTHORITIES.SGQ] },
  { id: TabIdentifier.HOMOLOGADOS, label: 'Homologados', situacao: 'H', requiresPermission: [AUTHORITIES.SGQ] },
];

interface DocumentsTableProps {
  documents: InfoDoc[];
  page: number;
  pageSize: number;
  totalItems: number;
  isSGQ: boolean;
  userQMSId: number;
  users: IUser[];
  processes: Process[];
  enums: any;
  onPageChange: (event: React.ChangeEvent<unknown>, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEditClick: (infodoc: InfoDoc) => void;
  onViewClick: (infodoc: InfoDoc) => void;
  onDownloadClick: (infodoc: InfoDoc) => void;
  onPrintClick: (infodoc: InfoDoc) => void;
  onCancelClick: (infodoc: InfoDoc) => void;
  openDocToValidation: (event: React.MouseEvent, infodoc: InfoDoc) => void;
  currentTab: number;
}

const InfodocList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [value, setValue] = useState(0);
  const [distributionModal, setDistributionModal] = useState(false);
  const [uploadFileModal, setUploadFileModal] = useState(false);
  const [requestCopyModal, setRequestCopyModal] = useState(false);
  const [cancelDocumentModal, setCancelDocumentModal] = useState(false);
  const statusValues = Object.keys(StatusEnum) as Array<keyof typeof StatusEnum>;
  const userLoginID = parseInt(Storage.session.get('ID_USUARIO'));
  const [userQMS, setUserQMS] = useState<UserQMS>(JSON.parse(Storage.session.get('USUARIO_QMS')));
  const [uploadFileUpdate, setUploadFileUpdate] = useState(false);
  const [usersSGQ, setUsersSGQ] = useState<[]>([]);
  const [idDocUpdating, setIdDocUpdating] = useState(0);
  const [isSGQ, setIsSGQ] = useState(false);
  const [currentInfodoc, setCurrentInfodoc] = useState<InfoDoc>();
  const [selectedTab, setSelectedTab] = useState<TabIdentifier>(TabIdentifier.COPIA_CONTROLADA);

  const infodocs: Array<InfoDoc> = useAppSelector(state => state.all4qmsmsgateway.infodoc.entities);
  const users = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  const processes = useAppSelector<Array<Process>>(state => state.all4qmsmsgatewayrnc.process.entities);
  const enums = useAppSelector(state => state.all4qmsmsgateway.enums.enums);
  const totalItemsDoc = useAppSelector(state => state.all4qmsmsgateway.infodoc.totalItems);
  const totalItemsDist = useAppSelector(state => state.all4qmsmsgateway.distribuicao.totalItems);
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

  const onPageChanged = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const onRowsPerPageChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const totalItems = value === 0 ? totalItemsDist : totalItemsDoc;
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

    dispatch(listarDistribuicao({ page, size: pageSize, sort: 'id,DESC' }));

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

  const switchSituationByTab = (tabId: TabIdentifier): string => {
    const tab = TABS_CONFIG.find(t => t.id === tabId);
    return tab?.situacao || 'H';
  };

  const handleChange = (event: React.SyntheticEvent | null, newTabId: TabIdentifier) => {
    const type: string = switchSituationByTab(newTabId);

    if (type === 'D' || newTabId === TabIdentifier.COPIA_CONTROLADA || newTabId === TabIdentifier.DISTRIBUICAO) {
      dispatch(listarDistribuicao({ page, size: pageSize, sort: 'id,DESC' }));
      setSelectedTab(newTabId);
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
    setSelectedTab(newTabId);
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

  const columnsDistribuicao = ['Código', 'Título', 'Revisão', 'Data', 'Área/Processo', 'Status Doc', 'Ações'];

  const columnsDistribuicaoDetalhada = [
    'Tipo Controle',
    'Status Doc',
    'Código',
    'Título',
    'Revisão',
    'Cóp. Eletr.',
    'Cóp. Física',
    'Recebido por',
    'Dt. Entrega',
    'Devolvido por',
    'Dt. Devolução',
    'Situação',
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
    handleChange(null, TabIdentifier.APROVACAO);
  };

  const handleDistributionModal = () => {
    setDistributionModal(false);
    handleChange(null, TabIdentifier.COPIA_CONTROLADA);
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

  const onEditClicked = (infodoc: InfoDoc): void => {
    if (infodoc.doc.id) {
      setIdDocUpdating(infodoc.doc.id);
      setUploadFileUpdate(true);
    }
  };

  const onViewClicked = (infodoc: InfoDoc): void => {
    if (infodoc.doc?.idArquivo) {
      openViewDocument(infodoc.doc.idArquivo);
    }
  };

  const onDownloadClicked = (infodoc: InfoDoc): void => {
    if (infodoc.doc?.idArquivo) {
      downloadDocument(infodoc.doc.idArquivo);
    }
  };

  const onPrintClicked = (infodoc: InfoDoc): void => {
    setCurrentInfodoc(infodoc);
    setDistributionModal(true);
  };

  const onCancelClicked = (infodoc: InfoDoc): void => {
    setCurrentInfodoc(infodoc);
    setCancelDocumentModal(true);
  };

  const onCancelDistribuition = async (distribuition: DistribuicaoCompleta, event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    if (distribuition.idDocumentacao) {
      const resDoc = await dispatch(getInfoDocById(distribuition.idDocumentacao));
      const infoDoc = resDoc.payload as InfoDoc;
      setCurrentInfodoc(infoDoc);
      setCancelDocumentModal(true);
    }
  };

  const handleCloseUpdateModal = () => {
    setUploadFileUpdate(false);
  };

  const openViewDocument = async (id: number) => {
    if (!id) return;

    const downloadUrl = `services/all4qmsmsinfodoc/api/infodoc/anexos/download/${id}`;

    try {
      const response = await axios.get(downloadUrl, {
        responseType: 'blob',
      });

      // Extrai o nome do arquivo do header no formato específico do seu sistema
      const contentDisposition = response.headers['content-disposition'];
      let fileName = contentDisposition?.split(';')[1];
      fileName = fileName?.split('=')[1];
      fileName = fileName?.split('_').slice(5).join('_')?.replace(/"/g, '');

      if (!fileName) {
        fileName = `arquivo-${id}`;
      }

      const contentType = response.headers['content-type'];
      const isViewableType =
        contentType === 'application/pdf' || contentType === 'image/jpeg' || contentType === 'image/jpg' || contentType === 'image/png';

      if (isViewableType) {
        // Cria o blob e abre em nova aba
        const blob = new Blob([response.data], { type: contentType });
        const fileUrl = URL.createObjectURL(blob);
        const newWindow = window.open(fileUrl, '_blank');

        // Fallback caso o navegador bloqueie o window.open
        if (!newWindow) {
          toast.error('O navegador bloqueou a abertura do documento. Por favor, permita popups para este site.');
        }

        setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
      } else {
        // Para outros tipos de arquivo, faz o download
        const blob = new Blob([response.data], { type: contentType });
        import('js-file-download').then(fileDownload => {
          fileDownload.default(blob, fileName);
        });
        toast.info('Iniciando download do arquivo...');
      }
    } catch (error) {
      console.error('Erro ao processar o documento:', error);
      toast.error('Erro ao processar o documento. Tente novamente.');
    }
  };

  const downloadDocument = async (id: number) => {
    if (!id) return;

    const downloadUrl = `services/all4qmsmsinfodoc/api/infodoc/anexos/download/${id}`;

    try {
      const response = await axios.request({
        responseType: 'arraybuffer',
        url: downloadUrl,
        method: 'get',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      // Extrair o nome do arquivo do header
      let fileName = response.headers['content-disposition']?.split(';')[1];
      fileName = fileName?.split('=')[1];
      fileName = fileName?.split('_').slice(5).join('_');

      // Remover aspas se existirem
      fileName = fileName?.replace(/"/g, '') || `arquivo-${id}`;

      // Determinar o tipo do arquivo pelo Content-Type
      const contentType = response.headers['content-type'];
      const file = new Blob([response.data], { type: contentType });

      // Usar o nome do arquivo original no download
      import('js-file-download').then(fileDownload => {
        fileDownload.default(file, fileName);
      });
    } catch (error) {
      console.error('Erro ao baixar o documento:', error);
      toast.error('Erro ao baixar o documento. Tente novamente.');
    }
  };

  const onOpenUploadFileModal = (): void => {
    setUploadFileModal(true);
  };

  const openDocToValidation = (event: React.MouseEvent, infodoc: InfoDoc): void => {
    if (infodoc?.movimentacao?.enumStatus === EnumStatusDoc.VALIDACAO || infodoc?.movimentacao?.enumStatus === EnumStatusDoc.VALIDAREV) {
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

  const handleApplyFilters = () => {
    const { dtIni, dtFim, idProcesso, origem, situacao, pesquisa } = filters;

    const _situacao = switchSituationByTab(selectedTab);

    if (_situacao === 'D') {
      dispatch(listarDistribuicao({ page, size: pageSize, sort: 'id,DESC' }));
    } else {
      dispatch(
        listdocs({
          dtIni: dtIni?.toISOString(),
          dtFim: dtFim?.toISOString(),
          idProcesso,
          origem: origem ?? '',
          situacao: _situacao,
          size: pageSize,
          pesquisa: pesquisa ?? '',
          page,
        })
      );
    }
  };

  const clearFilters = () => {
    setFilters({
      dtIni: null,
      dtFim: null,
      idProcesso: 0,
      origem: null,
      situacao: switchSituationByTab(selectedTab),
      pesquisa: null,
    });
  };

  // const verifyUser = (doc: InfoDoc) => doc.doc.idUsuarioCriacao == userLoginID

  const handleClickDistribuition = async (distribuicao: DistribuicaoCompleta) => {
    if (distribuicao.idDocumentacao) {
      const resDoc = await dispatch(getInfoDocById(distribuicao.idDocumentacao));
      const infoDoc = resDoc.payload as InfoDoc;
      if (infoDoc?.doc?.idArquivo) {
        openViewDocument(infoDoc.doc.idArquivo);
      }
    }
  };

  const handleDownloadDistribuition = async (distribuicao: DistribuicaoCompleta) => {
    if (distribuicao.idDocumentacao) {
      const resDoc = await dispatch(getInfoDocById(distribuicao.idDocumentacao));
      const infoDoc = resDoc.payload as InfoDoc;
      if (infoDoc?.doc?.idArquivo) {
        downloadDocument(infoDoc.doc.idArquivo);
      }
    }
  };

  const renderTable = () => {
    return (
      <DocumentsTable
        documents={infodocs}
        page={page}
        pageSize={pageSize}
        totalItems={totalItemsDoc}
        isSGQ={isSGQ}
        userQMSId={userQMS.id}
        users={users}
        processes={processes}
        enums={enums}
        onPageChange={onPageChanged}
        onRowsPerPageChange={onRowsPerPageChanged}
        onEditClick={onEditClicked}
        onViewClick={onViewClicked}
        onDownloadClick={onDownloadClicked}
        onPrintClick={onPrintClicked}
        onCancelClick={onCancelClicked}
        openDocToValidation={openDocToValidation}
        currentTab={TABS_CONFIG.findIndex(tab => tab.id === selectedTab)}
      />
    );
  };

  const renderTableDistribuition = () => {
    return (
      <ControlledCopyTab
        distribuitions={distribuitions}
        userProcessos={userQMS.processos}
        page={page}
        pageSize={pageSize}
        onPageChange={onPageChanged}
        onRowsPerPageChange={onRowsPerPageChanged}
        handleClickDistribuition={handleClickDistribuition}
        handleDownloadDistribuition={handleDownloadDistribuition}
      />
    );
  };

  const renderTableDistribuicaoDetalhada = () => {
    return (
      <DistributionTab
        distribuitions={distribuitions}
        userProcessos={userQMS.processos}
        page={page}
        pageSize={pageSize}
        onPageChange={onPageChanged}
        onRowsPerPageChange={onRowsPerPageChanged}
        handleClickDistribuition={handleClickDistribuition}
        handleDownloadDistribuition={handleDownloadDistribuition}
      />
    );
  };

  const account = useAppSelector(state => state.authentication.account);
  const isSgq = hasAnyAuthority(account.authorities, [AUTHORITIES.SGQ]);
  const canAccessSolicitacaoValidacao = hasAnyAuthority(account.authorities, [
    AUTHORITIES.ADMIN,
    AUTHORITIES.SGQ,
    'ROLE_EMISSOR',
    'ROLE_APROVADOR',
  ]);
  const canAccessAprovacao = hasAnyAuthority(account.authorities, [AUTHORITIES.ADMIN, AUTHORITIES.SGQ, 'ROLE_APROVADOR']);

  return (
    // ////////////////////////////////////
    <div className="padding-container">
      <div className="container-style">
        <UploadInfoFileUpdate open={uploadFileUpdate} handleClose={handleCloseUpdateModal} id={idDocUpdating} />
        <DistributionDialog
          open={distributionModal}
          handleClose={handleDistributionModal}
          documentTitle={currentInfodoc?.doc?.titulo}
          idDoc={currentInfodoc?.doc.id}
        />
        <UploadInfoFile open={uploadFileModal} handleClose={handleCloseUploadFileModal} />
        <RequestCopyDialog open={requestCopyModal} handleClose={handleCloseRequestCopyModal} documentTitle={currentInfodoc?.doc?.titulo} />
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

        <FilterSection
          filters={filters}
          processes={processes}
          onFilterChange={setFilters}
          onClearFilters={clearFilters}
          onNewRegister={onOpenUploadFileModal}
        />

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={selectedTab} onChange={handleChange} aria-label="basic tabs example">
              {TABS_CONFIG.map(tab => {
                if (!tab.requiresPermission || hasAnyAuthority(account.authorities, tab.requiresPermission)) {
                  return <Tab key={tab.id} label={tab.label} value={tab.id} />;
                }
                return null;
              })}
            </Tabs>
          </Box>
          {TABS_CONFIG.map(tab => {
            if (!tab.requiresPermission || hasAnyAuthority(account.authorities, tab.requiresPermission)) {
              return (
                <CustomTabPanel key={tab.id} value={selectedTab} index={tab.id}>
                  {tab.id === TabIdentifier.COPIA_CONTROLADA && renderTableDistribuition()}
                  {tab.id === TabIdentifier.DISTRIBUICAO && renderTableDistribuicaoDetalhada()}
                  {[
                    TabIdentifier.SOLICITACAO_VALIDACAO,
                    TabIdentifier.APROVACAO,
                    TabIdentifier.CANCELADO,
                    TabIdentifier.OBSOLETO,
                    TabIdentifier.HOMOLOGADOS,
                  ].includes(tab.id) && renderTable()}
                </CustomTabPanel>
              );
            }
            return null;
          })}
        </Box>
      </div>
    </div>
  );
};

export default InfodocList;
