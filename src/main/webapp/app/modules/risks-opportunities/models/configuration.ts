export type Configuration = {
  id?: number;
  tipoRO: 'R' | 'O';
  tipoAnaliseRO: 'P' | 'S' | 'C' | 'M' | 'D';
  grauRO: 'A' | 'M' | 'B';
  pesoRO: number;
  decisaoRO: string;
  descricaoRO: string;
  criadoPor: number;
  atualizadoPor: number;
  criadoEm: Date;
  atualizadoEm: Date;
};
