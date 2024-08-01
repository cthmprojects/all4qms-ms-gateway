import { RawRiskOpportunity, RiskOpportunity } from '../models';

export const mapRiskOpportunity = (riskOpportunity: RiskOpportunity): RawRiskOpportunity => {
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
    partesInteressadas: null, // TODO
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
    interestedParts: [], // TODO
    processId: rawRiskOpportunity.idProcesso,
    secondAuxiliaryDescription: rawRiskOpportunity.descricao3,
    senderId: rawRiskOpportunity.idEmissor,
    type: rawRiskOpportunity.tipoRO === 'R' ? 'Risco' : 'Oportunidade',
  };
};
