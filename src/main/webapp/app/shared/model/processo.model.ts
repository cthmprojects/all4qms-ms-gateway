import dayjs from 'dayjs';
import { IUsuario } from 'app/shared/model/usuario.model';

export interface IProcesso {
  id?: number;
  numero?: string;
  nome?: string | null;
  descricao?: string | null;
  setor?: string | null;
  responsavel?: string | null;
  setorResponsavel?: string | null;
  criadoEm?: string | null;
  atualizadoEm?: string | null;
  criadoPor?: IUsuario | null;
  atualizadoPor?: IUsuario | null;
  usuarios?: IUsuario[] | null;
}

export const defaultValue: Readonly<IProcesso> = {};
