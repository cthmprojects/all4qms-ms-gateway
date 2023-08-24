import dayjs from 'dayjs';
import { IUsuario } from 'app/shared/model/usuario.model';

export interface IFuncao {
  id?: number;
  nome?: string;
  descricao?: string | null;
  criadoEm?: string | null;
  atualizadoEm?: string | null;
  criadoPor?: IUsuario | null;
  atualizadoPor?: IUsuario | null;
  usuario?: IUsuario | null;
}

export const defaultValue: Readonly<IFuncao> = {};
