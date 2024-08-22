import { EnumTemporal } from './enums';

export interface ListMeta {
  idMeta: Number;
  idMetaObjetivo: Number;
  idMetaResultado: Number;
  descricao: String;
  avaliacao: String;
  analise: String;
  parcial: Boolean;
  metaAtingida: Boolean;
  lancadoEm: Date;
}

export type MetaObjetivo = {
  idMetaObjetivo: Number;
  politicaSGQ: String;
  desdobramentoSGQ: String;
  objetivoSGQ: String;
};

export type MetaRecurso = {
  id: number;
  recursoNome: String;
};

export type MetaAnexo = {
  idAnexo: Number;
  nomeFisico: String;
  nomeOriginal: String;
  extensao: String;
  caminho: String;
  dataCriacao: Date;
};

export type MetaResultado = {
  id: Number;
  avaliacao: String;
  analise: String;
  parcial: Boolean;
  metaAtingida: Boolean;
  lancadoEm: Date;
  periodo: Date;
  meta: Meta;
};

export type Meta = {
  id: Number;
  descricao: String;
  indicador: String;
  medicao: String;
  acao: String;
  avaliacaoResultado: String;
  idProcesso: Number; //entity Processo ( Lista )
  monitoramento: EnumTemporal;
  periodo: EnumTemporal;
  recursos: MetaRecurso[];
  metaObjetivo: MetaObjetivo;
};
