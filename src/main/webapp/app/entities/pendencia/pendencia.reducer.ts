import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IPendencia, defaultValue } from 'app/shared/model/pendencia.model';

const initialState: EntityState<IPendencia> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};
export type IQueryParamsPendencia = { query?: string; page?: number; size?: number; sort?: string; idUser?: number };
const apiUrl = 'api/pendencias';
const apiPendenciaByUserUrl = 'api/pendencias/usuario';

// Actions

// export const getEntities = createAsyncThunk('pendencia/fetch_entity_list', async ({ page, size, sort }: IQueryParams) => {
//   const requestUrl = `${apiUrl}?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
//   return axios.get<IPendencia[]>(requestUrl);
// });

export const getEntitiesById = createAsyncThunk(
  'pendencia/fetch_entity_list_by_id',
  async ({ page, size, sort, idUser }: IQueryParamsPendencia) => {
    const requestUrl = `${apiUrl}/usuario/${idUser}?${
      sort ? `page=${page}&size=${size}&sort=${sort}&` : ''
    }cacheBuster=${new Date().getTime()}`;
    return axios.get<IPendencia[]>(requestUrl);
  }
);

export const getEntity = createAsyncThunk(
  'pendencia/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IPendencia>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'pendencia/create_entity',
  async (entity: IPendencia, thunkAPI) => {
    const result = await axios.post<IPendencia>(apiUrl, cleanEntity(entity));
    thunkAPI.dispatch(getEntitiesById({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  'pendencia/update_entity',
  async (entity: IPendencia, thunkAPI) => {
    const result = await axios.put<IPendencia>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntitiesById({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const partialUpdateEntity = createAsyncThunk(
  'pendencia/partial_update_entity',
  async (entity: IPendencia, thunkAPI) => {
    const result = await axios.patch<IPendencia>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntitiesById({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'pendencia/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete<IPendencia>(requestUrl);
    thunkAPI.dispatch(getEntitiesById({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const PendenciaSlice = createEntitySlice({
  name: 'pendencia',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getEntitiesById), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(getEntitiesById, getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = PendenciaSlice.actions;

// Reducer
export default PendenciaSlice.reducer;
