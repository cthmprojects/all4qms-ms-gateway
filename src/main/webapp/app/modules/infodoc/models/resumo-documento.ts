export interface ResumoDocumento {
  id?: number;
  idDocumento: number;
  idAnexo: number;
  ticket: string;
  dataRequisicao: string;
  dataConclusao?: string;
  status: StatusResumo;
  resumoTexto?: string;
  idUsuarioSolicitante: number;
  erro?: string;
}

export enum StatusResumo {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export const StatusResumoDisplayName: Record<StatusResumo, string> = {
  [StatusResumo.PENDING]: 'Aguardando processamento',
  [StatusResumo.PROCESSING]: 'Em processamento',
  [StatusResumo.DONE]: 'Concluído com sucesso',
  [StatusResumo.ERROR]: 'Erro no processamento',
};

export const StatusResumoColor: Record<StatusResumo, string> = {
  [StatusResumo.PENDING]: 'warning',
  [StatusResumo.PROCESSING]: 'info',
  [StatusResumo.DONE]: 'success',
  [StatusResumo.ERROR]: 'danger',
};

export interface SolicitacaoResumoRequest {
  idDocumento: number;
  idAnexo: number;
  idUsuarioSolicitante: number;
}

export interface AtualizarStatusRequest {
  status: StatusResumo;
  resumoTexto?: string;
  erro?: string;
}
