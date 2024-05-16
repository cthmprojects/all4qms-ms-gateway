import getStore from 'app/config/store';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import React from 'react';
import { Route } from 'react-router-dom';
import { ReducersMapObject, combineReducers } from 'redux';
import rncReducers from './reducers';
import RncList from './ui/home/rnc-list';
import GeneralRegister from './ui/new/register-types/general-register/general-register';
import RegisterImplementationClose from './ui/new/register-types/register-implementation-close/register-implementation-close';
import RegisterImplementationVerification from './ui/new/register-types/register-implementation-verification/register-implementation-verification';
import RegisterImplementation from './ui/new/register-types/register-implementation/register-implementation';
import RNCNew from './ui/new/rnc-new';
import RncDetails from './ui/view/rnc-details';

const handleTela = (tela: string) => {
  console.log(tela);
};

const RncRoutes = () => {
  const store = getStore();
  store.injectReducer('all4qmsmsgateway', combineReducers(rncReducers as ReducersMapObject));

  return (
    <div>
      <ErrorBoundaryRoutes>
        <Route path="" element={<RncList />} />
        <Route path="new/" element={<RNCNew />} />
        <Route path="new/:id" element={<RNCNew />} />
        <Route path="general/:id" element={<GeneralRegister />}></Route>
        <Route
          path="general/implementacao/:id"
          element={<RegisterImplementation handleTela={handleTela} handlePrazoImplementacao={handleTela} />}
        />
        <Route
          path="general/implementacao/validacao/:id"
          element={<RegisterImplementationVerification handleTela={handleTela} handlePrazoVerificacao={handleTela} />}
        />
        <Route
          path="general/implementacao/fechamento/:id"
          element={<RegisterImplementationClose handleTela={handleTela} save={handleTela} handlePrazoFechamento={handleTela} />}
        />
        <Route path="view/:id" element={<RncDetails />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default RncRoutes;
