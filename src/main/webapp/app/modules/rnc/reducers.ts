import approval from './reducers/approval.reducer';
import rnc from './reducers/rnc.reducer';
import userManagement from '../../modules/administration/user-management/user-management.reducer';

const rncReducers = {
  approval,
  rnc,
  userManagement,
};

export default rncReducers;
