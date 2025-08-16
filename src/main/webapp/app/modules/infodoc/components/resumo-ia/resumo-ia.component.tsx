import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from '@mui/material';
import { toast } from 'react-toastify';

import { ResumoDocumentoService } from '../../services/resumo-documento.service';
import { ResumoDocumento, StatusResumo, SolicitacaoResumoRequest } from '../../models/resumo-documento';

interface ResumoIAProps {
  idDocumento: number;
  idAnexo: number;
  descricaoAtual: string;
  onDescricaoChange: (novaDescricao: string) => void;
}

const ResumoIA: React.FC<ResumoIAProps> = ({ idDocumento, idAnexo, descricaoAtual, onDescricaoChange }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.authentication.account);

  const [resumoAtual, setResumoAtual] = useState<ResumoDocumento | null>(null);
  const [loading, setLoading] = useState(false);
  const [solicitando, setSolicitando] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);
  const jaCarregouRef = useRef(false);

  const resumoService = new ResumoDocumentoService();

  // Carregar resumo existente ao montar o componente ou quando idAnexo mudar
  useEffect(() => {
    // Evitar executar múltiplas vezes
    if (!jaCarregouRef.current && idDocumento && idAnexo) {
      jaCarregouRef.current = true;
      carregarResumoExistente();
    }
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      // Reset da flag quando componente for desmontado
      jaCarregouRef.current = false;
    };
  }, [idDocumento, idAnexo]);

  const carregarResumoExistente = async () => {
    try {
      setLoading(true);

      // Primeiro, verificar se há algum processo em andamento (PENDING ou PROCESSING)
      const resumosEmAndamento = await resumoService.getResumosByDocumento(idDocumento);
      const processoEmAndamento = resumosEmAndamento.data?.find(
        resumo => resumo.status === StatusResumo.PENDING || resumo.status === StatusResumo.PROCESSING
      );

      if (processoEmAndamento) {
        console.log('Processo em andamento encontrado:', processoEmAndamento);
        setResumoAtual(processoEmAndamento);

        // Informar o usuário sobre o processo em andamento
        if (processoEmAndamento.status === StatusResumo.PROCESSING) {
          toast.info('Resumo IA em processamento. Aguarde a conclusão...');
          iniciarPolling(processoEmAndamento.ticket);
        } else if (processoEmAndamento.status === StatusResumo.PENDING) {
          toast.info('Resumo IA aguardando processamento. Iniciando monitoramento...');
          setTimeout(() => {
            iniciarPolling(processoEmAndamento.ticket);
          }, 2000);
        }

        return;
      }

      // Se não há processo em andamento, buscar o resumo mais recente concluído
      const response = await resumoService.getResumoConcluidoMaisRecente(idDocumento);
      if (response.data) {
        setResumoAtual(response.data);
        setShowActions(true);
        toast.info('Resumo IA concluído encontrado. Você pode aplicá-lo ao documento.');
      }
    } catch (error) {
      console.log('Nenhum resumo encontrado para este documento');
      // Não mostrar toast aqui, pois é normal não ter resumo ainda
    } finally {
      setLoading(false);
    }
  };

  const solicitarResumo = async () => {
    if (!currentUser?.id) {
      toast.error('Usuário não identificado');
      return;
    }

    console.log('Debug - idAnexo recebido:', idAnexo);
    console.log('Debug - idDocumento recebido:', idDocumento);

    // Validação: verificar se existe um anexo válido
    if (!idAnexo || idAnexo <= 0) {
      toast.warn('Não foi encontrado nenhum documento anexado. Anexe um documento antes de solicitar o resumo IA.');
      return;
    }

    try {
      setSolicitando(true);
      const request: SolicitacaoResumoRequest = {
        idDocumento,
        idAnexo,
        idUsuarioSolicitante: currentUser.id,
      };

      const response = await resumoService.solicitarResumo(request);
      if (response.data) {
        setResumoAtual(response.data);
        toast.success('Solicitação de resumo enviada com sucesso!');
        iniciarPolling(response.data.ticket);
      }
    } catch (error) {
      console.error('Erro ao solicitar resumo:', error);
      toast.error('Erro ao solicitar resumo. Tente novamente.');
    } finally {
      setSolicitando(false);
    }
  };

  const iniciarPolling = (ticket: string) => {
    const interval = window.setInterval(async () => {
      try {
        const response = await resumoService.getResumoByTicket(ticket);
        if (response.data) {
          setResumoAtual(response.data);

          if (response.data.status === StatusResumo.DONE) {
            clearInterval(interval);
            setShowActions(true);
            toast.success('Resumo concluído com sucesso!');
          } else if (response.data.status === StatusResumo.ERROR) {
            clearInterval(interval);
            toast.error(`Erro no processamento: ${response.data.erro}`);
          }
        }
      } catch (error) {
        console.error('Erro no polling:', error);
      }
    }, 30000);

    setPollingInterval(interval);
  };

  const aplicarResumo = (acao: 'adicionar' | 'substituir') => {
    if (!resumoAtual?.resumoTexto) {
      toast.error('Nenhum resumo disponível');
      return;
    }

    let novaDescricao = '';
    if (acao === 'adicionar') {
      novaDescricao = descricaoAtual ? `${descricaoAtual}\n\n--- RESUMO IA ---\n${resumoAtual.resumoTexto}` : resumoAtual.resumoTexto;
    } else {
      novaDescricao = resumoAtual.resumoTexto;
    }

    onDescricaoChange(novaDescricao);
    setShowModal(false);
    toast.success('Resumo aplicado com sucesso!');
  };

  const getStatusChip = (status: StatusResumo) => {
    const colors = {
      [StatusResumo.PENDING]: 'warning',
      [StatusResumo.PROCESSING]: 'info',
      [StatusResumo.DONE]: 'success',
      [StatusResumo.ERROR]: 'error',
    } as const;

    const labels = {
      [StatusResumo.PENDING]: 'Aguardando',
      [StatusResumo.PROCESSING]: 'Processando',
      [StatusResumo.DONE]: 'Concluído',
      [StatusResumo.ERROR]: 'Erro',
    };

    return <Chip label={labels[status]} color={colors[status]} size="small" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="resumo-ia-container">
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              🤖 Resumo IA
            </Typography>
          }
        />
        <CardContent>
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" py={2}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2">Carregando...</Typography>
            </Box>
          )}

          {!loading && !resumoAtual && (
            <Box textAlign="center" py={2}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Solicite um resumo automático do documento usando IA
              </Typography>
              <Button
                variant="contained"
                onClick={solicitarResumo}
                disabled={solicitando}
                startIcon={solicitando ? <CircularProgress size={16} /> : null}
              >
                {solicitando ? 'Solicitando...' : 'Solicitar Resumo IA'}
              </Button>
            </Box>
          )}

          {resumoAtual && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  {getStatusChip(resumoAtual.status)}
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(resumoAtual.dataRequisicao)}
                  </Typography>
                </Box>
                {resumoAtual.status === StatusResumo.DONE && (
                  <Button variant="outlined" size="small" onClick={() => setShowModal(true)}>
                    Visualizar
                  </Button>
                )}
              </Box>

              {resumoAtual.status === StatusResumo.PROCESSING && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center">
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Processando documento... Isso pode levar alguns minutos.
                  </Box>
                </Alert>
              )}

              {resumoAtual.status === StatusResumo.ERROR && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Erro no processamento: {resumoAtual.erro}
                </Alert>
              )}

              {resumoAtual.status === StatusResumo.DONE && showActions && (
                <Box display="flex" gap={1} mt={2}>
                  <Button variant="contained" color="success" size="small" onClick={() => aplicarResumo('adicionar')}>
                    Adicionar ao Final
                  </Button>
                  <Button variant="contained" color="warning" size="small" onClick={() => aplicarResumo('substituir')}>
                    Substituir
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Modal para visualizar resumo */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>🤖 Resumo IA do Documento</DialogTitle>
        <DialogContent>
          {resumoAtual?.resumoTexto ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Resumo Gerado:
              </Typography>
              <Box
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                  bgcolor: 'grey.50',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                }}
              >
                {resumoAtual.resumoTexto}
              </Box>
              <Box mt={2}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Data da solicitação:</strong> {formatDate(resumoAtual.dataRequisicao)}
                  {resumoAtual.dataConclusao && (
                    <>
                      <br />
                      <strong>Data de conclusão:</strong> {formatDate(resumoAtual.dataConclusao)}
                    </>
                  )}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography color="text.secondary">Nenhum resumo disponível.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Fechar</Button>
          {resumoAtual?.status === StatusResumo.DONE && (
            <>
              <Button variant="contained" color="success" onClick={() => aplicarResumo('adicionar')}>
                Adicionar ao Final
              </Button>
              <Button variant="contained" color="warning" onClick={() => aplicarResumo('substituir')}>
                Substituir
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResumoIA;
