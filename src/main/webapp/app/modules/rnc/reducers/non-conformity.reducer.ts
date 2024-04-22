import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { ExtendedNc } from '../models';

// Constants
const apiUrl = 'services/all4qmsmsrnc/api/nao-conformidades';

// Initial State
const initialState: EntityState<ExtendedNc> = {
  entities: [],
  entity: null,
  errorMessage: null,
  loading: false,
  updateSuccess: false,
  updating: false,
  links: null,
  totalItems: 0,
};

// Actions
interface ListParams {
  statusAtual?: string;
  processoNC?: number;
  tipoNC?: string;
  dtIni?: string;
  dtFim?: string;
  page?: number;
  size?: number;
}

export const listNonConformities = createAsyncThunk('non-conformity/list', async (params: ListParams) => {
  const { statusAtual, processoNC, tipoNC, dtIni, dtFim, page, size } = params;
  const queryParams: string[] = [];

  if (statusAtual) {
    queryParams.push(`statusAtual=${statusAtual}`);
  }

  if (processoNC) {
    queryParams.push(`processoNC=${processoNC}`);
  }

  if (tipoNC) {
    queryParams.push(`tipoNC=${tipoNC}`);
  }

  if (dtIni) {
    queryParams.push(`dtIni=${dtIni}`);
  }

  if (dtFim) {
    queryParams.push(`dtFim=${dtFim}`);
  }

  if (page !== undefined) {
    queryParams.push(`page=${page}`);
  }

  if (size !== undefined) {
    queryParams.push(`size=${size}`);
  }

  queryParams.push(`cacheBuster=${new Date().getTime()}`);

  const queryString = queryParams.join('&');
  const url = `${apiUrl}${queryString ? `?${queryString}` : ''}`;

  return axios.get<Array<ExtendedNc>>(url);
});

// Slices

const NonConformitySlice = createEntitySlice({
  name: 'non-conformity',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isPending(listNonConformities), (state, _) => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(listNonConformities), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          entity: null,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      });
  },
});

export const { reset } = NonConformitySlice.actions;

// Reducers
export default NonConformitySlice.reducer;
