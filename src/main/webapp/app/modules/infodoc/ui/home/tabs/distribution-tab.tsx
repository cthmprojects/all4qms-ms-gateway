import React from 'react';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GetAppIcon from '@mui/icons-material/GetApp';
import { Row } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { DistribuicaoCompleta } from '../../../models/distribuicao';
import { formatDateToString, filterProcess, getTipoControleText } from '../infodoc-list.utils';

interface DistributionTabProps {
  distribuitions: DistribuicaoCompleta[];
  userProcessos: any[];
  page: number;
  pageSize: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleClickDistribuition: (distribuicao: DistribuicaoCompleta) => Promise<void>;
  handleDownloadDistribuition: (distribuicao: DistribuicaoCompleta) => Promise<void>;
}

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

function displayedRowsLabel({ from, to, count }) {
  return `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`;
}

const DistributionTab: React.FC<DistributionTabProps> = ({
  distribuitions,
  userProcessos,
  page,
  pageSize,
  onPageChange,
  onRowsPerPageChange,
  handleClickDistribuition,
  handleDownloadDistribuition,
}) => {
  const navigate = useNavigate();

  const filteredDistribuitions = distribuitions?.filter((distribuicao: DistribuicaoCompleta) =>
    userProcessos.some(processo => processo.id === distribuicao.idProcesso)
  );

  if (!filteredDistribuitions?.length) {
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
              {columnsDistribuicaoDetalhada.map(col => (
                <TableCell key={col} align={col !== 'Ações' ? 'left' : 'center'}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDistribuitions?.map((distribuicao: DistribuicaoCompleta) => (
              <TableRow key={distribuicao.idDistribuicaoDoc} style={{ cursor: 'pointer' }}>
                <TableCell>{getTipoControleText(distribuicao.enumTipoControleDoc)}</TableCell>
                <TableCell>{distribuicao.enumStatusDoc}</TableCell>
                <TableCell>{distribuicao.codigo}</TableCell>
                <TableCell>{distribuicao.titulo}</TableCell>
                <TableCell>{distribuicao.revisao}</TableCell>
                <TableCell>{distribuicao.qtdCopiaEletronica}</TableCell>
                <TableCell>{distribuicao.qtdCopiaFisica}</TableCell>
                <TableCell>{distribuicao.recebidoPor || '-'}</TableCell>
                <TableCell>{distribuicao.dataEntrega ? formatDateToString(new Date(distribuicao.dataEntrega)) : '-'}</TableCell>
                <TableCell>{distribuicao.devolvidoPor || '-'}</TableCell>
                <TableCell>{distribuicao.dataDevolucao ? formatDateToString(new Date(distribuicao.dataDevolucao)) : '-'}</TableCell>
                <TableCell>{distribuicao.situacaoDistribuicao || '-'}</TableCell>
                <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                  <IconButton
                    id="btn-view"
                    title="Visualizar"
                    color="primary"
                    onClick={() => {
                      void handleClickDistribuition(distribuicao);
                    }}
                  >
                    <VisibilityIcon sx={{ color: '#0EBDCE' }} />
                  </IconButton>
                  <IconButton
                    id="btn-download"
                    title="Download"
                    color="primary"
                    onClick={() => {
                      void handleDownloadDistribuition(distribuicao);
                    }}
                  >
                    <GetAppIcon sx={{ color: '#0EBDCE' }} />
                  </IconButton>
                  <IconButton
                    id="btn-receive"
                    title="Recebimento"
                    color="primary"
                    disabled={distribuicao.enumTipoControleDoc === 'C' && distribuicao.situacaoDistribuicao !== 'RECOLHIDO'}
                    onClick={() =>
                      navigate(`receive/${distribuicao.idDistribuicaoDoc}`, {
                        state: {
                          ...distribuicao,
                          from: 'distribution',
                          isControlled: distribuicao.enumTipoControleDoc === 'C',
                        },
                      })
                    }
                  >
                    <ReceiptIcon
                      sx={{
                        color:
                          distribuicao.enumTipoControleDoc === 'C'
                            ? distribuicao.situacaoDistribuicao !== 'RECOLHIDO'
                              ? '#ccc'
                              : '#03AC59'
                            : '#03AC59',
                      }}
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Row className="justify-content-center mt-5" style={{ flex: 1 }}>
        <TablePagination
          component="div"
          count={filteredDistribuitions.length}
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

export default DistributionTab;
