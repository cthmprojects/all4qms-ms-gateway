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
import { Row } from 'reactstrap';
import { InfoDoc } from '../../../models';
import { formatDateToString, filterProcess } from '../infodoc-list.utils';

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
  currentTab: number;
}

const columns = ['Código', 'Título', 'Emissor', 'Revisão', 'Data', 'Área/Processo', 'Origem', 'Situação', 'Ações'];

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
        return 'EM EDIÇÃO';
      case 'H':
        return 'HOMOLOGADO';
      case 'R':
        return 'EM REVISÃO';
      case 'O':
        return 'OBSOLETO';
      case 'C':
        return 'CANCELADO';
      case 'D':
        return 'EM DISTRIBUIÇÃO';
      default:
        return 'INDEFINIDO';
    }
  };

  const renderActions = (doc: InfoDoc) => {
    // Tabs: 4 = Cancelado, 5 = Obsoleto
    if (currentTab === 4 || currentTab === 5) {
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
              {columns.map(col => (
                <TableCell key={col} align={col !== 'Ações' ? 'left' : 'center'}>
                  {col}
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
