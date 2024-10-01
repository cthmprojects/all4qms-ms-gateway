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
