import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import {
  AprovacaoNC,
  Rnc,
  RncAudit,
  RncClient,
  RncDescription,
  RncEffectCause,
  RncImmediateAction,
  RncPlannedAction,
  RncProduct,
  RncRange,
  RncReason,
  RncTraceability,
} from '../models';

// Constants
const apiUrl = 'services/all4qmsmsrnc/api/nao-conformidades';
const aprovacaoNCApiUrl = 'services/all4qmsmsrnc/api/aprovacao-ncs';
const auditApiUrl = 'services/all4qmsmsrnc/api/auditorias';
const descriptionApiUrl = 'services/all4qmsmsrnc/api/descricao-nao-conformidades';
const effectCauseApiUrl = 'services/all4qmsmsrnc/api/causa-efeitos';
const immediateActionApiUrl = 'services/all4qmsmsrnc/api/acao-imediatas';
const planApiUrl = 'services/all4qmsmsrnc/api/planos';
const plannedActionApiUrl = 'services/all4qmsmsrnc/api/acao-planos';
const productApiUrl = 'services/all4qmsmsrnc/api/produtos';
const rangeApiUrl = 'services/all4qmsmsrnc/api/abrangencias';
const reasonApiUrl = 'services/all4qmsmsrnc/api/porques';
const traceabilityApiUrl = 'services/all4qmsmsrnc/api/rastreabilidades';

// Initial State
const initialState: EntityState<Rnc> = {
  entities: [],
  entity: null,
  errorMessage: null,
  loading: false,
  updateSuccess: false,
  updating: false,
  links: null,
  totalItems: 0,
};

// Actions
export const remove = createAsyncThunk('rnc/delete', async ({ page, query, size, sort }: IQueryParams) => {});

export const find = createAsyncThunk('rnc/find', async ({ page, query, size, sort }: IQueryParams) => {});

export const list = createAsyncThunk('rnc/list', async ({ page, query, size, sort }: IQueryParams) => {
  const params: Array<string> = [];

  if (page) {
    params.push(`page=${page}`);
  }

  if (size) {
    params.push(`size=${size}`);
  }

  if (sort) {
    params.push(`sort=${sort}`);
  }

  params.push(`cacheBuster=${new Date().getTime()}`);

  const queryParams: string = params.join('&');

  const url: string = `${apiUrl}${queryParams && queryParams.length > 0 ? `?${queryParams}` : ''}`;

  return axios.get<Array<Rnc>>(url, { data: {}, params: {} });
});

export const listAprovacaoNC = createAsyncThunk(aprovacaoNCApiUrl, async ({ page, query, size, sort }: IQueryParams) => {
  const params: Array<string> = [];

  if (page) {
    params.push(`page=${page}`);
  }

  if (size) {
    params.push(`size=${size}`);
  }

  if (sort) {
    params.push(`sort=${sort}`);
  }

  params.push(`cacheBuster=${new Date().getTime()}`);

  const queryParams: string = params.join('&');

  const url: string = `${apiUrl}${queryParams && queryParams.length > 0 ? `?${queryParams}` : ''}`;

  return axios.get<Array<AprovacaoNC>>(url, { data: {}, params: {} });
});

export const save = createAsyncThunk('rnc/save', async (rnc: Rnc) => {
  const response = await axios.post(apiUrl, rnc);
  return response;
});

export const update = createAsyncThunk('rnc/update', async ({ page, query, size, sort }: IQueryParams) => {});

export const saveAudit = createAsyncThunk('rnc/audit/save', async (audit: RncAudit) => {
  const response = await axios.post(auditApiUrl, {
    sequecialAuditoria: audit.sequence,
    normaAuditoria: audit.norm,
    ocorrenciaAuditoria: audit.occurrence,
    requisitoAuditoria: audit.requirement,
    processoAuditoria: audit.process,
    idNaoConformidade: audit.rncId,
  });
  return response;
});

export const saveClient = createAsyncThunk('rnc/other/client', async (client: RncClient) => {
  const traceabilityResponse = await axios.post(traceabilityApiUrl, {
    dtEntregaNF: client.traceability.deliveredAt,
    numNF: client.traceability.identifier,
    dtNF: client.traceability.date,
    idNaoConformidade: client.traceability.rncId,
  });

  const response = await axios.post(productApiUrl, {
    codigoProduto: client.code,
    nomeProduto: client.name,
    nomeFornecedor: client.supplier,
    lote: client.batch,
    qtdLote: client.batchAmount,
    nqa: client.description,
    qtdAmostra: client.samples,
    qtdDefeito: client.defects,
    qtdRejeicao: client.rejected,
    numPedido: client.order,
    numOP: client.opNumber,
    idRastreabilidadesRegistro: traceabilityResponse.data.id,
  });
});

export const saveOther = createAsyncThunk('rnc/other/save', async () => {
  const response = await axios.post('', {});
  return response;
});

export const saveProduct = createAsyncThunk('rnc/product/save', async (product: RncProduct) => {
  const traceabilityResponse = await axios.post(traceabilityApiUrl, {
    dtEntregaNF: product.traceability.deliveredAt,
    numNF: product.traceability.identifier,
    dtNF: product.traceability.date,
    idNaoConformidade: product.traceability.rncId,
  });

  const response = await axios.post(productApiUrl, {
    codigoProduto: product.code,
    nomeProduto: product.name,
    nomeFornecedor: product.supplier,
    lote: product.batch,
    qtdLote: product.batchAmount,
    nqa: product.description,
    qtdAmostra: product.samples,
    qtdDefeito: product.defects,
    qtdRejeicao: product.rejected,
    numPedido: product.order,
    numOP: product.opNumber,
    idRastreabilidadesRegistro: traceabilityResponse.data.id,
  });

  return response;
});

export const saveRawMaterial = createAsyncThunk('rnc/raw-material/save', async () => {
  const response = await axios.post('', {});
  return response;
});

export const saveTraceability = createAsyncThunk('rnc/traceability/save', async (traceability: RncTraceability) => {
  const response = await axios.post(traceabilityApiUrl, {
    dtEntregaNF: traceability.deliveredAt,
    numNF: traceability.identifier,
    dtNF: traceability.date,
    idNaoConformidade: traceability.rncId,
  });
  return response;
});

export const saveDescription = createAsyncThunk('rnc/description/save', async (description: RncDescription) => {
  const response = await axios.post(descriptionApiUrl, {
    detalhesNaoConformidade: description.details,
    requisitoDescumprido: description.requirement,
    evidenciaObjetiva: description.evidence,
    idNaoConformidade: description.rncId,
  });
  return response;
});

export const saveImmediateAction = createAsyncThunk('rnc/immediate-action/save', async (action: RncImmediateAction) => {
  const response = await axios.post(immediateActionApiUrl, {
    descricaoAcaoImediata: action.description,
    prazoAcaoImediata: action.deadline,
    validacaoAcaoImediata: action.validated,
    inconformidadeAcaoImediata: action.problem,
    statusAcaoImediata: action.status,
    idResponsavelAcaoImediata: action.responsibleId,
    idResponsavelValidacaoAcaoImediata: action.verifierId,
    idNaoConformidade: action.rncId,
  });
  return response;
});

export const savePlannedAction = createAsyncThunk('rnc/planned-action/save', async (action: RncPlannedAction) => {
  const planResponse = await axios.post(planApiUrl, {
    descricaoPlano: action.plan.description,
    prazoPlano: action.plan.deadline,
    reponsavelPlano: action.plan.responsibleId,
    statusPlano: action.plan.status,
    qtdAcoes: action.plan.actions,
    qtdAcoesConcluidas: action.plan.completedActions,
    percentualPlano: action.plan.percentage,
    dtConclusaoPlano: action.plan.completion,
    idNaoConformidade: action.plan.rncId,
  });

  const response = await axios.post(plannedActionApiUrl, {
    descricaoAcao: action.description,
    objetivoAcao: action.goal,
    setorAcao: action.sector,
    prazoAcao: action.deadline,
    responsavelAcao: action.responsibleId,
    custoAcao: action.cost,
    resultadoExecucao: action.result,
    percentualExecucao: action.percentage,
    dataExecucao: action.date,
    anexosExecucao: action.attachments,
    conformidadeAcao: action.conformant,
    motivoDiscondancia: action.discordanceReason,
    resultadoAvaliacao: action.evaluationResult,
    dataAvaliacao: action.evaluationDate,
    anexosAvaliacao: action.evaluationAttachments,
    acaoConcluida: action.completed,
    dataConclusaoAcao: action.completionDate,
    statusAcao: action.status,
    plano: planResponse.data.id,
  });
  return response;
});

export const saveEffectCause = createAsyncThunk('rnc/effect-cause/save', async (effectCause: RncEffectCause) => {
  const response = await axios.post(effectCauseApiUrl, {
    descCausaEfeito: effectCause.description,
    meioAmbiente: effectCause.environment,
    maoDeObra: effectCause.workforce,
    metodo: effectCause.method,
    maquina: effectCause.machine,
    medicao: effectCause.measurement,
    materiaPrima: effectCause.rawMaterial,
  });
  return response;
});

export const saveReason = createAsyncThunk('rnc/reason/save', async (reason: RncReason) => {
  const response = await axios.post(reasonApiUrl, {
    descProblema: reason.problem,
    pq1: reason.first,
    pq2: reason.second,
    pq3: reason.third,
    pq4: reason.forth,
    pq5: reason.fifth,
    descCausa: reason.cause,
  });
  return response;
});

export const saveRange = createAsyncThunk('rnc/range/save', async (range: RncRange) => {
  const response = await axios.post(rangeApiUrl, {
    descricaoAbrangencia: range.description,
    idNaoConformidade: range.rncId,
  });
  return response;
});

// Slices

const RncSlice = createEntitySlice({
  name: 'rnc',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(list), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(save), (state, action) => {
        const { data } = action.payload;

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = data;
      })
      .addMatcher(isFulfilled(saveAudit), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(saveClient), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(saveDescription), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(saveOther), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(saveProduct), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(saveRawMaterial), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(saveTraceability), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(saveEffectCause), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(saveImmediateAction), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(savePlannedAction), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(saveReason), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(saveRange), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(listAprovacaoNC), (state, action) => {
        const { data } = action.payload;

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;

        for (let i = 0; i < state.entities.length; i++) {
          const currentRNC = state.entities[i];
          const aprovacoes = data.filter(a => a.id === currentRNC.aprovacaoNC);
          currentRNC.aprovacao = aprovacoes.length > 0 ? aprovacoes[0] : null;
        }
      });
  },
});

export const { reset } = RncSlice.actions;

// Reducers
export default RncSlice.reducer;
