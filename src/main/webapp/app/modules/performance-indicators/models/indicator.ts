export type Indicator = {
  code: string;
  description: string;
  id?: number;
  indicatorGoalId?: number;
  name: string;
  processId: number;
  trend: 'MAIOR' | 'MENOR' | 'ESTABILIZAR';
  unit: 'PERCENTUAL' | 'MONETARIO' | 'UNITARIO' | 'DECIMAL';
};
