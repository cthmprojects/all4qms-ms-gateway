import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Enums, Option } from '../models';

// Constants
const enumsApiUrl = 'services/all4qmsmsrnc/api/enum';

// Initial State
type InitialState = {
  enums: Enums | null;
  loading: boolean;
};

const initialState: InitialState = {
  enums: null,
  loading: false,
};

// Actions

export const listEnums = createAsyncThunk('rnc/enums/all', async () => {
  const response = await axios.get(`${enumsApiUrl}/all`);

  if (response.status !== 200) {
    return null;
  }

  const data = response.data;

  const enums: Enums = {
    actionPlanStatuses: data.acaoPlano.map(o => {
      const option: Option = {
        code: o.cod,
        name: o.nome,
        value: o.valor,
      };

      return option;
    }),
    immediateActionTypes: data.acaoImediata.map(o => {
      const option: Option = {
        code: o.cod,
        name: o.nome,
        value: o.valor,
      };

      return option;
    }),
    nonConformityStatuses: data.statusNc.map(o => {
      const option: Option = {
        code: o.cod,
        name: o.nome,
        value: o.valor,
      };

      return option;
    }),
    nonConformityTypes: data.tipoReg.map(o => {
      const option: Option = {
        code: o.cod,
        name: o.nome,
        value: o.valor,
      };

      return option;
    }),
    originTypes: data.origem.map(o => {
      const option: Option = {
        code: o.cod,
        name: o.nome,
        value: o.valor,
      };

      return option;
    }),
    planStatuses: data.plano.map(o => {
      const option: Option = {
        code: o.cod,
        name: o.nome,
        value: o.valor,
      };

      return option;
    }),
  };

  return { data: enums };
});

// Slices

const EnumsSlice = createSlice({
  name: 'enums',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(listEnums.pending, state => {
        state.loading = true;
      })
      .addCase(listEnums.fulfilled, (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          enums: data,
        };
      });
  },
});

// Reducers
export default EnumsSlice.reducer;
