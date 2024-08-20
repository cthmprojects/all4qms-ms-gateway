import getStore from 'app/config/store';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { Route } from 'react-router-dom';
import { combineReducers, ReducersMapObject } from 'redux';
import rncReducers from '../rnc/reducers';
import { Dashboard } from './views';
// import risksOpportunitiesReducers from './reducers';
// import { AddOpportunity, AddRisk, Configurations, EditOpportunity, EditRisk, Home, ViewOpportunity, ViewRisk } from './views';

const PerformanceIndicatorsRoutes = () => {
  const store = getStore();
  store.injectReducer('all4qmsmsgatewayrnc', combineReducers(rncReducers as ReducersMapObject));
  // store.injectReducer('all4qmsmsgatewayro', combineReducers(risksOpportunitiesReducers as ReducersMapObject));

  return (
    <>
      <ErrorBoundaryRoutes>
        <Route path="" element={<Dashboard />} />
        <Route path="analytics" element={<>Analytics</>} />
        <Route path="indicator" element={<>New indicator</>} />
        <Route path="indicator/:id" element={<>Edit indicator</>} />
        <Route path="indicator/:id/measurements" element={<>Measurements</>} />
      </ErrorBoundaryRoutes>
    </>
  );
};

export default PerformanceIndicatorsRoutes;
