export type Enumerador = {
  cod: number;
  nome: string;
  valor: string;
};

export type Indicador = {
  codigoIndicador: string;
  descricaoIndicador: string;
  id?: number;
  idMetaIndicador?: number;
  idProcesso: number;
  nomeIndicador: string;
  tendencia: 'MAIOR' | 'MENOR' | 'ESTABILIZAR';
  unidade: 'PERCENTUAL' | 'MONETARIO' | 'UNITARIO' | 'DECIMAL';
};

export type MetaIndicador = {
  anoIndicador: string;
  frequencia: 'MENSAL' | 'BIMESTRAL' | 'TRIMESTRAL' | 'QUADRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
  id?: number;
  indicador: Indicador;
  medicao01: number;
  medicao02: number;
  medicao03: number;
  medicao04: number;
  medicao05: number;
  medicao06: number;
  medicao07: number;
  medicao08: number;
  medicao09: number;
  medicao10: number;
  medicao11: number;
  medicao12: number;
  meta01: number;
  meta02: number;
  meta03: number;
  meta04: number;
  meta05: number;
  meta06: number;
  meta07: number;
  meta08: number;
  meta09: number;
  meta10: number;
  meta11: number;
  meta12: number;
};
