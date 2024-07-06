import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import { ReducersMapObject, combineReducers } from '@reduxjs/toolkit';

import getStore from 'app/config/store';

import entitiesReducers from './reducers';

import Usuario from './usuario';
import Funcao from './funcao';
import Setor from './setor';
import Processo from './processo';
import Pendencia from './pendencia';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  const store = getStore();
  store.injectReducer('all4qmsmsgateway', combineReducers(entitiesReducers as ReducersMapObject));
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="usuario/*" element={<Usuario />} />
        <Route path="funcao/*" element={<Funcao />} />
        <Route path="setor/*" element={<Setor />} />
        <Route path="processo/*" element={<Processo />} />
        <Route path="pendencia/*" element={<Pendencia />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
