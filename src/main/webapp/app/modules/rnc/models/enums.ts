export type Option = {
  code: number;
  name: string;
  value: string;
};

export type Enums = {
  actionPlanStatuses: Array<Option>;
  immediateActionTypes: Array<Option>;
  nonConformityStatuses: Array<Option>;
  nonConformityTypes: Array<Option>;
  originTypes: Array<Option>;
  planStatuses: Array<Option>;
};
