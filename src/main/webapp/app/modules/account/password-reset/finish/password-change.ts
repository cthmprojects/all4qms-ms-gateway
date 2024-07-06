import axios from 'axios';

const apiUrl = 'api/account/change-password';

export const ChangePassword = async (currentPassword: string, newPassword: string) => {
  const response = await axios.post(apiUrl, { currentPassword: currentPassword, newPassword: newPassword });
  return response.data;
};
