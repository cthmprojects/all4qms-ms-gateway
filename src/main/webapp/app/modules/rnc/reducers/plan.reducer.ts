import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { ActionPlan, Plan } from '../models';

const apiUrl = 'services/all4qmsmsrnc/api/planos';
const actionPlanApiUrl = 'services/all4qmsmsrnc/api/acao-planos';

const initialState: EntityState<Plan> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: null,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export const getById = createAsyncThunk('plan/', async (id: string | number) => {
  const response = await axios.get(`${apiUrl}/${id}`);
  return response;
});

export const getPlansByNcId = createAsyncThunk('plan/rnc', async (id: string | number) => {
  const response = await axios.get(`${apiUrl}/byidnc/${id}`);
  return response;
});

type Payload = {
  actionPlans: Array<ActionPlan>;
  plan: Plan;
};

export const savePlan = createAsyncThunk('/plan/save', async ({ actionPlans, plan }: Payload) => {
  console.log('plan', plan);
  console.log('actionPlans', actionPlans);

  const planResponse = await axios.post<Plan>(apiUrl, {
    statusPlano: plan.statusPlano,
    qtdAcoes: plan.qtdAcoes,
    qtdAcoesConcluidas: plan.qtdAcoesConcluidas,
    percentualPlano: plan.percentualPlano,
    dtConclusaoPlano: plan.dtConclusaoPlano,
    idNaoConformidade: plan.idNaoConformidade,
  });

  const savedPlan: Plan = planResponse.data;

  for (let i = 0; i < actionPlans.length; i++) {
    const actionPlan: ActionPlan = actionPlans[i];

    const response = await axios.post(actionPlanApiUrl, {
      idPlano: savedPlan.id,
      descricaoAcao: actionPlan.descricaoAcao,
      prazoAcao: actionPlan.prazoAcao,
      idResponsavelAcao: actionPlan.idResponsavelAcao,
      statusAcao: actionPlan.statusAcao,
      dataVerificao: actionPlan.dataVerificao,
      idResponsavelVerificaoAcao: actionPlan.idResponsavelVerificaoAcao,
      idAnexosExecucao: actionPlan.idAnexosExecucao,
      dataConclusaoAcao: actionPlan.dataConclusaoAcao,
      planoId: savedPlan.id,
    });
  }
});

const rncPlanSlice = createEntitySlice({
  name: 'plan',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getById), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(getPlansByNcId), (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(savePlan), (state, action) => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(savePlan), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      });
  },
});

export const { reset } = rncPlanSlice.actions;

export default rncPlanSlice.reducer;
