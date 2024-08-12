import configurations from './reducers/configurations.reducer';
import enums from './reducers/enums.reducer';
import maps from './reducers/maps.reducer';
import risco from './reducers/risks-opportunities.reducer';

const risksOpportunitiesReducers = {
  risco,
  configurations,
  enums,
  maps,
};

export default risksOpportunitiesReducers;
