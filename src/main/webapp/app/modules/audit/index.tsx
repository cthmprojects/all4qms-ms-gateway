import getStore from 'app/config/store';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { Route } from 'react-router-dom';
import { combineReducers, ReducersMapObject } from 'redux';
import rncReducers from '../rnc/reducers';
import { HomeAudit } from './pages/home-audit';
import { PlanningNewEdit } from './pages/planning-new-edit';
import { TimelineNewEdit } from './pages/timeline-new-edit';
import { ModelAuditNewEdit } from './pages/model-audit-new-edit';
import { RegisterNewEdit } from './pages/register-new-edit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuditMaintenance } from './pages/audit-maintenance';

export const queryClientAudit = new QueryClient();

export const AuditRoutes = () => {
  const store = getStore();
  store.injectReducer('all4qmsmsgatewayrnc', combineReducers(rncReducers as ReducersMapObject));

  return (
    <>
      <QueryClientProvider client={queryClientAudit}>
        <ErrorBoundaryRoutes>
          <Route path="" element={<HomeAudit />} />
          <Route path="timeline/new" element={<TimelineNewEdit />} />
          <Route path="timeline/edit/:idTimeline" element={<TimelineNewEdit />} />
          <Route path="planning/new" element={<PlanningNewEdit />} />
          <Route path="planning/edit/:idPlanning" element={<PlanningNewEdit />} />
          <Route path="auditorship/new" element={<RegisterNewEdit />} />
          <Route path="auditorship/edit/:idAuditorship" element={<></>} />
          <Route path="model/new" element={<ModelAuditNewEdit />} />
          <Route path="model/edit/:idmodel" element={<></>} />
          <Route path="maintenance" element={<AuditMaintenance />} />
        </ErrorBoundaryRoutes>
      </QueryClientProvider>
    </>
  );
};
