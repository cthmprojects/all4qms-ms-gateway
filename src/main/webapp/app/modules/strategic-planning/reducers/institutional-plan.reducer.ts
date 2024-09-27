import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { toInstitutionalPlan, toRawInstitutional, toRawInstitutionalPlan, toRawValues } from '../mappers';
import { InstitutionalPlan, RawInstitutional, RawInstitutionalPlan, RawValue } from '../models';

const apiUrl = 'services/all4qmsmsauditplan/api/planest/institucionals';
const valuesApiUrl = 'services/all4qmsmsauditplan/api/planest/valores';

const initialState: EntityState<InstitutionalPlan> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export const getAllInstitutionalPlans = createAsyncThunk('get/all/institutionalPlans', async () => {
  const response = await axios.get<Array<RawInstitutional>>(apiUrl);

  if (response.status !== 200) {
    return [];
  }

  const institutionals: Array<RawInstitutional> = response.data;

  if (institutionals.length <= 0) {
    return [];
  }

  const plans: Array<RawInstitutionalPlan> = [];

  for (let i = 0; i < institutionals.length; i++) {
    const institutional: RawInstitutional = institutionals[0];

    const plan: RawInstitutionalPlan = {
      id: institutional.id,
      missao: institutional.missao,
      politica: institutional.politica,
      valores: [],
      visao: institutional.visao,
    };

    const id: number = institutional.id;

    const valuesResponse = await axios.get<Array<RawValue>>(valuesApiUrl);

    if (response.status === 200 && response.data.length > 0) {
      const values: Array<RawValue> = valuesResponse.data;

      plan.valores = values.filter(v => v.institucional.id === id).map(rv => rv.descricaoValores);
    }

    plans.push(plan);
  }

  return plans;
});

export const saveInstitutionalPlan = createAsyncThunk('save/institutionalPlan', async (institutionalPlan: InstitutionalPlan) => {
  const institutional: RawInstitutional = toRawInstitutional(institutionalPlan);

  const response = await axios.post<RawInstitutional>(apiUrl, institutional);

  if (response.status !== 201) {
    return null;
  }

  const resource: RawInstitutional = response.data;

  const id: number = resource.id;

  institutionalPlan.id = id;

  const values: Array<RawValue> = toRawValues(institutionalPlan);

  const plan: RawInstitutionalPlan = {
    id: id,
    missao: institutional.missao,
    politica: institutional.politica,
    valores: [],
    visao: institutional.visao,
  };

  for (let i = 0; i < values.length; i++) {
    const value: RawValue = values[i];

    const valueResponse = await axios.post<RawValue>(valuesApiUrl, value);

    if (valueResponse.status === 201) {
      plan.valores.push(value.descricaoValores);
    }
  }

  return plan;
});

export const updateInstitutionalPlan = createAsyncThunk('update/institutionalPlan', async (institutionalPlan: InstitutionalPlan) => {
  const institutional: RawInstitutional = toRawInstitutional(institutionalPlan);

  const response = await axios.put<RawInstitutional>(`${apiUrl}/${institutionalPlan.id}`, institutional);

  if (response.status !== 200) {
    return null;
  }

  const resource: RawInstitutional = response.data;

  const id: number = resource.id;

  institutional.id = id;

  const currentValuesResponse = await axios.get<Array<RawValue>>(valuesApiUrl);

  if (currentValuesResponse.status === 200 && currentValuesResponse.data.length > 0) {
    const currentValues: Array<RawValue> = currentValuesResponse.data;

    const ids: Array<number> = currentValues.map(v => v.id);

    for (let i = 0; i < ids.length; i++) {
      const valueId: number = ids[i];
      await axios.delete(`${valuesApiUrl}/${valueId}`);
    }
  }

  const plan: RawInstitutionalPlan = {
    id: id,
    missao: institutional.missao,
    politica: institutional.politica,
    valores: [],
    visao: institutional.visao,
  };

  const values: Array<RawValue> = toRawValues(institutionalPlan);

  for (let i = 0; i < values.length; i++) {
    const value: RawValue = values[i];

    const valueResponse = await axios.post<RawValue>(valuesApiUrl, value);

    if (valueResponse.status === 201) {
      plan.valores.push(value.descricaoValores);
    }
  }

  return plan;
});

const institutionalPlansSlice = createEntitySlice({
  name: 'institutionalPlans',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getAllInstitutionalPlans), (state, action) => {
        state.loading = false;
        state.entities = action.payload.map(i => toInstitutionalPlan(i));
      })
      .addMatcher(isFulfilled(saveInstitutionalPlan), (state, action) => {
        state.loading = false;
        state.entity = toInstitutionalPlan(action.payload);
      })
      .addMatcher(isFulfilled(updateInstitutionalPlan), (state, action) => {
        state.loading = false;
        state.entity = toInstitutionalPlan(action.payload);
      });
  },
});

export const { reset } = institutionalPlansSlice.actions;

export default institutionalPlansSlice.reducer;
