import getStore from 'app/config/store';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { Route } from 'react-router-dom';
import { combineReducers, ReducersMapObject } from 'redux';
import rncReducers from '../rnc/reducers';
import { HomeAudit } from './pages/home-audit';
import { PlanningNewEdit } from './pages/planning-new-edit';
import { ModelAuditNewEdit } from './pages/model-audit-new-edit';

export const AuditRoutes = () => {
  const store = getStore();
  store.injectReducer('all4qmsmsgatewayrnc', combineReducers(rncReducers as ReducersMapObject));

  return (
    <>
      <ErrorBoundaryRoutes>
        <Route path="" element={<HomeAudit />} />
        <Route path="timeline/new" element={<></>} />
        <Route path="timeline/edit/:idTimeline" element={<></>} />
        <Route path="planning/new" element={<PlanningNewEdit />} />
        <Route path="planning/edit/:idPlanning" element={<></>} />
        <Route path="auditorship/new" element={<></>} />
        <Route path="auditorship/edit/:idAuditorship" element={<></>} />
        <Route path="model/new" element={<ModelAuditNewEdit />} />
        <Route path="model/edit/:idmodel" element={<></>} />
      </ErrorBoundaryRoutes>
    </>
  );
};
