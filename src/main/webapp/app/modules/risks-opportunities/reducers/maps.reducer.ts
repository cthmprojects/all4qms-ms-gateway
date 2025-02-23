import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { RawMap } from '../models';

const apiUrl = 'services/all4qmsmsrisco/api/risco/mapa-riscos';

const initialState: EntityState<RawMap> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export const getMap = createAsyncThunk('get/map', async (id: number) => {
  return axios.get<RawMap>(`${apiUrl}/${id}`);
});

export const getMaps = createAsyncThunk('get/maps', async () => {
  const queryParams: Array<string> = [];
  queryParams.push(`cacheBuster=${new Date().getTime()}`);

  const query: string = queryParams.join('&');
  const urlParams: string = query ? `?${query}` : '';
  const url: string = `${apiUrl}${urlParams}`;

  return axios.get<Array<RawMap>>(url);
});

export const saveMap = createAsyncThunk('save/map', async (map: RawMap) => {
  return axios.post<RawMap>(apiUrl, map);
});

export const updateMap = createAsyncThunk('update/map', async (map: RawMap) => {
  return axios.put<RawMap>(`${apiUrl}/${map.id}`, map);
});

const mapsSlice = createEntitySlice({
  name: 'maps',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getMap), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(getMaps), (state, action) => {
        state.loading = false;
        state.entities = action.payload.data;
      })
      .addMatcher(isPending(saveMap), (state, _) => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(saveMap), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(updateMap), (state, _) => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(updateMap), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      });
  },
});

export const { reset } = mapsSlice.actions;

export default mapsSlice.reducer;
