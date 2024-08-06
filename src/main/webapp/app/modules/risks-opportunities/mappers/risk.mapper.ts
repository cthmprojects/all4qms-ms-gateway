import { RawRiskOpportunity, RiskOpportunity } from '../models';

export const mapRiskOpportunity = (riskOpportunity: RiskOpportunity): RawRiskOpportunity => {
  // TODO: salvar antes esse objeto no endpoint de parteInteressada
  const partesInteressadas = {
    criadoPor: riskOpportunity.senderId,
    nomeParteInteressada: riskOpportunity.interestedParts.join(','),
  };

  return {
    analiseROS: null,
    atualizadoEm: null,
    atualizadoPor: null,
    criadoEm: null,
    criadoPor: null,
    dataRegistro: riskOpportunity.date,
    descricao1: riskOpportunity.description,
    descricao2: riskOpportunity.firstAuxiliaryDescription,
    descricao3: riskOpportunity.secondAuxiliaryDescription,
    descricaoControle: null, // TODO
    id: riskOpportunity.id,
    idEmissor: riskOpportunity.senderId,
    idProcesso: riskOpportunity.processId,
    linhaConfigControle1: null,
    linhaConfigControle2: null,
    nomeAtividade: riskOpportunity.activity,
    nomeFluxo: riskOpportunity.flow,
    partesInteressadas: null, //TODO: Aqui tem que ser somente o Id do objeto salvo (e tem que salvar o objeto antes desse formulário geral)
    tipoRO: riskOpportunity.type === 'Risco' ? 'R' : 'O',
  };
};

export const mapRawRiskOpportunity = (rawRiskOpportunity: RawRiskOpportunity): RiskOpportunity => {
  return {
    activity: rawRiskOpportunity.nomeAtividade,
    date: rawRiskOpportunity.dataRegistro,
    description: rawRiskOpportunity.descricao1,
    firstAuxiliaryDescription: rawRiskOpportunity.descricao2,
    flow: rawRiskOpportunity.nomeFluxo,
    id: rawRiskOpportunity.id,
    interestedParts: rawRiskOpportunity.partesInteressadas.nomeParteInteressada.split(','),
    processId: rawRiskOpportunity.idProcesso,
    secondAuxiliaryDescription: rawRiskOpportunity.descricao3,
    senderId: rawRiskOpportunity.idEmissor,
    type: rawRiskOpportunity.tipoRO === 'R' ? 'Risco' : 'Oportunidade',
  };
};
