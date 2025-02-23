import complexities from './reducers/complexities.reducer';
import configurations from './reducers/configurations.reducer';
import enums from './reducers/enums.reducer';
import improvements from './reducers/improvements.reducer';
import maps from './reducers/maps.reducer';
import opportunityDecisions from './reducers/opportunity-decisions.reducer';
import probabilities from './reducers/probabilities.reducer';
import risco from './reducers/risks-opportunities.reducer';
import riskDecisions from './reducers/risk-decisions.reducer';
import severities from './reducers/severities.reducer';

const risksOpportunitiesReducers = {
  risco,
  configurations,
  enums,
  maps,
  complexities,
  improvements,
  probabilities,
  severities,
  riskDecisions,
  opportunityDecisions,
};

export default risksOpportunitiesReducers;
