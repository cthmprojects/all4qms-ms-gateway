export interface DetalheDistribuicao {
  id?: number;
  idDistribuicaoDoc: number;
  cometarioSolicitacao: string;
  idUsuarioEntrega?: number;
  dataEntrega?: Date;
  comentarioEntrega?: string;
  idUsuarioDevolucao?: number;
  dataDevolucao?: Date;
  comentarioDevolucao?: string;
}
export interface Distribuicao {
  id?: number;
  idDocumentacao: number;
  enumTipoControleDoc: EnumTipoControleDoc;
  idProcesso: number;
  qtdCopiaEletronica: number;
  qtdCopiaFisica: number;
}

export interface DistribuicaoCompleta {
  idDistribuicaoDoc?: number;
  idDetalhesDistDoc?: number;
  idDocumentacao?: number;
  idProcesso?: number;
  idUsuarioEntrega?: number;
  idUsuarioDevolucao?: number;
  idMovimentacaoDoc?: number;
  enumTipoControleDoc?: string;
  enumStatusDoc?: string;
  codigo?: string;
  titulo?: string;
  revisao?: number;
  qtdCopiaEletronica?: number;
  qtdCopiaFisica?: number;
  recebidoPor?: string;
  dataEntrega?: Date;
  devolvidoPor?: string;
  dataDevolucao?: Date;
}

export enum EnumTipoMovDoc {
  EMITIR = 'E',
  DISTRIBUIR = 'D',
  REVISAR = 'R',
  CANCELAR = 'C',
}

export enum EnumTipoControleDoc {
  C = 'Controlada',
  N = 'Nao Controlada',
}
