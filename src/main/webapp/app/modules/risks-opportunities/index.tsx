import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import React from 'react';
import { Route } from 'react-router-dom';
import { AddOpportunity, AddRisk, EditOpportunity, EditRisk, ViewOpportunity, ViewRisk } from './views';

const RisksOpportunitiesRoutes = () => {
  return (
    <>
      <ErrorBoundaryRoutes>
        <Route path="" element={<>Home</>} />
        <Route path="risk" element={<AddRisk />} />
        <Route path="opportunity" element={<AddOpportunity />} />
        <Route path="risk/:id" element={<EditRisk />} />
        <Route path="opportunity/:id" element={<EditOpportunity />} />
        <Route path="risk/view/:id" element={<ViewRisk />} />
        <Route path="opportunity/view/:id" element={<ViewOpportunity />} />
      </ErrorBoundaryRoutes>
    </>
  );
};

export default RisksOpportunitiesRoutes;
