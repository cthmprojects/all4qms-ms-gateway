import getStore from 'app/config/store';
import ErrorBoundary from 'app/shared/error/error-boundary';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import React from 'react';
import { Route } from 'react-router-dom';
import InfodocList from './ui/home/infodoc-list';
import UploadInfoFile from './ui/forms/upload-files';
import NewDocument from './new/new-document';
import rncReducer from '../rnc/reducers';
import infodocReducers from './reducers';

import { ReducersMapObject, combineReducers } from 'redux';

const handleTela = (tela: string) => {
  console.log(tela);
};

const InfodocRoutes = () => {
  const store = getStore();
  store.injectReducer('all4qmsmsgateway', combineReducers(rncReducer as ReducersMapObject));
  store.injectReducer('all4qmsmsgateway', combineReducers(infodocReducers as ReducersMapObject));
  return (
    <div>
      <ErrorBoundaryRoutes>
        <Route path="" element={<InfodocList />} />
        <Route path="upload-file" element={<UploadInfoFile />} />
        <Route path="upload-file/new" element={<NewDocument />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default InfodocRoutes;
