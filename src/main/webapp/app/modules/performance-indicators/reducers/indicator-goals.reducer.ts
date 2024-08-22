import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { Indicador, Indicator, IndicatorGoal, MetaIndicador } from '../models';
import { toIndicatorGoal, toRawIndicator, toRawIndicatorGoal } from '../mappers';

const apiUrl = 'services/all4qmsmsmetaind/api/indicadores/metas';
const indicadoresApiUrl = 'services/all4qmsmsmetaind/api/indicadores';

const initialState: EntityState<IndicatorGoal> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

interface ListPagination {
  page?: number;
  size?: number;
}

export const getIndicatorGoal = createAsyncThunk('get/indicatorGoal', async (id: number) => {
  return axios.get<MetaIndicador>(`${apiUrl}/${id}`);
});

export const getIndicatorGoals = createAsyncThunk('get/indicatorGoals', async (params: ListPagination) => {
  const { page, size } = params;

  const queryParams: Array<string> = [];

  if (page) {
    queryParams.push(`page=${page}`);
  }

  if (size) {
    queryParams.push(`size=${size}`);
  }

  queryParams.push(`cacheBuster=${new Date().getTime()}`);

  const query: string = queryParams.join('&');
  const urlParams: string = query ? `?${query}` : '';
  const url: string = `${apiUrl}${urlParams}`;

  return axios.get<Array<MetaIndicador>>(url);
});

export const getAllIndicatorGoals = createAsyncThunk('get/all/indicatorGoals', async () => {
  return axios.get<Array<MetaIndicador>>(`${apiUrl}`);
});

export const saveIndicatorGoal = createAsyncThunk('save/indicatorGoal', async (indicatorGoal: IndicatorGoal) => {
  const indicator: Indicator = indicatorGoal.indicator;

  const response = await axios.post<Indicador>(indicadoresApiUrl, toRawIndicator(indicator));

  if (response.status !== 201) {
    return null;
  }

  const id: number = response.data.id;

  indicatorGoal.indicator.id = id;

  return axios.post<MetaIndicador>(apiUrl, toRawIndicatorGoal(indicatorGoal));
});

export const updateIndicatorGoal = createAsyncThunk('update/indicatorGoal', async (indicatorGoal: IndicatorGoal) => {
  return axios.put<MetaIndicador>(`${apiUrl}/${indicatorGoal.id}`, toRawIndicatorGoal(indicatorGoal));
});

const indicatorGoalsSlice = createEntitySlice({
  name: 'indicatorGoals',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getIndicatorGoal), (state, action) => {
        state.loading = false;
        state.entity = toIndicatorGoal(action.payload.data);
      })
      .addMatcher(isFulfilled(getIndicatorGoals), (state, action) => {
        state.loading = false;
        state.entities = action.payload.data.map(i => toIndicatorGoal(i));
      })
      .addMatcher(isFulfilled(getAllIndicatorGoals), (state, action) => {
        state.loading = false;
        state.entities = action.payload.data.map(i => toIndicatorGoal(i));
      })
      .addMatcher(isFulfilled(saveIndicatorGoal), (state, action) => {
        state.loading = false;
        state.entity = toIndicatorGoal(action.payload.data);
      })
      .addMatcher(isFulfilled(updateIndicatorGoal), (state, action) => {
        state.loading = false;
        state.entity = toIndicatorGoal(action.payload.data);
      });
  },
});

export const { reset } = indicatorGoalsSlice.actions;

export default indicatorGoalsSlice.reducer;
