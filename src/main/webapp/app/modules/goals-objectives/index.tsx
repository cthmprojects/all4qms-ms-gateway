import React from 'react';
import getStore from 'app/config/store';
import ErrorBoundary from 'app/shared/error/error-boundary';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { Route } from 'react-router-dom';
import HomeGoalsList from './ui/home';

import { ReducersMapObject, combineReducers } from 'redux';
import { ResultPage } from './ui/result-page';

const GoalsObjectivesRoutes = () => {
  const store = getStore();
  //   store.injectReducer('all4qmsmsgatewayrnc', combineReducers(rncReducer as ReducersMapObject));
  //   store.injectReducer('all4qmsmsgateway', combineReducers(infodocReducers as ReducersMapObject));
  return (
    <div>
      <ErrorBoundaryRoutes>
        <Route path="" element={<HomeGoalsList />} />
        <Route path="new/" element={<> </>} />
        <Route path="edit/:id" element={<> </>} />
        <Route path="result/:id" element={<ResultPage />} />
        <Route path="resources" element={<> </>} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default GoalsObjectivesRoutes;
