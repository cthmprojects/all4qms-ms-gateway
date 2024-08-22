import { Indicator } from './indicator';

export type IndicatorGoal = {
  frequency: 'MENSAL' | 'BIMESTRAL' | 'TRIMESTRAL' | 'QUADRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
  goals: Array<number>;
  id?: number;
  indicator: Indicator;
  measurements: Array<number>;
  year: string;
};
