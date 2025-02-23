import axios from 'axios';

const effectCauseApiUrl = 'services/all4qmsmsrnc/api/causa-efeitos';

export const getEffectCause = async () => {
  const response = await axios.get(effectCauseApiUrl);
  return response.data;
};

export const deleteEffectCause = async (id: number) => {
  const response = await axios.delete(`${effectCauseApiUrl}/${id}`);
  return response.data;
};
