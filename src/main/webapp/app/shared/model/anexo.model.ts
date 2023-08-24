import dayjs from 'dayjs';

export interface IAnexo {
  id?: number;
  nomeArquivo?: string | null;
  nomeOriginal?: string | null;
  extensao?: string | null;
  criadoEm?: string | null;
  atualizadoEm?: string | null;
}

export const defaultValue: Readonly<IAnexo> = {};
