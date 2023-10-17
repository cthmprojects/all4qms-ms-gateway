import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Parametros from './parametros';
import ParametrosDetail from './parametros-detail';
import ParametrosUpdate from './parametros-update';
import ParametrosDeleteDialog from './parametros-delete-dialog';

const ParametrosRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Parametros />} />
    <Route path="new" element={<ParametrosUpdate />} />
    <Route path=":id">
      <Route index element={<ParametrosDetail />} />
      <Route path="edit" element={<ParametrosUpdate />} />
      <Route path="delete" element={<ParametrosDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ParametrosRoutes;
