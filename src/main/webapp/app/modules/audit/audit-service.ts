import { OnlyRequired } from 'app/shared/model/util';
import { NonConformityAudit, NonConformityDescriptionSummary, Rnc } from '../rnc/models';
import axios from 'axios';
import { PaginatedResponse } from 'app/shared/model/page.model';
import {
  AgendamentoAuditoria,
  Auditor,
  CronogramaAuditoria,
  ModeloAuditoria,
  PlanejamentoAuditoria,
  RegistrarAuditoriaForm,
  RegistroAuditoria,
} from './audit-models';
import { Process } from '../infodoc/models';
import { IUsuario } from 'app/shared/model/usuario.model';

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

function parseRawAgendamento(payload: any) {
  return {
    ...payload,
    dataAuditoria: new Date(payload.dataAuditoria),
    horaFinal: new Date(payload.horaFinal),
    horaInicial: new Date(payload.horaInicial),
  } as AgendamentoAuditoria;
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
  return parseRawCronograma(data);
}

export async function getCronogramaById(id: number) {
  const { data } = await axios.get<CronogramaAuditoria>(`${AuditBaseUrl}/auditoria/cronogramas/${id}`);
  return parseRawCronograma(data);
}

export async function updateCronograma(cronograma: CronogramaAuditoria) {
  const { data } = await axios.put<CronogramaAuditoria>(`${AuditBaseUrl}/auditoria/cronogramas/${cronograma.id}`, cronograma);
  return parseRawCronograma(data);
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

export async function getProcessos() {
  const { data } = await axios.get<Array<Process>>(`services/all4qmsmsgateway/api/processos`);
  return data;
}

export async function getUsuarios() {
  const params = { page: 0, size: 100 };
  const { data } = await axios.get<Array<IUsuario>>(`/api/usuarios`, { params });
  return data;
}

export async function getProcessoById(id: number) {
  const { data } = await axios.get<Process>(`services/all4qmsmsgateway/api/processos/${id}`);
  return data;
}

export const getPaginatedAgendamento = async (params: Record<string, number | string>) => {
  const { data } = await axios.get<PaginatedResponse<AgendamentoAuditoria>>(`${AuditBaseUrl}/auditoria/agendamentos`, {
    params,
  });
  return { ...data, content: data.content.map(parseRawAgendamento) };
};

async function saveAgendamento(agendamento: AgendamentoAuditoria) {
  const { data } = await axios.post<AgendamentoAuditoria>(`${AuditBaseUrl}/auditoria/agendamentos`, agendamento);
  return parseRawAgendamento(data);
}

async function updateAgendamento(agendamento: AgendamentoAuditoria) {
  const { data } = await axios.put<AgendamentoAuditoria>(`${AuditBaseUrl}/auditoria/agendamentos/${agendamento.id}`, agendamento);
  return parseRawAgendamento(data);
}

export async function persistAgendamento(agendamento: AgendamentoAuditoria) {
  const result = await (agendamento?.id ? updateAgendamento(agendamento) : saveAgendamento(agendamento));
  return result;
}

export async function getRegistroById(id: number) {
  const { data } = await axios.get<RegistroAuditoria>(`${AuditBaseUrl}/auditoria/registros/${id}`);
  return data;
}

export async function getAgendamentoById(id: number) {
  const { data } = await axios.get<AgendamentoAuditoria>(`${AuditBaseUrl}/auditoria/agendamentos/${id}`);
  const planejamento = await getPlanejamentoById(data.planejamento.id);
  data.planejamento = planejamento;
  if (data.registro?.id) {
    const registro = await getRegistroById(data.registro?.id);
    data.registro = registro;
  }
  return parseRawAgendamento(data);
}

async function saveRegistro(registro: RegistroAuditoria) {
  const { data } = await axios.post<RegistroAuditoria>(`${AuditBaseUrl}/auditoria/registros`, registro);
  return data;
}

async function updateRegistro(registro: RegistroAuditoria) {
  const { data } = await axios.put<RegistroAuditoria>(`${AuditBaseUrl}/auditoria/registros/${registro.id}`, registro);
  return data;
}

async function persistRegistro(registro: RegistroAuditoria) {
  const result = await (registro?.id ? updateRegistro(registro) : saveRegistro(registro));
  return result;
}

async function saveRegistroAuditoria({ agendamento, base, ncList, omList }: RegistrarAuditoriaForm) {
  const registro = await persistRegistro(base);
  const newAgendamento = updateAgendamento({ ...agendamento, registro });
  return parseRawAgendamento({ ...newAgendamento, registro });
}

async function updateRegistroAuditoria({ agendamento, base, ncList, omList }: RegistrarAuditoriaForm) {
  const registro = await persistRegistro(base);
  const newAgendamento = { ...agendamento, registro };
  return parseRawAgendamento(newAgendamento);
}

export async function persistRegistroAuditoria(form: RegistrarAuditoriaForm) {
  const result = await (form.base?.id ? updateRegistroAuditoria(form) : saveRegistroAuditoria(form));
  return result;
}
