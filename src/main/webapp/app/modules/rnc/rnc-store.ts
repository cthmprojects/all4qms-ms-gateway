import create from 'zustand';
import { RNC } from './models';

type State = {
  rncs: RNC[];
  addRnc: (rnc: RNC) => void;
};

const rncStore = create<State>(set => ({
  rncs: [],
  addRnc: (rnc: RNC) => set(state => ({ rncs: [...state.rncs, rnc] })),
}));

export default rncStore;
