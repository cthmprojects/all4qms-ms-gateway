import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { toAnalysis, toRawAnalysis } from '../mappers';
import { Analysis, RawAnalysis } from '../models';

const apiUrl = 'services/all4qmsmsmetaind/api/indicadores/criticas';

const initialState: EntityState<Analysis> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export const getIndicatorAnalysis = createAsyncThunk('get/indicator/analysis', async (indicatorId: number) => {
  return axios.get<Array<RawAnalysis>>(`${apiUrl}/byindmeta/${indicatorId}`);
});

export const getAllIndicatorAnalysis = createAsyncThunk('get/all/indicatorAnalysis', async () => {
  return axios.get<Array<RawAnalysis>>(`${apiUrl}?cacheBuster=${new Date().getTime()}`);
});

export const saveIndicatorAnalysis = createAsyncThunk('save/indicator/analysis', async (analysis: Analysis) => {
  return axios.post<RawAnalysis>(apiUrl, toRawAnalysis(analysis));
});

export const updateIndicatorAnalysis = createAsyncThunk('update/indicator/analysis', async (analysis: Analysis) => {
  return axios.put<RawAnalysis>(`${apiUrl}/${analysis.id}`, toRawAnalysis(analysis));
});

export const deleteIndicatorAnalysis = createAsyncThunk('delete/indicator/analysis', async (analysis: Analysis) => {
  return axios.delete<RawAnalysis>(`${apiUrl}/${analysis.id}`);
});

const indicatorAnalysisSlice = createEntitySlice({
  name: 'indicatorAnalysis',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getIndicatorAnalysis), (state, action) => {
        state.loading = false;
        state.entities = action.payload.data.map(i => toAnalysis(i));
      })
      .addMatcher(isFulfilled(getAllIndicatorAnalysis), (state, action) => {
        state.loading = false;
        state.entities = action.payload.data.map(i => toAnalysis(i));
      })
      .addMatcher(isFulfilled(saveIndicatorAnalysis), (state, action) => {
        state.loading = false;
        state.entity = toAnalysis(action.payload.data);
      })
      .addMatcher(isFulfilled(updateIndicatorAnalysis), (state, action) => {
        state.loading = false;
        state.entity = toAnalysis(action.payload.data);
      })
      .addMatcher(isFulfilled(deleteIndicatorAnalysis), (state, action) => {
        state.loading = false;
      });
  },
});

export const { reset } = indicatorAnalysisSlice.actions;

export default indicatorAnalysisSlice.reducer;
