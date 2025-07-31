import React from 'react';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import GetAppIcon from '@mui/icons-material/GetApp';
import InfoIcon from '@mui/icons-material/Info';
import { Row } from 'reactstrap';
import { InfoDoc, EnumStatusDoc } from '../../../models';
import { formatDateToString } from '../infodoc-list.utils';
import { Link, useNavigate } from 'react-router-dom';
import { TabIdentifier } from '../tab-identifier';

interface DocumentsTableProps {
  documents: InfoDoc[];
  page: number;
  pageSize: number;
  totalItems: number;
  isSGQ: boolean;
  userQMSId: number;
  users: any[];
  processes: any[];
  enums: any;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEditClick: (doc: InfoDoc) => void;
  onViewClick: (doc: InfoDoc) => void;
  onDownloadClick: (doc: InfoDoc) => void;
  onPrintClick: (doc: InfoDoc) => void;
  onCancelClick: (doc: InfoDoc) => void;
  openDocToValidation: (event: React.MouseEvent, doc: InfoDoc) => void;
  currentTab: TabIdentifier;
}

const columns = ['Código', 'Título', 'Emissor', 'Revisão', 'Data', 'Área/Processo', 'Origem', 'Situação', 'Status', 'Ações'];

function displayedRowsLabel({ from, to, count }) {
  return `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({
  documents,
  page,
  pageSize,
  totalItems,
  isSGQ,
  userQMSId,
  users,
  processes,
  enums,
  onPageChange,
  onRowsPerPageChange,
  onEditClick,
  onViewClick,
  onDownloadClick,
  onPrintClick,
  onCancelClick,
  openDocToValidation,
  currentTab,
}) => {
  const navigate = useNavigate();

  const filterUser = (id: number) => {
    if (!users || users.length <= 0) {
      return '-';
    }

    if (id) {
      return users.find(user => user.id === id)?.nome || '-';
    }

    return '-';
  };

  const filterProcessName = (id: number) => {
    if (!processes || processes.length <= 0) {
      return '-';
    }

    if (id) {
      return processes.find(process => process.id === id)?.nome || '-';
    }

    return '-';
  };

  const filterOrigin = (type: string) => {
    if (!enums || !enums.origem || enums.origem.length <= 0) {
      return '-';
    }

    if (type) {
      return (enums.origem.find(o => o.nome === type)?.valor || '-').toUpperCase();
    }

    return '-';
  };

  const getSituacaoIcon = (situacao: string) => {
    switch (situacao) {
      case 'E':
        return 'Em edição';
      case 'H':
        return 'Homologado';
      case 'R':
        return 'Em revisão';
      case 'O':
        return 'Obsoleto';
      case 'C':
        return 'Cancelado';
      case 'D':
        return 'Em distribuição';
      default:
        return 'Indefinido';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'EMISSAO':
        return 'Em emissão';
      case 'VALIDACAO':
        return 'Em validação';
      case 'APROVACAO':
        return 'Em aprovação';
      case 'REVISAO':
        return 'Em revisão';
      case 'VALIDAREV':
        return 'Em validação da revisão';
      case 'APROVAREV':
        return 'Em aprovação da revisão';
      case 'DISTRIBUICAO':
        return 'Em distribuição';
      case 'ASSINATURA':
        return 'Em assinatura';
      case 'CANCELAMENTO':
        return 'Em cancelamento';
      case 'CANCELADO':
        return 'Cancelado';
      case 'APROVACANC':
        return 'Em aprovação do cancelamento';
      case 'CONCLUIDO':
        return 'Concluído';
      default:
        return '-';
    }
  };

  const handleDetailsClick = (doc: InfoDoc) => {
    navigate(`/infodoc/details/${doc.doc.id}`, {
      state: {
        from: currentTab,
      },
    });
  };

  const renderActions = (doc: InfoDoc) => {
    // Tabs: CANCELADO, OBSOLETO, HOMOLOGADOS
    if (currentTab === TabIdentifier.CANCELADO || currentTab === TabIdentifier.OBSOLETO) {
      return (
        <>
          <IconButton title="Visualizar" color="primary" onClick={() => onViewClick(doc)}>
            <VisibilityIcon sx={{ color: '#0EBDCE' }} />
          </IconButton>
          <IconButton title="Download" color="primary" onClick={() => onDownloadClick(doc)}>
            <GetAppIcon sx={{ color: '#0EBDCE' }} />
          </IconButton>
        </>
      );
    }

    // Se estiver na aba Homologados
    if (currentTab === TabIdentifier.HOMOLOGADOS) {
      return (
        <>
          <IconButton title="Detalhes" color="primary" onClick={() => handleDetailsClick(doc)}>
            <InfoIcon sx={{ color: '#0EBDCE' }} />
          </IconButton>
          <IconButton title="Revisar" color="primary" disabled={!isSGQ} onClick={() => onEditClick(doc)}>
            <EditIcon sx={{ color: !isSGQ ? '#cacaca' : '#e6b200' }} />
          </IconButton>
          <IconButton title="Visualizar" color="primary" onClick={() => onViewClick(doc)}>
            <VisibilityIcon sx={{ color: '#0EBDCE' }} />
          </IconButton>
          <IconButton title="Download" color="primary" onClick={() => onDownloadClick(doc)}>
            <GetAppIcon sx={{ color: '#0EBDCE' }} />
          </IconButton>
          <IconButton title="Distribuir" color="primary" onClick={() => onPrintClick(doc)} disabled={!isSGQ}>
            <ShareIcon sx={{ color: !isSGQ ? '#cacaca' : '#03AC59' }} />
          </IconButton>
          <Tooltip title="Somente SGQ pode Cancelar documentos homologados">
            <Box>
              <IconButton title="Cancelar" color="primary" onClick={() => onCancelClick(doc)} disabled={!isSGQ}>
                <CancelIcon sx={{ color: isSGQ ? '#FF0000' : '#cacaca' }} />
              </IconButton>
            </Box>
          </Tooltip>
        </>
      );
    }

    // Demais abas mantém o comportamento original
    return (
      <>
        <IconButton title="Revisar" color="primary" disabled={doc.doc.enumSituacao !== 'H' || !isSGQ} onClick={() => onEditClick(doc)}>
          <EditIcon sx={{ color: doc.doc.enumSituacao !== 'H' || !isSGQ ? '#cacaca' : '#e6b200' }} />
        </IconButton>
        <IconButton title="Visualizar" color="primary" onClick={() => onViewClick(doc)}>
          <VisibilityIcon sx={{ color: '#0EBDCE' }} />
        </IconButton>
        <IconButton title="Download" color="primary" onClick={() => onDownloadClick(doc)}>
          <GetAppIcon sx={{ color: '#0EBDCE' }} />
        </IconButton>
        <IconButton
          title="Distribuir"
          color="primary"
          onClick={() => onPrintClick(doc)}
          disabled={
            doc.doc.enumSituacao === 'C' || (!isSGQ && doc.doc.idUsuarioCriacao !== userQMSId) || (doc.doc.enumSituacao === 'H' && !isSGQ)
          }
        >
          <ShareIcon sx={{ color: doc.doc.enumSituacao !== 'H' ? '#cacaca' : '#03AC59' }} />
        </IconButton>
        <Tooltip title="Somente SGQ pode Cancelar documentos homologados">
          <Box>
            <IconButton
              title="Cancelar"
              color="primary"
              onClick={() => onCancelClick(doc)}
              disabled={doc.doc.enumSituacao !== 'H' && !isSGQ}
            >
              <CancelIcon
                sx={{
                  color: doc.doc.enumSituacao === 'H' && (isSGQ || doc.doc.idUsuarioCriacao === userQMSId) ? '#FF0000' : '#cacaca',
                }}
              />
            </IconButton>
          </Box>
        </Tooltip>
      </>
    );
  };

  if (!documents?.length) {
    return (
      <>
        <Row className="justify-content-center mt-5">
          <span style={{ color: '#7d7d7d' }}>Nenhum item encontrado.</span>
        </Row>
        <Row className="justify-content-center mt-5" style={{ flex: 1 }}>
          <TablePagination
            component="div"
            count={0}
            labelDisplayedRows={displayedRowsLabel}
            labelRowsPerPage="Itens por página:"
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            page={0}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
            style={{ display: 'flex', alignContent: 'center', width: '390px' }}
          />
        </Row>
      </>
    );
  }

  return (
    <>
      <TableContainer component={Paper} style={{ marginTop: '30px', boxShadow: 'none' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index} align={index !== columns.length - 1 ? 'left' : 'center'}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {documents
              ?.filter((doc: InfoDoc) => doc.doc.idUsuarioCriacao === userQMSId || isSGQ)
              ?.map((doc: InfoDoc) => (
                <TableRow key={doc.doc.id} style={{ cursor: doc.doc.enumSituacao !== 'H' ? 'pointer' : 'auto' }}>
                  <Tooltip title={doc.doc.descricaoDoc}>
                    <TableCell>{doc.doc.codigo}</TableCell>
                  </Tooltip>
                  <TableCell onClick={event => openDocToValidation(event, doc)}>{doc.doc.titulo}</TableCell>
                  <TableCell onClick={event => openDocToValidation(event, doc)}>{filterUser(doc.doc.idUsuarioCriacao)}</TableCell>
                  <TableCell onClick={event => openDocToValidation(event, doc)}>{doc.doc.revisao ?? 0}</TableCell>
                  <TableCell onClick={event => openDocToValidation(event, doc)}>
                    {doc.doc.dataCricao ? formatDateToString(new Date(doc.doc.dataCricao)) : '-'}
                  </TableCell>
                  <TableCell onClick={event => openDocToValidation(event, doc)}>{filterProcessName(doc.doc.idProcesso)}</TableCell>
                  <TableCell onClick={event => openDocToValidation(event, doc)}>{filterOrigin(doc.doc.origem)}</TableCell>
                  <TableCell onClick={event => openDocToValidation(event, doc)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{getSituacaoIcon(doc.doc.enumSituacao)}</Box>
                  </TableCell>
                  <TableCell onClick={event => openDocToValidation(event, doc)}>
                    {getStatusText(doc.movimentacao?.enumStatus) || '-'}
                  </TableCell>
                  <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>{renderActions(doc)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Row className="justify-content-center mt-5" style={{ flex: 1 }}>
        <TablePagination
          component="div"
          count={totalItems}
          labelDisplayedRows={displayedRowsLabel}
          labelRowsPerPage="Itens por página:"
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
          style={{ display: 'flex', alignContent: 'center', width: '390px' }}
        />
      </Row>
    </>
  );
};

export default DocumentsTable;
