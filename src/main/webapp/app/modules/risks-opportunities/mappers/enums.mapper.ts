import { Option, RawOption } from '../models';

export const mapRawToOption = (rawOption: RawOption): Option => {
  return {
    code: rawOption.cod,
    name: rawOption.nome,
    value: rawOption.valor,
  };
};
