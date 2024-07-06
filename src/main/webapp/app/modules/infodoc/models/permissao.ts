export type Permissao = {
  id: number;
  idProcesso: number;
  idFuncao: number;
  revisar: boolean;
  cancelar: boolean;
  distribuir: boolean;
  historico: boolean;
  aprovar: boolean;
};
