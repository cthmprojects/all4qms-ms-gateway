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
  id?: Number;
  politicaSGQ?: string;
  desdobramentoSGQ?: string;
  objetivoSGQ?: string;
};

export type MetaRecurso = {
  id: number;
  recursoNome: string;
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
  id?: Number;
  descricao: string;
  acao: string;
  avaliacaoResultado: string;
  idProcesso: Number; //entity Processo ( Lista )
  monitoramento: EnumTemporal;
  periodo: EnumTemporal;
  recursos: any[];
  metaObjetivo: MetaObjetivo;
  monitoramentoControle: string;
  descricaoMonitoramentoControle: string;
};

export type TargetGoals = {
  idUsuarioCriacao?: number;
  dataCricao: string;
  qp: string;
  qt: string;
  qpd: string;
  goals: {
    id: number;
  }[];
};

export type Goals = {
  id: number;
};
