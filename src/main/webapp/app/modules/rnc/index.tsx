import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import RncList from './home/rnc-list';
import RNCNew from './new/rnc-new';
import GeneralRegister from './new/register-types/general-register/general-register';
import RegisterImplementation from './new/register-types/register-implementation/register-implementation';
import RegisterImplementationVerification from './new/register-types/register-implementation-verification/register-implementation-verification';
import RegisterImplementationClose from './new/register-types/register-implementation-close/register-implementation-close';
import { IRNC } from './new/rnc.interface';

const handleTela = (tela: string) => {
  console.log(tela);
};

const RncRoutes = () => {
  // const [RNCList, setRNCList] = useState<IRNC[]>([]);

  const [RNCs, setRNCs] = useState([]);

  const handleRNCNewFirstForm = rnc => {
    // const numRNC = RNCs.length + 1;

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

  return (
    <div>
      <ErrorBoundaryRoutes>
        <Route path="" element={<RncList />} />
        <Route path="new" element={<RNCNew handleRNC={handleRNCNewFirstForm} RNCNumber={RNCs.length + 1} />} />
        <Route path="general" element={<GeneralRegister handleTela={handleTela} handleAcao={handleTela} />}></Route>
        <Route
          path="general/implementacao"
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
