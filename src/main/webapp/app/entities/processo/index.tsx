import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Processo from './processo';
import ProcessoDetail from './processo-detail';
import ProcessoUpdate from './processo-update';

const ProcessoRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Processo />} />
    <Route path="new" element={<ProcessoUpdate />} />
    <Route path=":id">
      <Route index element={<ProcessoDetail />} />
      <Route path="edit" element={<ProcessoUpdate />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ProcessoRoutes;
