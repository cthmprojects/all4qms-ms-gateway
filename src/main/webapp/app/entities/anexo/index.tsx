import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Anexo from './anexo';
import AnexoDetail from './anexo-detail';
import AnexoUpdate from './anexo-update';
import AnexoDeleteDialog from './anexo-delete-dialog';

const AnexoRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Anexo />} />
    <Route path="new" element={<AnexoUpdate />} />
    <Route path=":id">
      <Route index element={<AnexoDetail />} />
      <Route path="edit" element={<AnexoUpdate />} />
      <Route path="delete" element={<AnexoDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default AnexoRoutes;
