import dayjs from 'dayjs';
import { IFuncao } from 'app/shared/model/funcao.model';
import { ISetor } from 'app/shared/model/setor.model';
import { IUser } from 'app/shared/model/user.model';
import { IProcesso } from 'app/shared/model/processo.model';

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
}

export const defaultValue: Readonly<IUsuario> = {
  isGestor: false,
};
