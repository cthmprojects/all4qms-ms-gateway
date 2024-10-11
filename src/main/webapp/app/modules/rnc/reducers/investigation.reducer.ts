import axios from 'axios';

const apiUrl = 'services/all4qmsmsrnc/api/investigacao';

export const deleteInvestigation = async (id: number) => {
  const response = await axios.delete(`${apiUrl}/${id}`);
  return response.data;
};

export const getInvestigations = async () => {
  const response = await axios.get(apiUrl);
  return response.data;
};

export const getInvestigationByRnc = async (id: string | number) => {
  const response = await axios.get(`${apiUrl}/byidnc/${id}`);
  return response.data;
};

const planoUrl = 'services/all4qmsmsrnc/api/planos/byidnc';

export const getPlanoByRnc = async (id: string | number) => {
  const response = await axios.get(`${planoUrl}/${id}`);
  return response.data;
};
