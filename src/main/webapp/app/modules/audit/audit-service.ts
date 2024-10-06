import { OnlyRequired } from 'app/shared/model/util';
import { NonConformityAudit, NonConformityDescriptionSummary, Rnc } from '../rnc/models';
import axios from 'axios';
import { PaginatedResponse } from 'app/shared/model/page.model';
import { Auditor, CronogramaAuditoria, ModeloAuditoria, PlanejamentoAuditoria } from './audit-models';

type NaoConformidadeRaw = Pick<NonConformityDescriptionSummary, 'detalhesNaoConformidade' | 'evidenciaObjetiva' | 'requisitoDescumprido'>;
type NaoConformidade = Pick<NonConformityDescriptionSummary, 'detalhesNaoConformidade' | 'evidenciaObjetiva' | 'requisitoDescumprido'> & {
  naoConformidade: number;
};
type AuditoriaRaw = Omit<NonConformityAudit, 'id' | 'normaAuditoria' | 'idNaoConformidade'>;
type Auditoria = Omit<NonConformityAudit, 'id' | 'normaAuditoria'>;

type GenerateRncPayload = {
  auditoria: AuditoriaRaw;
  naoConformidade: NaoConformidadeRaw;
  raizNaoConformidade: OnlyRequired<Rnc>;
};

const RncBaseUrl = 'services/all4qmsmsrnc/api';
const AuditBaseUrl = 'services/all4qmsmsauditplan/api';

function parseRawCronograma(payload: any) {
  return {
    ...payload,
    periodoInicial: new Date(payload.periodoInicial),
    periodoFinal: new Date(payload.periodoFinal),
  } as CronogramaAuditoria;
}

function parseRawPlanejamento(payload: any) {
  return {
    ...payload,
    cronograma: parseRawCronograma(payload.cronograma),
  } as PlanejamentoAuditoria;
}

function parseRawModelo(payload: any) {
  return {
    ...payload,
    modelo: parseRawModelo(payload.modelo),
  } as ModeloAuditoria;
}

// RNC REQUESTS
async function saveRaizNaoConformidade(raizNaoConformidade: OnlyRequired<Rnc>) {
  const { data } = await axios.post<Rnc>(`${RncBaseUrl}/nao-conformidades`, raizNaoConformidade);
  return data;
}

async function saveAuditoria(auditoria: Auditoria) {
  const { data } = await axios.post<NonConformityAudit>(`${RncBaseUrl}/auditorias`, auditoria);
  return data;
}

async function saveRnc(naoConformidade: NaoConformidade) {
  var form_data = new FormData();

  for (var key in naoConformidade) {
    form_data.append(key, naoConformidade[key]);
  }
  const { data } = await axios.post<NonConformityAudit>(`${RncBaseUrl}/descricao-nao-conformidades`, form_data);
  return data;
}

export async function generateRnc({ auditoria, naoConformidade, raizNaoConformidade }: GenerateRncPayload) {
  const raizResult = await saveRaizNaoConformidade(raizNaoConformidade);
  const auditoriaResult = await saveAuditoria({ ...auditoria, idNaoConformidade: raizResult.id });
  const naoConformidadeResult = await saveRnc({ ...naoConformidade, naoConformidade: raizResult.id });

  return naoConformidadeResult;
}

// AUDIT REQUESTS
export const getPaginatedCronograma = async (params: Record<string, number | string>) => {
  const { data } = await axios.get<PaginatedResponse<CronogramaAuditoria>>(`${AuditBaseUrl}/auditoria/cronogramas/filter`, {
    params,
  });

  return { ...data, content: data.content.map(parseRawCronograma) };
};

export async function saveCronograma(cronograma: CronogramaAuditoria) {
  const { data } = await axios.post<CronogramaAuditoria>(`${AuditBaseUrl}/auditoria/cronogramas`, cronograma);
  return data;
}

export async function getCronogramaById(id: number) {
  const { data } = await axios.get<CronogramaAuditoria>(`${AuditBaseUrl}/auditoria/cronogramas/${id}`);
  return parseRawCronograma(data);
}

export async function updateCronograma(cronograma: CronogramaAuditoria) {
  const { data } = await axios.put<CronogramaAuditoria>(`${AuditBaseUrl}/auditoria/cronogramas/${cronograma.id}`, cronograma);
  return data;
}

export const getPaginatedModelos = async (params: Record<string, number | string>) => {
  const { data } = await axios.get<PaginatedResponse<ModeloAuditoria>>(`${AuditBaseUrl}/auditoria/modelos`, {
    params,
  });

  return data;
};

export const getPaginatedAuditor = async (params: Record<string, number | string>) => {
  const { data } = await axios.get<PaginatedResponse<Auditor>>(`${AuditBaseUrl}/auditoria/auditores`, {
    params,
  });

  return data;
};

export async function saveAuditor(auditor: Auditor) {
  const { data } = await axios.post<Auditor>(`${AuditBaseUrl}/auditoria/auditores`, auditor);
  return data;
}

export async function updateAuditor(auditor: Auditor) {
  const { data } = await axios.put<Auditor>(`${AuditBaseUrl}/auditoria/auditores/${auditor.id}`, auditor);
  return data;
}

export const getPaginatedPlanejamento = async (params: Record<string, number | string>) => {
  const { data } = await axios.get<PaginatedResponse<PlanejamentoAuditoria>>(`${AuditBaseUrl}/auditoria/planejamentos/filter`, {
    params,
  });
  return { ...data, content: data.content.map(parseRawPlanejamento) };
};

async function savePlanejamento(planejamento: PlanejamentoAuditoria) {
  const { data } = await axios.post<PlanejamentoAuditoria>(`${AuditBaseUrl}/auditoria/planejamentos`, planejamento);
  return data;
}

async function updatePlanejamento(planejamento: PlanejamentoAuditoria) {
  const { data } = await axios.put<PlanejamentoAuditoria>(`${AuditBaseUrl}/auditoria/planejamentos/${planejamento.id}`, planejamento);
  return data;
}

export async function persistPlanejamento(planejamento: PlanejamentoAuditoria) {
  return await (planejamento?.id ? updatePlanejamento(planejamento) : savePlanejamento(planejamento));
}

export async function getPlanejamentoById(id: number) {
  const { data } = await axios.get<PlanejamentoAuditoria>(`${AuditBaseUrl}/auditoria/planejamentos/${id}`);
  return parseRawPlanejamento(data);
}

export async function getModelById(id: number) {
  const { data } = await axios.get<ModeloAuditoria>(`${AuditBaseUrl}/auditoria/modelos/${id}`);
  return parseRawModelo(data);
}
