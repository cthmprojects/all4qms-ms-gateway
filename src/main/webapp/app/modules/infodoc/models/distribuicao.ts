export interface DetahleDistribuicao {
  id: number;
  idDistribuicaoDoc: number;
  cometarioSolicitacao: string;
  idUsuarioEntrega: number;
  dataEntrega: Date;
  comentarioEntrega: string;
  idUsuarioDevolucao: number;
  dataDevolucao: Date;
  comentarioDevolucao: string;
}
export interface Distribuicao {
  id: number;
  idDocumentacao: number;
  enumTipoControleDoc: string;
  idProcesso: number;
  qtdCopiaEletronica: number;
  qtdCopiaFisica: number;
}

export enum EnumTipoMovDoc {
  EMITIR = 'E',
  DISTRIBUIR = 'D',
  REVISAR = 'R',
  CANCELAR = 'C',
}
