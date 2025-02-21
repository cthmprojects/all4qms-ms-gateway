import getStore from 'app/config/store';
import ErrorBoundary from 'app/shared/error/error-boundary';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import React from 'react';
import { Route } from 'react-router-dom';
import InfodocList from './ui/home/infodoc-list';
import UploadInfoFile from './ui/dialogs/upload-dialog/upload-files';
import NewDocument from './new/new-document';
import rncReducer from '../rnc/reducers';
import infodocReducers from './reducers';

import { ReducersMapObject, combineReducers } from 'redux';
import UpdateDocument from './update/update-document';
import ValidationDocument from './validation-infodoc/validation-document';
import ApprovalDocument from './ui/approval-infodoc/approval-infodoc';
import ComproveRecebimento from './ui/distribuitions/comprove-recebimento';

const InfodocRoutes = () => {
  const store = getStore();
  store.injectReducer('all4qmsmsgatewayrnc', combineReducers(rncReducer as ReducersMapObject));
  store.injectReducer('all4qmsmsgateway', combineReducers(infodocReducers as ReducersMapObject));
  return (
    <div>
      <ErrorBoundaryRoutes>
        <Route path="" element={<InfodocList />} />
        <Route path="upload-file/new/:id" element={<NewDocument />} />
        <Route path="upload-file/update/:id/:idFile" element={<UpdateDocument />} />
        <Route path="validation/:id" element={<ValidationDocument />} />
        <Route path="approval/:id" element={<ApprovalDocument />} />
        <Route path="receive/:id" element={<ComproveRecebimento />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default InfodocRoutes;
