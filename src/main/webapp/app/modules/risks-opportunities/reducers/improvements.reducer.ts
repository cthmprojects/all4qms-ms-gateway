import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { Configuration } from '../models';

const apiUrl = 'services/all4qmsmsrisco/api/risco/linha-configros';

const initialState: EntityState<Configuration> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export const getImprovements = createAsyncThunk('get/improvements', async () => {
  return axios.get<Array<Configuration>>(`${apiUrl}/tipo-ro-analise?tipoRO=O&tipoAnaliseRO=M`);
});

const improvementsSlice = createEntitySlice({
  name: 'improvements',
  initialState,
  extraReducers(builder) {
    builder.addMatcher(isFulfilled(getImprovements), (state, action) => {
      state.loading = false;
      state.entities = action.payload.data;
    });
  },
});

export const { reset } = improvementsSlice.actions;

export default improvementsSlice.reducer;
