export interface IRNC {
  id: number;
  numNC: number;
  idEmissorNC: number;
  idUsuarioAtual: number;
  dtNC: Date;
  origemNC: string;
  ncOutros: string;
  possuiReincidencia: boolean;
  processoNC: number;
  idReceptorNC: number;
  processoEmissor: number;
  vinvuloAuditoria: number;
  acoesImediatas: number;
  criadoEm: Date;
  atualizadoEm: Date;
  // vinculoCliente: Reclamacao;
  // vinculoProduto: Produto;
  // decisaoNC: Decisao;
  // aprovacaoNC: AprovacaoNC;
  // vinculoDocAnterior: NaoConformidadeDTO;
}

interface Reclamacao {
  id: number;
  nomeClienteReclamacao: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

interface Produto {
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
  // private IdentificarLocalDTO idIdentificado;
  // private OperadorDTO idOperadorOcorrencia;
  // private RegimeInspecaoDTO idRegimesInspecao;
  // private RastreabilidadeDTO idRastreabilidadesRegistro;
}

interface Decisao {
  id: number;
  descricaoDecisao: string;
  dataDecisao: Date;
  qtdAtual: number;
  qtdAprovada: number;
  qtdReprovada: number;
  qtdRejeitada: number;
  criadoEm: Date;
  atualizadoEm: Date;
  idDecisaoAtual: TipoDecisao;
}

interface TipoDecisao {
  id: number;
  nomeDecisao: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

interface AprovacaoNC {
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
}
