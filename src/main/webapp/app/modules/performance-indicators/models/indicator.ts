export type Indicator = {
  code: string;
  description: string;
  formation: string;
  id?: number;
  indicatorGoalId?: number;
  name: string;
  processId: number;
  responsible: string;
  source: string;
  trend: 'MAIOR' | 'MENOR' | 'ESTABILIZAR';
  unit: 'PERCENTUAL' | 'MONETARIO' | 'UNITARIO' | 'DECIMAL';
  verification: string;
};
