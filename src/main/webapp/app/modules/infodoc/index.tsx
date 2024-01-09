import ErrorBoundary from 'app/shared/error/error-boundary';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import React from 'react';
import { Route } from 'react-router-dom';
import InfodocList from './home/infodoc-list';

const handleTela = (tela: string) => {
  console.log(tela);
};

const InfodocRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route path="" element={<InfodocList />} />
    </ErrorBoundaryRoutes>
  </div>
);

export default InfodocRoutes;
