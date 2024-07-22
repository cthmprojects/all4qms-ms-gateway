import getStore from 'app/config/store';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import React from 'react';
import { Route } from 'react-router-dom';
import { combineReducers, ReducersMapObject } from 'redux';
import rncReducers from '../rnc/reducers';
import { AddOpportunity, AddRisk, Configurations, EditOpportunity, EditRisk, Home, ViewOpportunity, ViewRisk } from './views';

const RisksOpportunitiesRoutes = () => {
  const store = getStore();
  store.injectReducer('all4qmsmsgatewayrnc', combineReducers(rncReducers as ReducersMapObject));

  return (
    <>
      <ErrorBoundaryRoutes>
        <Route path="" element={<Home />} />
        <Route path="risk" element={<AddRisk />} />
        <Route path="opportunity" element={<AddOpportunity />} />
        <Route path="risk/:id" element={<EditRisk />} />
        <Route path="opportunity/:id" element={<EditOpportunity />} />
        <Route path="risk/view/:id" element={<ViewRisk />} />
        <Route path="opportunity/view/:id" element={<ViewOpportunity />} />

        <Route path="configurations" element={<Configurations />} />
      </ErrorBoundaryRoutes>
    </>
  );
};

export default RisksOpportunitiesRoutes;
