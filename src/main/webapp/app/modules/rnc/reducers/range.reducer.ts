import axios from 'axios';

const rangeApiUrl = 'services/all4qmsmsrnc/api/abrangencias';

export const rangeList = async id => {
  const response = await axios.get(`${rangeApiUrl}/byidnc/${id}`);
  return response.data;
};
