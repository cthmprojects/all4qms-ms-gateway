import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { AprovacaoNC, Plan } from 'app/modules/rnc/models';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { mapInterestPartToRaw } from '../mappers';
import {
  ActionPlanEfficacy,
  ActionPlanImplementation,
  ActionPlanSummary,
  AnalysisDetails,
  Ishikawa,
  PaginatedResource,
  RawCauseEffectInvestigation,
  RawCompleteAnalysis,
  RawInterestedPart,
  RawInvestigation,
  RawIshikawaInvestigation,
  RawPlanWithActions,
  RawRiskOpportunity,
  Reason,
  RiskOpportunity,
  RiskOpportunityFromList,
} from '../models';

const apiRiscoOportunidadeUrl = 'services/all4qmsmsrisco/api/risco/risco-oportunidades';
const apiRiscoOportunidadeTipoROUrl = 'services/all4qmsmsrisco/api/risco/risco-oportunidades/tipo-ro';
const apiRiscoOportunidadeFiltroUrl = 'services/all4qmsmsrisco/api/risco/risco-oportunidades/filtro';
const apiLinhaConfigRoUrl = 'services/all4qmsmsrisco/api/risco/linha-configros';
const apiAnaliseRoUrl = 'services/all4qmsmsrisco/api/risco/analise-ros';
const aprovacaoNcUrl = 'services/all4qmsmsrnc/api/aprovacao-ncs';
const planApiUrl = 'services/all4qmsmsrnc/api/planos';
const investigationApiUrl = 'services/all4qmsmsrnc/api/investigacao';
const actionPlanApiUrl = 'services/all4qmsmsrnc/api/acao-planos';
const ishikawaApiUrl = 'services/all4qmsmsrnc/api/causa-efeitos';
const reasonsApiUrl = 'services/all4qmsmsrnc/api/porques';
const apiPartesInteressadasUrl = 'services/all4qmsmsrisco/api/risco/partes-interessadas';

// Initial State
const initialState: EntityState<RawRiskOpportunity> = {
  entities: [],
  entity: null,
  errorMessage: null,
  loading: false,
  updateSuccess: false,
  updating: false,
  links: null,
  totalItems: 0,
};

interface ListParams {
  tipoRO: string;
  probabilidadeComplexidade?: string;
  severidadeMelhoria?: string;
  page?: number;
  size?: number;
  decisao?: string;
  idProcesso?: number;
  pesquisa?: string;
}

interface ListPagination {
  page?: number;
  size?: number;
}

interface RiskOpportunityPayload {
  senderId: number;
  efficacy: ActionPlanEfficacy;
  implementation: ActionPlanImplementation;
  actionPlanSummary: ActionPlanSummary;
  ishikawa: Ishikawa | null;
  reasons: Reason | null;
  details: AnalysisDetails;
  interestedParts: Array<string>;
  riskOpportunity: RawRiskOpportunity;
}

const formatDate = (date: Date, shortened: boolean = false): string => {
  const year: string = date.getFullYear().toString();
  const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
  const day: string = date.getDate().toString().padStart(2, '0');
  const hours: string = date.getHours().toString().padStart(2, '0');
  const minutes: string = date.getMinutes().toString().padStart(2, '0');
  const seconds: string = date.getSeconds().toString().padStart(2, '0');
  const milliseconds: string = date.getMilliseconds().toString().padStart(3, '0');

  const long: string = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  const short: string = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return !shortened ? long : short;
};

export const listROs = createAsyncThunk('ro/list', async (params: ListPagination) => {
  const { page, size } = params;
  const queryParams: string[] = [];
  if (page) {
    queryParams.push(`page=${page}`);
  }

  if (size) {
    queryParams.push(`size=${size}`);
  }

  queryParams.push(`cacheBuster=${new Date().getTime()}`);
  const queryString = queryParams.join('&');

  return axios.get<Array<RawRiskOpportunity>>(`${apiRiscoOportunidadeUrl}${queryString ? `?${queryString}` : ''}`);
});

export const listROFiltro = async (params: ListParams) => {
  const { page, size, ...rest } = params;

  const queryParams: string[] = [];

  if (page) {
    queryParams.push(`page=${page}`);
  }

  if (size) {
    queryParams.push(`size=${size}`);
  }

  queryParams.push('sort=desc');
  queryParams.push(`cacheBuster=${new Date().getTime()}`);

  const queryString = queryParams.join('&');

  const realParams = {};

  for (const key of Object.keys(rest)) {
    const value = rest[key];
    if (value) {
      realParams[key] = value;
    }
  }

  return (
    await axios.post<PaginatedResource<RiskOpportunityFromList>>(
      `${apiRiscoOportunidadeFiltroUrl}${queryString ? `?${queryString}` : ''}`,
      realParams
    )
  ).data;
};

export const createRO = createAsyncThunk('ro/create', async (data: RiskOpportunity) => {
  return await axios.post<RawRiskOpportunity>(apiRiscoOportunidadeUrl, data);
});

interface updateParams {
  id: number | string;
  data: RiskOpportunity;
}
export const updateRO = createAsyncThunk('ro/update', async ({ data, id }: updateParams) => {
  return await axios.patch(`${apiRiscoOportunidadeUrl}/${id}`, data);
});

export const deleteRO = createAsyncThunk('ro/delete', async (id: number | string) => {
  return await axios.delete(`${apiRiscoOportunidadeUrl}/${id}`);
});

export const getROById = createAsyncThunk('ro/get', async (id: number | string) => {
  const { data } = await axios.get<RawRiskOpportunity>(`${apiRiscoOportunidadeUrl}/${id}`);

  return data;
});

export const editRiskOpportunity = createAsyncThunk('ro/edit', async (payload: RiskOpportunityPayload) => {
  const { actionPlanSummary, details, efficacy, implementation, interestedParts, ishikawa, riskOpportunity, reasons, senderId } = payload;

  const interestedPartIdToBeRemoved: number = riskOpportunity.idPartesInteressadas;
  if (interestedPartIdToBeRemoved > 0) {
    await axios.delete(`${apiPartesInteressadasUrl}/${interestedPartIdToBeRemoved}`);
  }

  const analysisIdsToBeRemoved: Array<number> = riskOpportunity.idsAnaliseROS;
  if (analysisIdsToBeRemoved && analysisIdsToBeRemoved.length > 0) {
    for (let i = 0; i < analysisIdsToBeRemoved.length; i++) {
      const analysisIdToBeRemoved: number = analysisIdsToBeRemoved[i];
      await axios.delete(`${apiAnaliseRoUrl}/${analysisIdToBeRemoved}`);
    }
  }

  const riskOpportunityInterestedPartsIds: Array<number> = [];
  for (let i = 0; i < interestedParts.length; i++) {
    const interestedPart: string = interestedParts[i];

    const interestPartId: number | null = await saveInterestedPartAsync(mapInterestPartToRaw(interestedPart, senderId));

    if (interestPartId) {
      riskOpportunityInterestedPartsIds.push(interestPartId);
    }
  }

  riskOpportunity.idPartesInteressadas = riskOpportunityInterestedPartsIds.length > 0 ? riskOpportunityInterestedPartsIds[0] : 0;

  riskOpportunity.idsAnaliseROS = null;

  const response = await axios.put<RawRiskOpportunity>(`${apiRiscoOportunidadeUrl}/${riskOpportunity.id}`, riskOpportunity);

  if (response.status !== 201) {
    return null;
  }

  const resource: RawRiskOpportunity = response.data;

  const now: Date = new Date();

  const body: RawCompleteAnalysis = {
    acoesPlano: [
      {
        atualizadoEm: null,
        criadoEm: null,
        descricaoAcao: actionPlanSummary.actionDescription,
        prazoAcao: formatDate(actionPlanSummary.actionDate, true),
        idResponsavelAcao: actionPlanSummary.responsibleId,
        statusAcao: 'PENDENTE',
        dataVerificao: formatDate(actionPlanSummary.actionVerificationDate, true),
        idResponsavelVerificaoAcao: actionPlanSummary.actionVerifierId,
        idAnexosExecucao: null,
        dataConclusaoAcao: actionPlanSummary.actionVerificationDate,
        idPlano: null,
        planoId: null,
      },
    ],
    analise: {
      atualizadoEm: now,
      atualizadoPor: senderId,
      corDecisao: '',
      criadoEm: now,
      criadoPor: senderId,
      dataAnalise: now,
      decisao: details.meaning,
      descricaoDecisao: details.description,
      idAprovacaoNC: null,
      idInvestigacao: null,
      idPlano: null,
      linhaConfigAnalise1: details.probability,
      linhaConfigAnalise2: details.severity,
      riscoOportunidade: resource,
    },
    aprovacao: {
      alterarRisco: true,
      atualizadoEm: now,
      criadoEm: now,
      dataEficacia: efficacy.efficacyVerificationDate,
      dataFechamento: null,
      dataImplementacao: implementation.implementationDate,
      descEficacia: efficacy.efficacyDescription,
      descFechamento: '',
      descImplementacao: implementation.implementationDescription,
      novoRegistro: true,
      possuiEficacia: efficacy.efficacyVerified,
      possuiImplementacao: implementation.implemented,
      responsavelEficacia: efficacy.efficacyResponsibleId,
      responsavelFechamento: null,
      responsavelImplementacao: implementation.implementationResponsibleId,
      vinculoRisco: resource.id,
    },
    ishikawa: {
      descCausaEfeito: ishikawa?.cause,
      maoDeObra: ishikawa?.workforce,
      maquina: ishikawa?.machine,
      materiaPrima: ishikawa?.rawMaterial,
      medicao: ishikawa?.measurement,
      meioAmbiente: ishikawa?.environment,
      metodo: ishikawa?.method,
    },
    plano: {
      atualizadoEm: now,
      criadoEm: now,
      statusPlano: 'ABERTO',
      qtdAcoes: 1,
      qtdAcoesConcluidas: 0,
      percentualPlano: 0,
      dtConclusaoPlano: formatDate(actionPlanSummary.actionDate),
      idNaoConformidade: 1,
    },
    porques: {
      descCausa: reasons?.cause,
      descProblema: reasons?.effect,
      pq1: reasons?.reason1,
      pq2: reasons?.reason2,
      pq3: reasons?.reason3,
      pq4: reasons?.reason4,
      pq5: reasons?.reason5,
    },
  };

  await axios.post(apiAnaliseRoUrl, body);

  return resource;
});

export const saveRiskOpportunity = createAsyncThunk('ro/save', async (payload: RiskOpportunityPayload) => {
  const { actionPlanSummary, details, efficacy, implementation, interestedParts, ishikawa, riskOpportunity, reasons, senderId } = payload;

  const riskOpportunityInterestedPartsIds: Array<number> = [];
  for (let i = 0; i < interestedParts.length; i++) {
    const interestedPart: string = interestedParts[i];

    const interestPartId: number | null = await saveInterestedPartAsync(mapInterestPartToRaw(interestedPart, senderId));

    if (interestPartId) {
      riskOpportunityInterestedPartsIds.push(interestPartId);
    }
  }

  riskOpportunity.idPartesInteressadas = riskOpportunityInterestedPartsIds.length > 0 ? riskOpportunityInterestedPartsIds[0] : 0;

  const response = await axios.post<RawRiskOpportunity>(apiRiscoOportunidadeUrl, riskOpportunity);

  if (response.status !== 201) {
    return null;
  }

  const resource: RawRiskOpportunity = response.data;

  const now: Date = new Date();

  const body: RawCompleteAnalysis = {
    acoesPlano: [
      {
        atualizadoEm: null,
        criadoEm: null,
        descricaoAcao: actionPlanSummary.actionDescription,
        prazoAcao: formatDate(actionPlanSummary.actionDate, true),
        idResponsavelAcao: actionPlanSummary.responsibleId,
        statusAcao: 'PENDENTE',
        dataVerificao: formatDate(actionPlanSummary.actionVerificationDate, true),
        idResponsavelVerificaoAcao: actionPlanSummary.actionVerifierId,
        idAnexosExecucao: null,
        dataConclusaoAcao: actionPlanSummary.actionVerificationDate,
        idPlano: null,
        planoId: null,
      },
    ],
    analise: {
      atualizadoEm: now,
      atualizadoPor: senderId,
      corDecisao: '',
      criadoEm: now,
      criadoPor: senderId,
      dataAnalise: now,
      decisao: details.meaning,
      descricaoDecisao: details.description,
      idAprovacaoNC: null,
      idInvestigacao: null,
      idPlano: null,
      linhaConfigAnalise1: details.probability,
      linhaConfigAnalise2: details.severity,
      riscoOportunidade: resource,
    },
    aprovacao: {
      alterarRisco: true,
      atualizadoEm: now,
      criadoEm: now,
      dataEficacia: efficacy.efficacyVerificationDate,
      dataFechamento: null,
      dataImplementacao: implementation.implementationDate,
      descEficacia: efficacy.efficacyDescription,
      descFechamento: '',
      descImplementacao: implementation.implementationDescription,
      novoRegistro: true,
      possuiEficacia: efficacy.efficacyVerified,
      possuiImplementacao: implementation.implemented,
      responsavelEficacia: efficacy.efficacyResponsibleId,
      responsavelFechamento: null,
      responsavelImplementacao: implementation.implementationResponsibleId,
      vinculoRisco: resource.id,
    },
    ishikawa: {
      descCausaEfeito: ishikawa?.cause,
      maoDeObra: ishikawa?.workforce,
      maquina: ishikawa?.machine,
      materiaPrima: ishikawa?.rawMaterial,
      medicao: ishikawa?.measurement,
      meioAmbiente: ishikawa?.environment,
      metodo: ishikawa?.method,
    },
    plano: {
      atualizadoEm: now,
      criadoEm: now,
      statusPlano: 'ABERTO',
      qtdAcoes: 1,
      qtdAcoesConcluidas: 0,
      percentualPlano: 0,
      dtConclusaoPlano: formatDate(actionPlanSummary.actionDate),
      idNaoConformidade: 1,
    },
    porques: {
      descCausa: reasons?.cause,
      descProblema: reasons?.effect,
      pq1: reasons?.reason1,
      pq2: reasons?.reason2,
      pq3: reasons?.reason3,
      pq4: reasons?.reason4,
      pq5: reasons?.reason5,
    },
  };

  await axios.post(apiAnaliseRoUrl, body);

  return resource;
});

const saveInterestedPartAsync = async (interestedPart: RawInterestedPart): Promise<number | null> => {
  const response = await axios.post<RawInterestedPart>(apiPartesInteressadasUrl, interestedPart);

  if (response.status === 201) {
    return response.data?.id;
  } else {
    return null;
  }
};

export const getApprovalById = async (id: number): Promise<AprovacaoNC> => {
  const response = await axios.get<AprovacaoNC>(`${aprovacaoNcUrl}/${id}`);
  const resource = response.data;

  return resource;
};

export const getPlanById = async (id: number): Promise<RawPlanWithActions> => {
  const response = await axios.get<RawPlanWithActions>(`${planApiUrl}/byidplano/${id}`);
  const resource = response.data;

  return resource;
};

export const getInvestigationById = async (id: number): Promise<RawInvestigation> => {
  const response = await axios.get<RawInvestigation>(`${investigationApiUrl}/${id}`);
  const resource = response.data;

  return resource;
};

export const getIshikawaById = async (id: number): Promise<RawIshikawaInvestigation> => {
  const response = await axios.get<RawIshikawaInvestigation>(`${ishikawaApiUrl}/${id}`);
  const resource = response.data;

  return resource;
};

export const getReasonsById = async (id: number): Promise<RawCauseEffectInvestigation> => {
  const response = await axios.get<RawCauseEffectInvestigation>(`${reasonsApiUrl}/${id}`);
  const resource = response.data;

  return resource;
};

const ROSlice = createEntitySlice({
  name: 'risco',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isPending(listROs), (state, action) => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(listROs), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          entity: null,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(createRO), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(deleteRO), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(updateRO), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(getROById), (state, action) => {
        return {
          ...state,
          loading: false,
          entity: action.payload,
        };
      })
      .addMatcher(isFulfilled(saveRiskOpportunity), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(editRiskOpportunity), (state, action) => {
        state.loading = false;
        state.entity = action.payload;
      });
  },
});

export const { reset } = ROSlice.actions;

// Reducers
export default ROSlice.reducer;
