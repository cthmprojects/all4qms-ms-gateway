import ErrorBoundary from 'app/shared/error/error-boundary';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import React from 'react';
import { Route } from 'react-router-dom';
import InfodocList from './ui/home/infodoc-list';
import UploadInfoFile from './ui/forms/upload-files';

const handleTela = (tela: string) => {
  console.log(tela);
};

const InfodocRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route path="" element={<InfodocList />} />
      <Route path="upload-file" element={<UploadInfoFile />} />
    </ErrorBoundaryRoutes>
  </div>
);

export default InfodocRoutes;
