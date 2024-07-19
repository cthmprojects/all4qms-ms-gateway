export type Movimentacao = {
  id?: number;
  enumTipoMovDoc: EnumTipoMovDoc;
  enumStatus: EnumStatusDoc;
  idDocumentacao: number;
  idUsuarioAprovacao?: number;
  dataAprovacao?: string | Date;
  idUsuarioValidacao?: number;
  dataValidacao?: string | Date;
  comentarioCancelamento?: string;
  idUsuarioCriacao: number;
  dataInicio?: string | Date;
  idUsuarioFinalizacao?: number;
  dataFim?: string | Date;
};

export enum EnumTipoMovDoc {
  EMITIR = 'E',
  DISTRIBUIR = 'D',
  REVISAR = 'R',
  CANCELAR = 'C',
}

export enum EnumStatusDoc {
  EMISSAO = 'EMISSAO',
  VALIDACAO = 'VALIDACAO',
  APROVACAO = 'APROVACAO',
  REVISAO = 'REVISAO',
  VALIDAREV = 'VALIDAREV',
  APROVAREV = 'APROVAREV',
  DISTRIBUICAO = 'DISTRIBUICAO',
  ASSINATURA = 'ASSINATURA',
  CANCELAMENTO = 'CANCELAMENTO',
  APROVACANC = 'APROVACANC',
  CONCLUIDO = 'CONCLUIDO',
}
