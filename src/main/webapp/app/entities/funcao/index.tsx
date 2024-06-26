import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Funcao from './funcao';
import FuncaoDetail from './funcao-detail';
import FuncaoUpdate from './funcao-update';
import FuncaoDeleteDialog from './funcao-delete-dialog';

const FuncaoRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Funcao />} />
    <Route path="new" element={<FuncaoUpdate />} />
    <Route path=":id">
      <Route index element={<FuncaoDetail />} />
      <Route path="edit" element={<FuncaoUpdate />} />
      <Route path="delete" element={<FuncaoDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default FuncaoRoutes;
