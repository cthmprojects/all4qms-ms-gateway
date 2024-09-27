import React from 'react';
import getStore from 'app/config/store';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { Route } from 'react-router-dom';
import { combineReducers, ReducersMapObject } from 'redux';
import strategicPlanningReducers from './reducers';
import { Institutional } from './views';
import Home from './views/pages/home';
import Swot from './views/pages/swot';

const StrategicPlaningRoutes = () => {
  const store = getStore();
  store.injectReducer('all4qmsmsgatewayauditplan', combineReducers(strategicPlanningReducers as ReducersMapObject));

  return (
    <>
      <ErrorBoundaryRoutes>
        <Route path="" element={<Home />} />
        <Route path="institutional" element={<Institutional />} />
        <Route path="swot" element={<Swot />} />
      </ErrorBoundaryRoutes>
    </>
  );
};

export default StrategicPlaningRoutes;
