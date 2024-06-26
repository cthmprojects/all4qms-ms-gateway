export type Action = {
  deadline: Date;
  description: string;
  responsible: string;
  status: string;
  id?: number | string;
};
