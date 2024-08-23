import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { ListMeta, Meta } from '../models/goals';

const apiUrl = 'services/all4qmsmsmetaind/api/metaobj/metas';

const initialState: EntityState<Meta> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export const getMeta = createAsyncThunk('get/meta', async (id: Number) => {
  return axios.get<Meta>(`${apiUrl}/${id}`);
});

export const saveMeta = createAsyncThunk('set/meta', async (meta: Meta) => {
  return axios.post<Meta>(apiUrl, meta);
});

export const updateMeta = createAsyncThunk('update/meta', async (meta: Meta) => {
  return axios.put<Meta>(`${apiUrl}/${meta.id}`, meta);
});

export const saveMetas = createAsyncThunk('set/metas', async (metas: Meta[]) => {
  const metasRequests = metas.map(meta => axios.post(apiUrl, meta));
  axios
    .all(metasRequests)
    .then(
      axios.spread((...responses) => {
        // Respostas individuais
        responses.forEach((response, index) => {
          console.log(`Response meta ${index + 1}:`, response.data);
        });
        return true;
      })
    )
    .catch(error => {
      console.error('Erro em uma das requisições:', error);
      return false;
    });
});
const metasSlice = createEntitySlice({
  name: 'metas',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getMeta), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(saveMeta), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      });
  },
});

export const { reset } = metasSlice.actions;

export default metasSlice.reducer;
