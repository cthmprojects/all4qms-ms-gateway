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

export const getComplexities = createAsyncThunk('get/complexities', async () => {
  return axios.get<Array<Configuration>>(`${apiUrl}/tipo-ro-analise?tipoRO=O&tipoAnaliseRO=C`);
});

const complexitiesSlice = createEntitySlice({
  name: 'complexities',
  initialState,
  extraReducers(builder) {
    builder.addMatcher(isFulfilled(getComplexities), (state, action) => {
      state.loading = false;
      state.entities = action.payload.data;
    });
  },
});

export const { reset } = complexitiesSlice.actions;

export default complexitiesSlice.reducer;
