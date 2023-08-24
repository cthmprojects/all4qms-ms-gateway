import dayjs from 'dayjs';
import { IFuncao } from 'app/shared/model/funcao.model';
import { ISetor } from 'app/shared/model/setor.model';
import { IUser } from 'app/shared/model/user.model';
import { IProcesso } from 'app/shared/model/processo.model';
import { IPendencia } from 'app/shared/model/pendencia.model';

export interface IUsuario {
  id?: number;
  nome?: string;
  email?: string | null;
  isGestor?: boolean | null;
  criadoEm?: string | null;
  atualizadoEm?: string | null;
  funcao?: IFuncao | null;
  gestor?: IUsuario | null;
  setor?: ISetor | null;
  user?: IUser | null;
  criadoPor?: IUsuario | null;
  atualizadoPor?: IUsuario | null;
  processos?: IProcesso[] | null;
  usuario?: IUsuario | null;
  usuario?: IUsuario | null;
  usuario?: IUsuario | null;
  funcao?: IFuncao | null;
  funcao?: IFuncao | null;
  setor?: ISetor | null;
  setor?: ISetor | null;
  processo?: IProcesso | null;
  processo?: IProcesso | null;
  pendencia?: IPendencia | null;
  pendencia?: IPendencia | null;
  pendencia?: IPendencia | null;
}

export const defaultValue: Readonly<IUsuario> = {
  isGestor: false,
};
