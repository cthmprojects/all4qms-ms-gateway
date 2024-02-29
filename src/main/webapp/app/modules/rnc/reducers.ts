import enums from './reducers/enums.reducer';
import rnc from './reducers/rnc.reducer';
import userManagement from '../../modules/administration/user-management/user-management.reducer';
import users from '../../entities/usuario/reducers/usuario.reducer';

const rncReducers = {
  enums,
  rnc,
  userManagement,
  users,
};

export default rncReducers;
