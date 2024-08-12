export type RawOption = {
  cod: number;
  nome: string;
  valor: string;
};

export type Option = {
  code: number;
  name: string;
  value: string;
};

export type Enums = {
  analysisOptions: Array<Option>;
  levelOptions: Array<Option>;
  typeOptions: Array<Option>;
};
