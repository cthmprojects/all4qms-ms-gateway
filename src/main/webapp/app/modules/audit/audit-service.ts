import { OnlyRequired } from 'app/shared/model/util';
import { NonConformityAudit, NonConformityDescriptionSummary, Rnc } from '../rnc/models';
import axios from 'axios';
import { PaginatedResponse } from 'app/shared/model/page.model';
import { CronogramaAuditoria, ModeloAuditoria } from './audit-models';

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
  const { data } = await axios.get<PaginatedResponse<CronogramaAuditoria>>(`${AuditBaseUrl}/auditoria/cronogramas`, {
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
