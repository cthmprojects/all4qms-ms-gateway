import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import {
  AprovacaoNC,
  RawMaterial,
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
const complaintApiUrl = 'services/all4qmsmsrnc/api/reclamacaos';
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

export const find = createAsyncThunk('rnc/find', async (id: number) => {
  const url: string = `${apiUrl}/${id}`;
  return axios.get<Rnc>(url);
});

interface ListParams {
  statusAtual?: string;
  processoNC?: number;
  tipoNC?: string;
  dtIni?: string;
  dtFim?: string;
  page?: number;
  size?: number;
}

interface ProductComplaint {
  id: number;
  product: RawMaterial;
}

interface ClientComplaint {
  id: number;
  client: RncClient;
}

export const list = createAsyncThunk('rnc/list', async (params: ListParams) => {
  const { statusAtual, processoNC, tipoNC, dtIni, dtFim, page, size } = params;
  const queryParams: string[] = [];

  if (statusAtual) {
    queryParams.push(`statusAtual=${statusAtual}`);
  }

  if (processoNC) {
    queryParams.push(`processoNC=${processoNC}`);
  }

  if (tipoNC) {
    queryParams.push(`tipoNC=${tipoNC}`);
  }

  if (dtIni) {
    queryParams.push(`dtIni=${dtIni}`);
  }

  if (dtFim) {
    queryParams.push(`dtFim=${dtFim}`);
  }

  if (page !== undefined) {
    queryParams.push(`page=${page}`);
  }

  if (size !== undefined) {
    queryParams.push(`size=${size}`);
  }

  queryParams.push(`cacheBuster=${new Date().getTime()}`);

  const queryString = queryParams.join('&');
  const url = `${apiUrl}${queryString ? `?${queryString}` : ''}`;

  console.log('erickson', `list(${url})`);

  return axios.get<Array<Rnc>>(url);
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

export const getById = createAsyncThunk('rnc/', async (id: number) => {
  const response = await axios.get(`${apiUrl}/${id}`);
  return response;
});

export const deleteRnc = createAsyncThunk('rnc/delete', async (id: number) => {
  const response = await axios.delete(`${apiUrl}/${id}`);
  return response;
});

export const save = createAsyncThunk('rnc/save', async (rnc: Rnc) => {
  const response = await axios.post(apiUrl, rnc);
  return response;
});

export const update = createAsyncThunk('rnc/update', async (rnc: Rnc) => {
  const response = await axios.patch(`${apiUrl}/${rnc.id}`, rnc);
  return response;
});

export const saveAudit = createAsyncThunk('rnc/audit/save', async (audit: RncAudit) => {
  return await axiosSaveAudit(audit);
});

export const axiosSaveAudit = async (audit: RncAudit) => {
  const response = await axios.post(auditApiUrl, {
    sequecialAuditoria: audit.sequence,
    normaAuditoria: audit.norm,
    ocorrenciaAuditoria: audit.occurrence,
    requisitoAuditoria: audit.requirement,
    processoAuditoria: audit.process,
    idNaoConformidade: audit.rncId,
  });
  return response;
};

export const saveClient = createAsyncThunk('rnc/other/client', async (client: RncClient) => {
  return await axiosSaveClient(client);
});

export const saveClientComplaint = createAsyncThunk('rnc/other/client/complaint', async ({ id, client }: ClientComplaint) => {
  return await axiosSaveClient(client, id);
});

export const axiosSaveClient = async (client: RncClient, id?: number) => {
  const traceabilityResponse = await axios.post(traceabilityApiUrl, {
    dtEntregaNF: client.traceability.deliveredAt,
    numNF: client.traceability.identifier,
    dtNF: client.traceability.date,
    idNaoConformidade: client.traceability.rncId,
  });

  const complaintResponse = await axios.post(complaintApiUrl, {
    nomeClienteReclamacao: client.name,
  });

  const url = id ? `${productApiUrl}/${id}` : productApiUrl;

  const response = await axios.post(url, {
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

  return response;
};

export const saveOther = createAsyncThunk('rnc/other/save', async () => {
  const response = await axios.post('', {});
  return response;
});

export const saveProduct = createAsyncThunk('rnc/product/save', async (product: RawMaterial) => {
  return await axiosSaveProduct(product);
});

export const saveProductComplaint = createAsyncThunk('rnc/product/save/rnc', async ({ id, product }: ProductComplaint) => {
  return await axiosSaveProduct(product, id);
});

export const axiosSaveProduct = async (product: RawMaterial, id?: number) => {
  const url = id ? `${productApiUrl}/${id}` : productApiUrl;

  const traceabilityResponse = await axios.post(traceabilityApiUrl, {
    dtEntregaNF: product.traceability.deliveredAt,
    numNF: product.traceability.identifier,
    dtNF: product.traceability.date,
    idNaoConformidade: id,
  });

  const operatorResponse = await axios.post('services/all4qmsmsrnc/api/operador', {
    nomeOperador: product.operator,
    linhaOperador: product.line,
    turnoOperador: product.shift,
    nomeInspetorOperador: product.inspector,
  });

  const response = await axios.post(url, {
    codigoProduto: product.code,
    nomeProduto: product.description,
    idOperadorOcorrencia: operatorResponse.data?.id,
    nqa: product.nqa,
    qtdAmostra: product.samples,
    qtdDefeito: product.defects,
    qtdRejeicao: product.defects / product.samples,
    lote: product.batch,
    qtdLote: product.batchSize,
    regimeInspecao: product.inspectionRule,
    numPedido: product.requestNumber,
    numOP: product.opNumber,
    identificador: product.identifier,
    idRastreabilidadesRegistro: traceabilityResponse.data.id,
  });

  return response;
};

export const axiosGetProduct = async (productId: number) => {
  const product = await axios.get(`${productApiUrl}/${productId}`);
  const traceability = await axios.get(`${traceabilityApiUrl}/${product.data.idRastreabilidadesRegistro}`);
  const operator = await axios.get(`services/all4qmsmsrnc/api/operador/${product.data.idOperadorOcorrencia}`);

  return { product: product.data, traceability: traceability.data, operator: operator.data };
};

export const saveRawMaterial = createAsyncThunk('rnc/raw-material/save', async (rawMaterial: RawMaterial) => {
  return axiosSaveRawMaterial(rawMaterial);
});

export const axiosSaveRawMaterial = async (rawMaterial: RawMaterial) => {
  const traceabilityResponse = await axios.post(traceabilityApiUrl, {
    dtEntregaNF: rawMaterial.traceability.deliveredAt,
    numNF: rawMaterial.traceability.identifier,
    dtNF: rawMaterial.traceability.date,
    idNaoConformidade: rawMaterial.traceability.rncId,
  });

  const response = await axios.post(productApiUrl, {
    codigoProduto: rawMaterial.code,
    nomeProduto: '',
    nomeFornecedor: '',
    lote: rawMaterial.batch,
    qtdLote: rawMaterial.batchSize,
    nqa: rawMaterial.description,
    qtdAmostra: rawMaterial.samples,
    qtdDefeito: rawMaterial.defects,
    qtdRejeicao: rawMaterial.rejectionRate,
    numPedido: rawMaterial.requestNumber,
    numOP: rawMaterial.opNumber,
    identificador: rawMaterial.identifier,
    regimeInspecao: rawMaterial.inspectionRule,
    idRastreabilidadesRegistro: traceabilityResponse.data.id,
  });

  return response;
};

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
  const formData = new FormData();
  formData.append('detalhesNaoConformidade', description.details);
  formData.append('requisitoDescumprido', description.requirement);
  formData.append('evidenciaObjetiva', description.evidence);
  formData.append('naoConformidade', description.rncId.toString());

  // Convert the array of File objects to a Blob object
  const blobAnexos = new Blob(description.anexos);
  formData.append('anexos', blobAnexos);

  const response = await axios.post(descriptionApiUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
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

export const updateEffectCause = async (id, effectCause: RncEffectCause) => {
  return await axios.patch(`${effectCauseApiUrl}/${id}`, {
    id: id,
    descCausaEfeito: effectCause.description,
    meioAmbiente: effectCause.environment,
    maoDeObra: effectCause.workforce,
    metodo: effectCause.method,
    maquina: effectCause.machine,
    medicao: effectCause.measurement,
    materiaPrima: effectCause.rawMaterial,
  });
};

export const updateReason = async (id, reason: RncReason) => {
  return await axios.patch(`${reasonApiUrl}/${id}`, {
    id: id,
    descProblema: reason.problem,
    pq1: reason.first,
    pq2: reason.second,
    pq3: reason.third,
    pq4: reason.forth,
    pq5: reason.fifth,
    descCausa: reason.cause,
  });
};

export const saveInvestigation = async (id, effectCause?: RncEffectCause, reason?: RncReason) => {
  let effectId;
  let reasonId;

  if (effectCause) {
    await axios
      .post(effectCauseApiUrl, {
        descCausaEfeito: effectCause.description,
        meioAmbiente: effectCause.environment,
        maoDeObra: effectCause.workforce,
        metodo: effectCause.method,
        maquina: effectCause.machine,
        medicao: effectCause.measurement,
        materiaPrima: effectCause.rawMaterial,
      })
      .then(response => {
        effectId = response.data.id;
      });
  }

  if (reason) {
    await axios
      .post(reasonApiUrl, {
        descProblema: reason.problem,
        pq1: reason.first,
        pq2: reason.second,
        pq3: reason.third,
        pq4: reason.forth,
        pq5: reason.fifth,
        descCausa: reason.cause,
      })
      .then(response => {
        reasonId = response.data.id;
      });
  }

  await axios.post('services/all4qmsmsrnc/api/investigacao', {
    idNaoConformidade: id,
    idCausaEfeito: effectId,
    idPorques: reasonId,
  });
};

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
      .addMatcher(isPending(list), (state, action) => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(list), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          entity: null,
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
      .addMatcher(isFulfilled(update), (state, action) => {
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

        const { data } = action.payload;
        state.entity = { ...state.entity, vinculoAuditoria: data.id };
      })
      .addMatcher(isFulfilled(saveClient), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;

        const { data } = action.payload;
        state.entity = { ...state.entity, vinculoCliente: data.id };
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

        const { data } = action.payload;
        state.entity = { ...state.entity, vinculoProduto: data.id };
      })
      .addMatcher(isFulfilled(saveRawMaterial), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;

        const { data } = action.payload;
        state.entity = { ...state.entity, vinculoProduto: data.id };
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
      .addMatcher(isFulfilled(find), (state, action) => {
        const { data } = action.payload;

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = data;
      })
      .addMatcher(isFulfilled(getById), (state, action) => {
        const { data } = action.payload;
        state.updating = false;
        state.loading = false;
        state.entity = data;
      })
      .addMatcher(isFulfilled(deleteRnc), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      });
  },
});

export const { reset } = RncSlice.actions;

// Reducers
export default RncSlice.reducer;
