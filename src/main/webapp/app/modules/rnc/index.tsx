import getStore from 'app/config/store';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import { ReducersMapObject, combineReducers } from 'redux';
import rncReducers from './reducers';
import { list } from './reducers/rnc.reducer';
import RncList from './ui/home/rnc-list';
import GeneralRegister from './ui/new/register-types/general-register/general-register';
import RegisterImplementationClose from './ui/new/register-types/register-implementation-close/register-implementation-close';
import RegisterImplementationVerification from './ui/new/register-types/register-implementation-verification/register-implementation-verification';
import RegisterImplementation from './ui/new/register-types/register-implementation/register-implementation';
import RNCNew from './ui/new/rnc-new';
import entitiesReducers from 'app/entities/reducers';

const handleTela = (tela: string) => {
  console.log(tela);
};

const RncRoutes = () => {
  const [RNCs, setRNCs] = useState([]);

  const handleRNCNewFirstForm = rnc => {
    const newRNC = {
      id: rnc.number.value,
      emitter: rnc.emitter.value,
      date: rnc.date.value,
      processOrigin: rnc.processOrigin.value,
      forwarded: rnc.forwarded.value,
      processTarget: rnc.processTarget.value,
      type: rnc.type.value,
      origin: rnc.origin.value,
    };

    setRNCs([...RNCs, newRNC]);
  };

  const handleUpdateRNC = obj => {
    const updatedRNCs = RNCs.map(item => {
      if (item.id === obj.id) {
        console.log({ ...item, ...obj });
        return { ...item, ...obj };
      }
      return item;
    });

    setRNCs(updatedRNCs);
  };

  const findRNCById = id => {
    return RNCs.find(item => item.id === id);
  };

  const store = getStore();
  store.injectReducer('all4qmsmsgateway', combineReducers(rncReducers as ReducersMapObject));

  return (
    <div>
      <ErrorBoundaryRoutes>
        <Route path="" element={<RncList />} />
        <Route
          path="new"
          element={
            <RNCNew handleRNC={handleRNCNewFirstForm} RNCNumber={RNCs.length + 1} RNCList={RNCs} handleUpdateRNC={handleUpdateRNC} />
          }
        />
        <Route
          path="general/:id"
          element={<GeneralRegister handleTela={handleTela} handleUpdateRNC={handleUpdateRNC} findRNCById={findRNCById} />}
        ></Route>
        <Route
          path="general/implementacao/"
          element={<RegisterImplementation handleTela={handleTela} handlePrazoImplementacao={handleTela} />}
        />
        <Route
          path="general/implementacao/validacao"
          element={<RegisterImplementationVerification handleTela={handleTela} handlePrazoVerificacao={handleTela} />}
        />
        <Route
          path="general/implementacao/fechamento"
          element={<RegisterImplementationClose handleTela={handleTela} save={handleTela} handlePrazoFechamento={handleTela} />}
        />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default RncRoutes;
