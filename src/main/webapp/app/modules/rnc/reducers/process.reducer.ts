// /services/all4qmsmsgateway/api/processos

import axios from 'axios';

const apiUrl = 'services/all4qmsmsgateway/api/processos';

export const getProcesses = async () => {
  const response = await axios.get(`${apiUrl}`);
  return response.data;
};
