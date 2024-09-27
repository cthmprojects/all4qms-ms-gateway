import { InstitutionalPlan, RawInstitutionalPlan } from '../models';

export const toRawInstitutionalPlan = (instituionalPlan: InstitutionalPlan): RawInstitutionalPlan => {
  return {
    id: instituionalPlan.id,
    missao: instituionalPlan.mission,
    politicaQualidade: instituionalPlan.policy,
    valores: instituionalPlan.values,
    visao: instituionalPlan.vision,
  };
};

export const toInstitutionalPlan = (rawInstitutionalPlan: RawInstitutionalPlan): InstitutionalPlan => {
  return {
    id: rawInstitutionalPlan.id,
    mission: rawInstitutionalPlan.missao,
    policy: rawInstitutionalPlan.politicaQualidade,
    values: rawInstitutionalPlan.valores,
    vision: rawInstitutionalPlan.visao,
  };
};
