import { EnumStatusAuditoria } from 'app/shared/model/enumerations/enum-status-auditoria';
import { EnumPartes } from 'app/shared/model/enumerations/enum-partes';

export type CronogramaAuditoria = {
  id?: number;
  periodoInicial: Date;
  periodoFinal: Date;
  escopo: string;
  status: EnumStatusAuditoria;
  parte: EnumPartes;
  modelo: ModeloAuditoria;
};

export type ModeloAuditoria = {
  id?: number;
  frequencia: string;
  nomeAuditoria: string;
  tipo: string;
};

export type Auditor = {
  id?: number;
  nomeAuditor: string;
  emailAuditor: string;
};

export type PlanejamentoAuditoria = {
  id?: number;
  identificadorPlanejamento?: string;
  objetivoAuditoria: string;
  criteriosNormas: string;
  requisitos: string;
  metodo: string;
  escopo: string;
  cronograma: Partial<CronogramaAuditoria>;
  auditores: Auditor[];
};

export type AgendamentoAuditoria = {
  id?: number;
  idProcesso: number;
  nomeProcesso: string;
  dataAuditoria: Date;
  horaInicial: Date;
  horaFinal: Date;
  responsavelAuditoria: number;
  isReagendado: boolean;
  justificativaReagendamento?: string;
  isFinalizado: boolean;
  planejamento: PlanejamentoAuditoria;
  auditores: Auditor[];
  registro?: RegistroAuditoria;
};

export type RegistroAuditoria = {
  id?: number;
  resumoAuditoria: string;
  numeroNC: string;
  numeroRelatorio: string;
};

export type RegistrarAuditoriaForm = {
  agendamento: AgendamentoAuditoria;
  base: RegistroAuditoria;
  ncList: any[];
  omList: any[];
};
