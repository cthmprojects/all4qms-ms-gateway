import dayjs from 'dayjs';

export interface IParametro {
  id?: number;
  chave?: string;
  valor?: string | null;
  nomeAmigavel?: string | null;
  atualizadoEm?: string | null;
}

export const defaultValue: Readonly<IParametro> = {};
