import create from 'zustand';

export type RNC = {
  numero: string;
  emissao: Date;
  emissor: string;
  descricao: string;
  responsavel: string;
  prazo: Date;
  acoes: string;
  verificacao: Date;
  eficacia: Date;
  fechamento: Date;
  status: string;
};

type State = {
  rncs: RNC[];
  addRnc: (rnc: RNC) => void;
};

const rncStore = create<State>(set => ({
  rncs: [],
  addRnc: (rnc: RNC) => set(state => ({ rncs: [...state.rncs, rnc] })),
}));

export default rncStore;
