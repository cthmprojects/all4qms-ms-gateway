import ReceiptIcon from '@mui/icons-material/Receipt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row } from 'reactstrap';
import { DistribuicaoCompleta } from '../../../models/distribuicao';
import { formatDateToString } from '../infodoc-list.utils';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { useAppSelector } from 'app/config/store';
import { AUTHORITIES } from 'app/config/constants';

interface ControlledCopyTabProps {
  distribuitions: DistribuicaoCompleta[];
  userProcessos: any[];
  page: number;
  pageSize: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleClickDistribuition: (distribuicao: DistribuicaoCompleta) => Promise<void>;
  handleDownloadDistribuition: (distribuicao: DistribuicaoCompleta) => Promise<void>;
}

const columnsDistribuicao = ['Código', 'Título', 'Revisão', 'Data', 'Área/Processo', 'Ações'];

function displayedRowsLabel({ from, to, count }) {
  return `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`;
}

const ControlledCopyTab: React.FC<ControlledCopyTabProps> = ({
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

  // Hooks para verificar permissões do usuário
  const account = useAppSelector(state => state.authentication.account);
  const canReceive = hasAnyAuthority(account?.authorities, [
    AUTHORITIES.ADMIN,
    AUTHORITIES.SGQ,
    AUTHORITIES.EMISSOR,
    AUTHORITIES.APROVADOR,
  ]);

  // Função para filtrar o nome do processo baseado no ID
  const filterProcessName = (id: number): string => {
    if (!userProcessos || userProcessos.length <= 0) {
      return '-';
    }

    if (id) {
      const processo = userProcessos.find(process => process.id === id);
      return processo ? processo.nome : '-';
    }

    return '-';
  };

  const filteredDistribuitions = distribuitions
    ?.filter((distribuicao: DistribuicaoCompleta) => userProcessos.some(processo => processo.id === distribuicao.idProcesso))
    ?.filter((distribuicao: DistribuicaoCompleta) => distribuicao.situacaoDistribuicao === 'DISTRIBUIDO' || !distribuicao.dataDevolucao)
    ?.filter((distribuicao: DistribuicaoCompleta) => distribuicao.enumTipoControleDoc === 'C');

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
              {columnsDistribuicao.map(col => (
                <TableCell key={col} align={col !== 'Ações' ? 'left' : 'center'}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDistribuitions?.map((distribuicao: DistribuicaoCompleta) => (
              <TableRow key={distribuicao.idDistribuicaoDoc} style={{ cursor: 'pointer' }}>
                <TableCell>{distribuicao.codigo}</TableCell>
                <TableCell>{distribuicao.titulo}</TableCell>
                <TableCell>{distribuicao.revisao}</TableCell>
                <TableCell>{distribuicao.dataEntrega ? formatDateToString(new Date(distribuicao.dataEntrega)) : '-'}</TableCell>
                <TableCell>{filterProcessName(distribuicao.idProcesso)}</TableCell>
                <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                  <IconButton
                    id="btn-view"
                    title="Visualizar"
                    color="primary"
                    onClick={() => {
                      void handleClickDistribuition(distribuicao);
                    }}
                    disabled={!distribuicao.dataEntrega}
                  >
                    <VisibilityIcon sx={{ color: !distribuicao.dataEntrega ? '#ccc' : '#0EBDCE' }} />
                  </IconButton>
                  <IconButton
                    id="btn-receive"
                    title="Recebimento"
                    color="primary"
                    onClick={() =>
                      navigate(`receive/${distribuicao.idDistribuicaoDoc}`, {
                        state: {
                          ...distribuicao,
                          from: 'controlled-copy',
                        },
                      })
                    }
                    disabled={!canReceive}
                  >
                    <ReceiptIcon sx={{ color: !canReceive ? '#ccc' : '#03AC59' }} />
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

export default ControlledCopyTab;
