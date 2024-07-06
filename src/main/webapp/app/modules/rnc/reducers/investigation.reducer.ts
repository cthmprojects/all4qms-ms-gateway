import axios from 'axios';

const apiUrl = 'services/all4qmsmsrnc/api/investigacao';

export const getInvestigationByRnc = async (id: string | number) => {
  const response = await axios.get(`${apiUrl}/byidnc/${id}`);
  return response.data;
};

const planoUrl = 'services/all4qmsmsrnc/api/planos/byidnc';

export const getPlanoByRnc = async (id: string | number) => {
  const response = await axios.get(`${planoUrl}/${id}`);
  return response.data;
};
