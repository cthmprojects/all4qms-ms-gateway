export type SwotInstitucional = {
  id: number;
  forcas: EixosSwot[];
  fraquezas: EixosSwot[];
  oportunidades: EixosSwot[];
  ameacas: EixosSwot[];
};
export type EixosSwot = {
  id?: number;
  idRiscoOportunidade?: number;
  isAnalisar?: boolean;
  descricao?: string;
  eixo?: 'FORCA' | 'FRAQUEZA' | 'OPORTUNIDADE' | 'AMEACA';
  status?: 'PENDENTE' | 'CONTROLADO' | 'EMTRATATIVA';
  criadoEm?: Date;
  atualizadoEm?: Date;
};

export interface SwotList {
  swot: string;
  desc: string;
  isEnable: boolean;
  status: 'PENDENTE' | 'CONTROLADO' | 'EMTRATATIVA';
}
