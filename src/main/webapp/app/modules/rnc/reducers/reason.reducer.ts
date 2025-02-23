import axios from 'axios';

const reasonApiUrl = 'services/all4qmsmsrnc/api/porques';

export const getReason = async () => {
  const response = await axios.get(reasonApiUrl);
  return response.data;
};

export const deleteReason = async (id: number) => {
  const response = await axios.delete(`${reasonApiUrl}/${id}`);
  return response.data;
};
