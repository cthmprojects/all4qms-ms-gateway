import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Pendencia from './pendencia';
import PendenciaDetail from './pendencia-detail';
import PendenciaUpdate from './pendencia-update';
import PendenciaDeleteDialog from './pendencia-delete-dialog';

const PendenciaRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Pendencia />} />
    <Route path="new" element={<PendenciaUpdate />} />
    <Route path=":id">
      <Route index element={<Pendencia />} />
      <Route path="edit" element={<PendenciaUpdate />} />
      <Route path="delete" element={<PendenciaDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default PendenciaRoutes;
