import dayjs from 'dayjs';

export interface IParametros {
  id?: number;
  chave?: string | null;
  valorChave?: string | null;
  nomeAmigavel?: string | null;
  descricao?: string | null;
  atualizadoEm?: string | null;
  locked?: boolean;
}

export const defaultValue: Readonly<IParametros> = {
  locked: false,
};
