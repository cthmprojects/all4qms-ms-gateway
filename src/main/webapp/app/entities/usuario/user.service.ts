import { addToast } from 'app/shared/util/add-toast';
import axios from 'axios';

export const resetPassword = addToast(
  async (user: any) => {
    await axios.get(`/api/usuarios/reset-password/${user.id}`);
  },
  'Reset de senha realizado!',
  'Problema ao resetar senha'
);
