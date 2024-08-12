import { Breadcrumbs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { Process } from 'app/modules/infodoc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ActionPlanEfficacy,
  ActionPlanImplementation,
  ActionPlanSummary,
  AnalysisDetails,
  Ishikawa,
  RawRiskOpportunity,
  Reason,
  SummarizedProcess,
  SummarizedUser,
} from '../../models';
import { getROById } from '../../reducers/risks-opportunities.reducer';
import { BaseDetails } from '../components';

const EditRisk = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProcesses());
    dispatch(getUsers({}));
    dispatch(getROById(id));
  }, []);

  const allUsers = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  const allProcesses = useAppSelector<Array<Process>>(state => state.all4qmsmsgatewayrnc.process.entities);
  const rawRiskOpportunity: RawRiskOpportunity = useAppSelector<RawRiskOpportunity>(state => state.all4qmsmsgatewayro.risco.entity);

  useEffect(() => {
    console.log('raw', rawRiskOpportunity);
  }, [rawRiskOpportunity]);

  const getSummarizedProcesses = (): Array<SummarizedProcess> => {
    if (!allProcesses || allProcesses.length <= 0) {
      return [];
    }

    return allProcesses.map(p => {
      return { id: p.id, name: p.nome };
    });
  };

  const getSummarizedUsers = (): Array<SummarizedUser> => {
    if (!allUsers || allUsers.length <= 0) {
      return [];
    }

    return allUsers.map(u => {
      return { id: u.id, name: u.nome };
    });
  };

  const onBack = (): void => {
    navigate('/risks-opportunities/');
  };

  const onSave = (
    efficacy: ActionPlanEfficacy,
    implementation: ActionPlanImplementation,
    actionPlanSummary: ActionPlanSummary,
    ishikawa: Ishikawa | null,
    reasons: Reason | null,
    details: AnalysisDetails,
    rawRiskOpportunity: RawRiskOpportunity
  ): void => {
    // TODO: [PUT] request to backend
  };

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Link to={'/risks-opportunities'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Riscos & Oportunidades
          </Link>
          <Typography className="link">Riscos</Typography>
        </Breadcrumbs>

        <h2 className="title">Risco</h2>

        <BaseDetails processes={getSummarizedProcesses()} users={getSummarizedUsers()} onBack={onBack} onSave={onSave} />
      </div>
    </div>
  );
};

export default EditRisk;
