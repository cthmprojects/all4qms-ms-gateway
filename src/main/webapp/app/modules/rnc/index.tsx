import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import React from 'react';
import { Route } from 'react-router-dom';
import RncList from './home/rnc-list';

const RncRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route path="" element={<RncList />}></Route>
    </ErrorBoundaryRoutes>
  </div>
);

export default RncRoutes;
