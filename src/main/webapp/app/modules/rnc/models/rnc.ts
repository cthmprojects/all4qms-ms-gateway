import { AprovacaoNC } from './aprovacao-nc';

export type Rnc = {
  acoesImediatas?: string;
  aprovacaoNC?: number;
  atualizadoEm?: Date;
  criadoEm?: Date;
  decisaoNC?: number;
  dtNC: Date;
  id?: number;
  idEmissorNC: number;
  idReceptorNC: number;
  idUsuarioAtual: number;
  ncOutros?: string;
  numNC?: number;
  origemNC: string;
  possuiReincidencia: boolean;
  processoEmissor: number;
  processoNC: number;
  statusAtual: string;
  tipoNC: string;
  vinculoAuditoria?: number;
  vinculoCliente?: number;
  vinculoDocAnterior?: Array<number>;
  vinculoProduto?: number;
  aprovacao?: AprovacaoNC;
};

export type RNC = {
  numero: string;
  emissao: Date;
  emissor: string;
  descricao: string;
  responsavel: string;
  prazo: Date;
  acoes: string;
  verificacao: Date;
  eficacia: Date;
  fechamento: Date;
  status: string;
};

export type RncData = {
  idNc: number;
  descricao: string;
  emissor: string;
  responsavel: string;
  verificacao: Date;
  eficacia: Date;
  fechamento: Date;
};

export type ExtendedNc = {
  nc: Rnc;
  dados: RncData;
};

export type NonConformity = {
  id: number;
  numNC: number;
  statusAtual: string;
  idUsuarioAtual: number;
  dtNC: Date;
  tipoNC: string;
  origemNC: string;
  ncOutros: string;
  possuiReincidencia: boolean;
  idEmissorNC: number;
  processoNC: number;
  idReceptorNC: number;
  processoEmissor: number;
  vinculoAuditoria: number;
  acoesImediatas: number;
  criadoEm: Date;
  atualizadoEm: Date;
  vinculoCliente: number;
  vinculoProduto: number;
  decisaoNC: number;
  aprovacaoNC: number;
  vinculoDocAnterior: number;
};

export type NonConformityAttachment = {
  id: number;
  nomeArquivoFisico: string;
  nomeArquivoOriginal: string;
  criadoEm: Date;
  atualizadoEm: Date;
  idDescricaoNaoConformidade: number;
  idReclamacao: number;
};

export type NonConformityDescriptionSummary = {
  id: number;
  detalhesNaoConformidade: string;
  requisitoDescumprido: string;
  evidenciaObjetiva: string;
  criadoEm: Date;
  atualizadoEm: Date;
  idNaoConformidade: number;
  anexos: Array<NonConformityAttachment>;
};

export type NonConformityDescription = {
  descricaoNaoConformidade: NonConformityDescriptionSummary;
  caminhoAnexo: string;
};

export type CompleteNc = {
  naoConformidade: NonConformity;
  descricaoNC: Array<NonConformityDescription>;
  origem: {
    outros: string;
    auditoria: {
      id: number;
      sequecialAuditoria: number;
      normaAuditoria: string;
      ocorrenciaAuditoria: string;
      requisitoAuditoria: string;
      processoAuditoria: number;
      idNaoConformidade: number;
    };
    cliente: {
      cliente: {
        id: number;
        nomeClienteReclamacao: string;
        criadoEm: Date;
        atualizadoEm: Date;
      };
      produto: {
        id: number;
        codigoProduto: string;
        nomeProduto: string;
        nomeFornecedor: string;
        lote: string;
        qtdLote: number;
        nqa: string;
        qtdAmostra: number;
        qtdDefeito: number;
        qtdRejeicao: number;
        numPedido: string;
        numOP: string;
        criadoEm: Date;
        atualizadoEm: Date;
        identificador: string;
        idOperadorOcorrencia: number;
        regimeInspecao: string;
        idRastreabilidadesRegistro: number;
      };
      rastreabilidade: {
        id: number;
        dtEntregaNF: Date;
        numNF: string;
        dtNF: Date;
        criadoEm: Date;
        atualizadoEm: Date;
        idNaoConformidade: number;
      };
    };
    mpprod: {
      produto: {
        id: number;
        codigoProduto: string;
        nomeProduto: string;
        nomeFornecedor: string;
        lote: string;
        qtdLote: number;
        nqa: string;
        qtdAmostra: number;
        qtdDefeito: number;
        qtdRejeicao: number;
        numPedido: string;
        numOP: string;
        criadoEm: Date;
        atualizadoEm: Date;
        identificador: string;
        idOperadorOcorrencia: number;
        regimeInspecao: string;
        idRastreabilidadesRegistro: number;
      };
      operador: {
        id: number;
        nomeOperador: string;
        linhaOperador: string;
        turnoOperador: string;
        nomeInspetorOperador: string;
        criadoEm: Date;
        atualizadoEm: Date;
      };
      rastreabilidade: {
        id: number;
        dtEntregaNF: Date;
        numNF: string;
        dtNF: Date;
        criadoEm: Date;
        atualizadoEm: Date;
        idNaoConformidade: number;
      };
    };
  };
  abrangencia: {
    id: number;
    descricaoAbrangencia: string;
    criadoEm: Date;
    atualizadoEm: Date;
    idNaoConformidade: number;
  };
  acaoImediata: [
    {
      id: number;
      descricaoAcaoImediata: string;
      prazoAcaoImediata: Date;
      validacaoAcaoImediata: boolean;
      inconformidadeAcaoImediata: string;
      statusAcaoImediata: string;
      idResponsavelAcaoImediata: number;
      idResponsavelValidacaoAcaoImediata: number;
      criadoEm: Date;
      atualizadoEm: Date;
      idNaoConformidade: number;
    }
  ];
  decisao: {
    id: number;
    descricaoDecisao: string;
    dataDecisao: Date;
    qtdAtual: number;
    qtdAprovada: number;
    qtdReprovada: number;
    qtdRejeitada: number;
    responsaveis: string;
    criadoEm: Date;
    atualizadoEm: Date;
    idDecisaoAtual: number;
    tipoDecisao: string;
    idNaoConformidade: number;
  };
  ishikawa: {
    id: number;
    descCausaEfeito: string;
    meioAmbiente: string;
    maoDeObra: string;
    metodo: string;
    maquina: string;
    medicao: string;
    materiaPrima: string;
  };
  porques: {
    id: number;
    descProblema: string;
    pq1: string;
    pq2: string;
    pq3: string;
    pq4: string;
    pq5: string;
    descCausa: string;
  };
  acaoPlano: [
    {
      plano: {
        id: number;
        statusPlano: string;
        qtdAcoes: number;
        qtdAcoesConcluidas: number;
        percentualPlano: number;
        dtConclusaoPlano: Date;
        criadoEm: Date;
        atualizadoEm: Date;
        idNaoConformidade: number;
      };
      acoes: [
        {
          id: number;
          idPlano: number;
          descricaoAcao: string;
          prazoAcao: Date;
          idResponsavelAcao: number;
          statusAcao: string;
          dataVerificao: Date;
          idResponsavelVerificaoAcao: number;
          idAnexosExecucao: number;
          dataConclusaoAcao: Date;
          criadoEm: Date;
          atualizadoEm: Date;
          planoId: number;
        }
      ];
    }
  ];
  aprovacao: {
    id: number;
    possuiImplementacao: boolean;
    dataImplementacao: Date;
    responsavelImplementacao: number;
    descImplementacao: string;
    possuiEficacia: boolean;
    dataEficacia: Date;
    responsavelEficacia: number;
    novoRegistro: boolean;
    descEficacia: string;
    dataFechamento: Date;
    responsavelFechamento: number;
    alterarRisco: boolean;
    vinculoRisco: number;
    descFechamento: string;
    criadoEm: Date;
    atualizadoEm: Date;
  };
};
