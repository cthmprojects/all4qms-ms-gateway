export type RawRiskOpportunity = {
  id: number;
  idEmissor: number;
  dataRegistro: Date;
  tipoRO: 'R' | 'O';
  idProcesso: number;
  nomeFluxo: string;
  nomeAtividade: string;
  descricao1: string;
  descricao2: string;
  descricao3: string;
  descricaoControle: string;
  criadoPor: number;
  atualizadoPor: number;
  criadoEm: Date;
  atualizadoEm: Date;
  partesInteressadas: {
    id: number;
    nomeParteInteressada: string;
    criadoPor: number;
    atualizadoPor: number;
    criadoEm: Date;
    atualizadoEm: Date;
  };
  linhaConfigControle1: {
    id: number;
    tipoRO: 'R' | 'O';
    tipoAnaliseRO: 'P';
    grauRO: 'A';
    pesoRO: number;
    decisaoRO: string;
    descricaoRO: string;
    criadoPor: number;
    atualizadoPor: number;
    criadoEm: Date;
    atualizadoEm: Date;
  };
  linhaConfigControle2: {
    id: number;
    tipoRO: 'R' | 'O';
    tipoAnaliseRO: 'P';
    grauRO: 'A';
    pesoRO: number;
    decisaoRO: string;
    descricaoRO: string;
    criadoPor: number;
    atualizadoPor: number;
    criadoEm: Date;
    atualizadoEm: Date;
  };
  analiseROS: [
    {
      id: number;
      dataAnalise: Date;
      decisao: string;
      descricaoDecisao: string;
      corDecisao: string;
      idInvestigacao: number;
      idPlano: number;
      idAprovacaoNC: number;
      criadoPor: number;
      atualizadoPor: number;
      criadoEm: Date;
      atualizadoEm: Date;
      linhaConfigAnalise1: {
        id: number;
        tipoRO: 'R' | 'O';
        tipoAnaliseRO: 'P';
        grauRO: 'A';
        pesoRO: number;
        decisaoRO: string;
        descricaoRO: string;
        criadoPor: number;
        atualizadoPor: number;
        criadoEm: Date;
        atualizadoEm: Date;
      };
      linhaConfigAnalise2: {
        id: number;
        tipoRO: 'R';
        tipoAnaliseRO: 'P';
        grauRO: 'A';
        pesoRO: number;
        decisaoRO: string;
        descricaoRO: string;
        criadoPor: number;
        atualizadoPor: number;
        criadoEm: Date;
        atualizadoEm: Date;
      };
      riscoOportunidade: string;
    }
  ];
};
