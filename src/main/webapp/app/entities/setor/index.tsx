import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Setor from './setor';
import SetorDetail from './setor-detail';
import SetorUpdate from './setor-update';
import SetorDeleteDialog from './setor-delete-dialog';

const SetorRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Setor />} />
    <Route path="new" element={<SetorUpdate />} />
    <Route path=":id">
      <Route index element={<SetorDetail />} />
      <Route path="edit" element={<SetorUpdate />} />
      <Route path="delete" element={<SetorDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SetorRoutes;
