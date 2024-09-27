export type SwotInstitucional = {
  id: number;
  forcas: EixosSwot[];
  fraquezas: EixosSwot[];
  oportunidades: EixosSwot[];
  ameacas: EixosSwot[];
};
export type EixosSwot = {
  id: number;
  idRO: number;
  descEixo: number;
  eixo: 'FORCA' | 'FRAQUEZA' | 'OPORTUNIDADE' | 'AMEACA';
  criadoEm: Date;
  atualizadoEm: Date;
};

export interface SwotList {
  swot: string;
  desc: string;
  isEnable: boolean;
  status: 'PENDENTE' | 'CONTROLADO' | 'EMTRATATIVA';
}
