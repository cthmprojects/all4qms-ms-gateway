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

export const formatDate = (date: Date, shortened: boolean = false): string => {
  const year: string = date.getFullYear().toString();
  const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
  const day: string = date.getDate().toString().padStart(2, '0');
  const hours: string = date.getHours().toString().padStart(2, '0');
  const minutes: string = date.getMinutes().toString().padStart(2, '0');
  const seconds: string = date.getSeconds().toString().padStart(2, '0');
  const milliseconds: string = date.getMilliseconds().toString().padStart(3, '0');

  const long: string = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  const short: string = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return !shortened ? long : short;
};

export const savePlan = createAsyncThunk('/plan/save', async ({ actionPlans, plan }: Payload) => {
  const planResponse = await axios.post<Plan>(apiUrl, {
    statusPlano: plan.statusPlano,
    qtdAcoes: plan.qtdAcoes,
    qtdAcoesConcluidas: plan.qtdAcoesConcluidas,
    percentualPlano: plan.percentualPlano,
    dtConclusaoPlano: !plan.dtConclusaoPlano ? null : formatDate(plan.dtConclusaoPlano),
    idNaoConformidade: plan.idNaoConformidade,
  });

  const savedPlan: Plan = planResponse.data;

  for (let i = 0; i < actionPlans.length; i++) {
    const actionPlan: ActionPlan = actionPlans[i];

    const payload = {
      idPlano: savedPlan.id,
      descricaoAcao: actionPlan.descricaoAcao,
      prazoAcao: formatDate(actionPlan.prazoAcao, true),
      idResponsavelAcao: actionPlan.idResponsavelAcao,
      statusAcao: !actionPlan.dataVerificao ? 'PENDENTE' : 'VISTO',
      dataVerificao: !actionPlan.dataVerificao ? null : formatDate(actionPlan.dataVerificao, true),
      idResponsavelVerificaoAcao: actionPlan.idResponsavelVerificaoAcao,
      idAnexosExecucao: actionPlan.idAnexosExecucao,
      dataConclusaoAcao: formatDate(actionPlan.dataConclusaoAcao),
      planoId: savedPlan.id,
    };

    const response = await axios.post(actionPlanApiUrl, payload);
  }
});

export const deleteAction = createAsyncThunk('/action/delete', async (id: number) => {
  await axios.delete(`${actionPlanApiUrl}/${id}`);
});

export const updatePlan = createAsyncThunk('/plan/update', async ({ actionPlans, plan }: Payload) => {
  const planResponse = await axios.patch<Plan>(`${apiUrl}/${plan.id}`, {
    id: plan.id,
    statusPlano: plan.statusPlano,
    qtdAcoes: plan.qtdAcoes,
    qtdAcoesConcluidas: plan.qtdAcoesConcluidas,
    percentualPlano: plan.percentualPlano,
    dtConclusaoPlano: formatDate(new Date(plan.dtConclusaoPlano)),
    idNaoConformidade: plan.idNaoConformidade,
  });

  const savedPlan: Plan = planResponse.data;

  for (let i = 0; i < actionPlans.length; i++) {
    const actionPlan: ActionPlan = actionPlans[i];

    if (actionPlan.id) {
      const response = await axios.patch(`${actionPlanApiUrl}/${actionPlan.id}`, {
        id: actionPlan.id,
        idPlano: savedPlan.id,
        descricaoAcao: actionPlan.descricaoAcao,
        prazoAcao: formatDate(new Date(actionPlan.prazoAcao), true),
        idResponsavelAcao: actionPlan.idResponsavelAcao,
        statusAcao: actionPlan.statusAcao,
        dataVerificao: !actionPlan.dataVerificao ? null : formatDate(new Date(actionPlan.dataVerificao), true),
        idResponsavelVerificaoAcao: actionPlan.idResponsavelVerificaoAcao,
        idAnexosExecucao: actionPlan.idAnexosExecucao,
        dataConclusaoAcao: formatDate(new Date(actionPlan.dataConclusaoAcao)),
        planoId: savedPlan.id,
      });
    } else {
      const payload = {
        idPlano: savedPlan.id,
        descricaoAcao: actionPlan.descricaoAcao,
        prazoAcao: formatDate(actionPlan.prazoAcao, true),
        idResponsavelAcao: actionPlan.idResponsavelAcao,
        statusAcao: !actionPlan.dataVerificao ? 'PENDENTE' : 'VISTO',
        dataVerificao: !actionPlan.dataVerificao ? null : formatDate(actionPlan.dataVerificao, true),
        idResponsavelVerificaoAcao: actionPlan.idResponsavelVerificaoAcao,
        idAnexosExecucao: actionPlan.idAnexosExecucao,
        dataConclusaoAcao: formatDate(actionPlan.dataConclusaoAcao),
        planoId: savedPlan.id,
      };

      const response = await axios.post(actionPlanApiUrl, payload);
    }
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
      })
      .addMatcher(isPending(updatePlan), (state, action) => {
        state.loading = true;
        state.updating = true;
      })
      .addMatcher(isFulfilled(updatePlan), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isPending(deleteAction), (state, action) => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(deleteAction), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      });
  },
});

export const { reset } = rncPlanSlice.actions;

export default rncPlanSlice.reducer;
