import enums from './reducers/enums.reducer';
import rnc from './reducers/rnc.reducer';
import description from './reducers/description.reducer';
import userManagement from '../../modules/administration/user-management/user-management.reducer';
import users from '../../entities/usuario/reducers/usuario.reducer';
import hashtag from './reducers/hashtag.reducer';
import approval from './reducers/approval.reducer';
import plan from './reducers/plan.reducer';

const rncReducers = {
  enums,
  rnc,
  userManagement,
  users,
  hashtag,
  description,
  approval,
  plan,
};

export default rncReducers;
