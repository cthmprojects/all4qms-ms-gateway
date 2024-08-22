import React from 'react';
import getStore from 'app/config/store';
import ErrorBoundary from 'app/shared/error/error-boundary';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { Route } from 'react-router-dom';
import HomeGoalsList from './ui/home';

import { ReducersMapObject, combineReducers } from 'redux';
import { ResultPage } from './ui/result-page';
import { ResourcePage } from './ui/resource-page';
import rncReducers from '../rnc/reducers';
import metasObjetivosReducers from './reducers';
import NewGoalObjective from './ui/new';

const GoalsObjectivesRoutes = () => {
  const store = getStore();
  store.injectReducer('all4qmsmsgatewayrnc', combineReducers(rncReducers as ReducersMapObject));
  store.injectReducer('all4qmsmsmetaind', combineReducers(metasObjetivosReducers as ReducersMapObject));
  return (
    <div>
      <ErrorBoundaryRoutes>
        <Route path="" element={<HomeGoalsList />} />
        <Route path="new/" element={<NewGoalObjective />} />
        <Route path="edit/:metaId" element={<NewGoalObjective />} />
        <Route path=":metaId/results" element={<ResultPage />} />
        <Route path="resources" element={<ResourcePage />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default GoalsObjectivesRoutes;
