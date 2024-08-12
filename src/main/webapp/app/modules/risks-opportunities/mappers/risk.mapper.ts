import {
  ActionPlanEfficacy,
  ActionPlanImplementation,
  ActionPlanSummary,
  AnalysisDetails,
  AnalysisSummary,
  CompleteAnalysis,
  Ishikawa,
  RawInterestedPart,
  RawRiskOpportunity,
  RawRiskOpportunityAnalysis,
  RawRiskOpportunityConfiguration,
  Reason,
  RiskOpportunity,
} from '../models';

export const mapRiskOpportunity = (riskOpportunity: RiskOpportunity, interestedPartsId?: number): RawRiskOpportunity => {
  // TODO: salvar antes esse objeto no endpoint de parteInteressada
  const partesInteressadas = {
    criadoPor: riskOpportunity.senderId,
    nomeParteInteressada: riskOpportunity.interestedParts.join(','),
  };

  const now: Date = new Date();

  return {
    atualizadoEm: now,
    atualizadoPor: riskOpportunity.senderId, // TODO: Usar ID do usuário
    criadoEm: now,
    criadoPor: riskOpportunity.senderId, // TODO: Usar ID do usuário
    dataRegistro: riskOpportunity.date,
    descricao1: riskOpportunity.description,
    descricao2: riskOpportunity.firstAuxiliaryDescription,
    descricao3: riskOpportunity.secondAuxiliaryDescription,
    descricaoControle: null,
    id: riskOpportunity.id,
    idEmissor: riskOpportunity.senderId,
    idLinhaConfigControle1: null,
    idLinhaConfigControle2: null,
    idPartesInteressadas: interestedPartsId,
    idProcesso: riskOpportunity.processId,
    idsAnaliseROS: null,
    nomeAtividade: riskOpportunity.activity,
    nomeFluxo: riskOpportunity.flow,
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
    interestedParts: null,
    processId: rawRiskOpportunity.idProcesso,
    secondAuxiliaryDescription: rawRiskOpportunity.descricao3,
    senderId: rawRiskOpportunity.idEmissor,
    type: rawRiskOpportunity.tipoRO === 'R' ? 'Risco' : 'Oportunidade',
  };
};

export const mapCompleteToAnalysisDetails = (completeAnalysis: CompleteAnalysis): AnalysisDetails => {
  return {
    description: completeAnalysis.description,
    meaning: completeAnalysis.meaning,
    probability: completeAnalysis.probability,
    severity: completeAnalysis.severity,
  };
};

export const mapCompleteAnalysisToIshikawa = (completeAnalysis: CompleteAnalysis): Ishikawa | null => {
  return completeAnalysis.useIshikawa
    ? {
        cause: completeAnalysis.ishikawaCause,
        environment: completeAnalysis.environment,
        machine: completeAnalysis.machine,
        measurement: completeAnalysis.measurement,
        method: completeAnalysis.method,
        rawMaterial: completeAnalysis.rawMaterial,
        workforce: completeAnalysis.manpower,
      }
    : null;
};

export const mapCompleteAnalysisToReasons = (completeAnalysis: CompleteAnalysis): Reason | null => {
  return completeAnalysis.useReasons
    ? {
        cause: completeAnalysis.reasonCause,
        effect: completeAnalysis.reasonEffect,
        reason1: completeAnalysis.reason1,
        reason2: completeAnalysis.reason2,
        reason3: completeAnalysis.reason3,
        reason4: completeAnalysis.reason4,
        reason5: completeAnalysis.reason5,
      }
    : null;
};

export const mapCompleteAnalysisToActionPlanSummary = (completeAnalysis: CompleteAnalysis): ActionPlanSummary => {
  return {
    actionDate: completeAnalysis.actionDate,
    actionDescription: completeAnalysis.actionDescription,
    actionVerificationDate: completeAnalysis.actionVerificationDate,
    actionVerifierId: completeAnalysis.actionVerifierId,
    responsibleId: completeAnalysis.responsibleId,
    verifyAction: completeAnalysis.verifyAction,
  };
};

export const mapCompleteAnalysisToActionPlanImplementation = (completeAnalysis: CompleteAnalysis): ActionPlanImplementation => {
  return {
    implementationDate: completeAnalysis.implementationDate,
    implementationDescription: completeAnalysis.implementationDescription,
    implementationResponsibleId: completeAnalysis.implementationResponsibleId,
    implemented: completeAnalysis.implemented,
  };
};

export const mapCompleteAnalysisToActionPlanEfficacy = (completeAnalysis: CompleteAnalysis): ActionPlanEfficacy => {
  return {
    efficacyDescription: completeAnalysis.efficacyDescription,
    efficacyResponsibleId: completeAnalysis.efficacyResponsibleId,
    efficacyVerificationDate: completeAnalysis.efficacyVerificationDate,
    efficacyVerified: completeAnalysis.efficacyVerified,
  };
};

export const mapLevelToConfiguration = (level: string, id: number): RawRiskOpportunityConfiguration => {
  const now: Date = new Date();

  return {
    atualizadoEm: now,
    atualizadoPor: id,
    criadoEm: now,
    criadoPor: id,
    decisaoRO: '',
    descricaoRO: level,
    grauRO: 'A',
    id: null,
    pesoRO: 0,
    tipoAnaliseRO: 'P',
    tipoRO: 'R',
  };
};

export const mapAnalysisSummaryToRawRiskOpportunityAnalysis = (
  summary: AnalysisSummary,
  id: number,
  approvalId: number,
  investigationId: number,
  planId: number
): RawRiskOpportunityAnalysis => {
  const now: Date = new Date();

  return {
    atualizadoEm: now,
    atualizadoPor: id,
    corDecisao: '',
    criadoEm: now,
    criadoPor: id,
    dataAnalise: summary.date,
    decisao: summary.decision,
    descricaoDecisao: summary.analysis,
    idAprovacaoNC: approvalId,
    idInvestigacao: investigationId,
    idPlano: planId,
    id: null,
    linhaConfigAnalise1: null,
    linhaConfigAnalise2: null,
    riscoOportunidade: null,
  };
};

export const mapInterestPartToRaw = (interestedPart: string, id: number): RawInterestedPart => {
  const now: Date = new Date();

  return {
    atualizadoEm: now,
    atualizadoPor: id,
    criadoEm: now,
    criadoPor: id,
    id: null,
    nomeParteInteressada: interestedPart,
  };
};
