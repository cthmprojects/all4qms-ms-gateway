import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import React from 'react';
import { Route } from 'react-router-dom';
import RncList from './home/rnc-list';
import RNCNew from './new/rnc-new';
import GeneralRegister from './new/register-types/general-register/general-register';

const RncRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route path="" element={<RncList />} />
      <Route path="new" element={<RNCNew />} />
      <Route path="general" element={<GeneralRegister />}></Route>
    </ErrorBoundaryRoutes>
  </div>
);

export default RncRoutes;
