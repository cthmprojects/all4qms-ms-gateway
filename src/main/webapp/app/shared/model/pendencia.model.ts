import dayjs from 'dayjs';
import { IUsuario } from 'app/shared/model/usuario.model';
import { EnumTipoPend } from 'app/shared/model/enumerations/enum-tipo-pend.model';

export interface IPendencia {
  id?: number;
  nome?: string | null;
  status?: boolean | null;
  lidaEm?: string | null;
  link?: string | null;
  tipo?: keyof typeof EnumTipoPend | null;
  criadoEm?: string | null;
  responsavel?: IUsuario | null;
  criadoPor?: IUsuario | null;
  atualizadoPor?: IUsuario | null;
}

export const defaultValue: Readonly<IPendencia> = {
  status: false,
};
