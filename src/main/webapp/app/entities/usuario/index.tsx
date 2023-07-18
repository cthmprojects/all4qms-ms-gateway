import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Usuario from './usuario';
import UsuarioDetail from './usuario-detail';
import UsuarioUpdate from './usuario-update';
import UsuarioDeleteDialog from './usuario-delete-dialog';

const UsuarioRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Usuario />} />
    <Route path="new" element={<UsuarioUpdate />} />
    <Route path=":id">
      <Route index element={<UsuarioDetail />} />
      <Route path="edit" element={<UsuarioUpdate />} />
      <Route path="delete" element={<UsuarioDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default UsuarioRoutes;
