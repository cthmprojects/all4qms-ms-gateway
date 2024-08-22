import axios from 'axios';
import { MetaRecurso } from './models/goals';
import { PaginatedResponse } from 'app/shared/model/page.model';

export const getPaginatedResources = async (params: Record<string, number | string>) => {
  const { data } = await axios.get<PaginatedResponse<MetaRecurso>>('/services/all4qmsmsmetaind/api/metaobj/recursos/filtro', { params });
  return data;
};

export const saveResourceRequest = async (payload: Partial<MetaRecurso>) => {
  const { data } = await axios.post<MetaRecurso>('/services/all4qmsmsmetaind/api/metaobj/recursos', payload);
  return data;
};

export const editResourceRequest = async (payload: Partial<MetaRecurso>) => {
  const { data } = await axios.patch<MetaRecurso>('/services/all4qmsmsmetaind/api/metaobj/recursos/' + payload.id, payload);
  return data;
};
