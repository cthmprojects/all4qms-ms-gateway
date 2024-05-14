import create from 'zustand';

export type INFODOC = {
  codigo: string;
  titulo: string;
  emissor: string;
  revisao: string;
  data: Date;
  area_processo: string;
  origem: string;
  situacao: string;
  status: string;
  distribuicao: string;
};

type State = {
  infodocs: INFODOC[];
  addInfodoc: (infodoc: INFODOC) => void;
};

const infodocStore = create<State>(set => ({
  infodocs: [],
  addInfodoc: (infodoc: INFODOC) => set(state => ({ infodocs: [...state.infodocs, infodoc] })),
}));

export default infodocStore;
