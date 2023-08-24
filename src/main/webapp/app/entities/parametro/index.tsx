import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Parametro from './parametro';
import ParametroDetail from './parametro-detail';
import ParametroUpdate from './parametro-update';
import ParametroDeleteDialog from './parametro-delete-dialog';

const ParametroRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Parametro />} />
    <Route path="new" element={<ParametroUpdate />} />
    <Route path=":id">
      <Route index element={<ParametroDetail />} />
      <Route path="edit" element={<ParametroUpdate />} />
      <Route path="delete" element={<ParametroDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ParametroRoutes;
