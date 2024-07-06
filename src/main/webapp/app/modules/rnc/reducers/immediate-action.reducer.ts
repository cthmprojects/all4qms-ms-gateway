import axios from 'axios';

const immediateActionApiUrl = 'services/all4qmsmsrnc/api/acao-imediatas';

export const getImmediateActionByRnc = async (id: string | number) => {
  const response = await axios.get(`${immediateActionApiUrl}/byidnc/${id}`);
  return response.data;
};

export const removeImmediateAction = async (id: string | number) => {
  const response = await axios.delete(`${immediateActionApiUrl}/${id}`);
  return response.data;
};
