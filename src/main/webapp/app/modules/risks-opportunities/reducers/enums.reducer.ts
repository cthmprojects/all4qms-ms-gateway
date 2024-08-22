import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { Enums, RawOption } from '../models';
import { mapRawToOption } from '../mappers';

const apiUrl = 'services/all4qmsmsrisco/api/risco/enumeradores';

const initialState: EntityState<Enums> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: {
    analysisOptions: [],
    levelOptions: [],
    typeOptions: [],
  },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export const getAnalysis = createAsyncThunk('get/enums/analysis', async () => {
  return axios.get<Array<RawOption>>(`${apiUrl}/analise`);
});

export const getLevels = createAsyncThunk('get/enums/levels', async () => {
  return axios.get<Array<RawOption>>(`${apiUrl}/grau`);
});

export const getTypes = createAsyncThunk('get/enums/types', async () => {
  return axios.get<Array<RawOption>>(`${apiUrl}/tipo`);
});

const enumsSlice = createEntitySlice({
  name: 'enums',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getAnalysis), (state, action) => {
        state.loading = false;
        state.entity = {
          ...state.entity,
          analysisOptions: action.payload.data.map(r => mapRawToOption(r)),
        };
      })
      .addMatcher(isFulfilled(getLevels), (state, action) => {
        state.loading = false;
        state.entity = {
          ...state.entity,
          levelOptions: action.payload.data.map(r => mapRawToOption(r)),
        };
      })
      .addMatcher(isFulfilled(getTypes), (state, action) => {
        state.loading = false;
        state.entity = {
          ...state.entity,
          typeOptions: action.payload.data.map(r => mapRawToOption(r)),
        };
      });
  },
});

export const { reset } = enumsSlice.actions;

export default enumsSlice.reducer;
