import { InstitutionalPlan, RawInstitutional, RawInstitutionalPlan, RawValue } from '../models';

export const toRawInstitutionalPlan = (institutionalPlan: InstitutionalPlan): RawInstitutionalPlan => {
  return {
    id: institutionalPlan.id,
    missao: institutionalPlan.mission,
    politica: institutionalPlan.policy,
    valores: institutionalPlan.values,
    visao: institutionalPlan.vision,
  };
};

export const toInstitutionalPlan = (rawInstitutionalPlan: RawInstitutionalPlan): InstitutionalPlan => {
  return {
    id: rawInstitutionalPlan.id,
    mission: rawInstitutionalPlan.missao,
    policy: rawInstitutionalPlan.politica,
    values: rawInstitutionalPlan.valores,
    vision: rawInstitutionalPlan.visao,
  };
};

export const toInstitutional = (rawInstitutional: RawInstitutional): InstitutionalPlan => {
  return {
    id: rawInstitutional.id,
    mission: rawInstitutional.missao,
    policy: rawInstitutional.politica,
    values: [],
    vision: rawInstitutional.visao,
  };
};

export const toRawInstitutional = (institutionalPlan: InstitutionalPlan): RawInstitutional => {
  return {
    id: institutionalPlan.id,
    missao: institutionalPlan.mission,
    politica: institutionalPlan.policy,
    visao: institutionalPlan.vision,
  };
};

export const toRawValues = (institutionalPlan: InstitutionalPlan): Array<RawValue> => {
  return institutionalPlan.values.map(v => {
    return {
      descricaoValores: v,
      institucional: {
        id: institutionalPlan?.id,
        missao: null,
        politica: null,
        visao: null,
      },
    };
  });
};
