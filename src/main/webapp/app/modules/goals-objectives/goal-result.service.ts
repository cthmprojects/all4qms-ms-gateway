import axios from 'axios';

const parserMetaResult = (payload: any) => {
  return {
    ...payload,
    lancadoEm: new Date(payload.lancadoEm),
    periodo: new Date(payload.periodo),
  };
};

export const createResult = async (payload: any) => {
  const { data } = await axios.post<any[]>('/services/all4qmsmsmetaind/api/metaobj/resultados', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const getMeta = async (id: number) => {
  const { data } = await axios.get<any>('/services/all4qmsmsmetaind/api/metaobj/metas/' + id);
  return data;
};

export const getMetaResults = async (id: number) => {
  const { data } = await axios.get<any[]>('/services/all4qmsmsmetaind/api/metaobj/resultados/byidmeta/' + id);
  return data.map(parserMetaResult);
};

export const getMetaResultAttatchment = async (id: number) => {
  const { data } = await axios.get<any>('/services/all4qmsmsmetaind/api/metaobj/anexos/' + id);
  return data;
};
