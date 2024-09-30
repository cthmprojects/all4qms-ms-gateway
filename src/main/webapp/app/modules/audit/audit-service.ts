import { OnlyRequired } from 'app/shared/model/util';
import { NonConformityAudit, NonConformityDescriptionSummary, Rnc } from '../rnc/models';
import axios from 'axios';

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

const baseUrl = 'services/all4qmsmsrnc/api';

async function saveRaizNaoConformidade(raizNaoConformidade: OnlyRequired<Rnc>) {
  const { data } = await axios.post<Rnc>(`${baseUrl}/nao-conformidades`, raizNaoConformidade);
  return data;
}

async function saveAuditoria(auditoria: Auditoria) {
  const { data } = await axios.post<NonConformityAudit>(`${baseUrl}/auditorias`, auditoria);
  return data;
}

async function saveRnc(naoConformidade: NaoConformidade) {
  var form_data = new FormData();

  for (var key in naoConformidade) {
    form_data.append(key, naoConformidade[key]);
  }
  const { data } = await axios.post<NonConformityAudit>(`${baseUrl}/descricao-nao-conformidades`, form_data);
  return data;
}

export async function generateRnc({ auditoria, naoConformidade, raizNaoConformidade }: GenerateRncPayload) {
  const raizResult = await saveRaizNaoConformidade(raizNaoConformidade);
  const auditoriaResult = await saveAuditoria({ ...auditoria, idNaoConformidade: raizResult.id });
  const naoConformidadeResult = await saveRnc({ ...naoConformidade, naoConformidade: raizResult.id });

  return naoConformidadeResult;
}
