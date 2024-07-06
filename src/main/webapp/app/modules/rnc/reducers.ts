import enums from './reducers/enums.reducer';
import rnc from './reducers/rnc.reducer';
import description from './reducers/description.reducer';
import userManagement from '../../modules/administration/user-management/user-management.reducer';
import users from '../../entities/usuario/reducers/usuario.reducer';
import hashtag from './reducers/hashtag.reducer';
import approval from './reducers/approval.reducer';
import plan from './reducers/plan.reducer';
import decision from './reducers/decision.reducer';
import nonConformities from './reducers/non-conformity.reducer';
import process from './reducers/process.reducer';
import completeNonConformities from './reducers/complete-non-conformity.reducer';

const rncReducers = {
  enums,
  rnc,
  userManagement,
  users,
  hashtag,
  description,
  approval,
  plan,
  decision,
  nonConformities,
  process,
  completeNonConformities,
};

export default rncReducers;
