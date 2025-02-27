import { Breadcrumbs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { Process } from 'app/modules/rnc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ActionPlanEfficacy,
  ActionPlanImplementation,
  AnalysisDetails,
  Configuration,
  Enums,
  Ishikawa,
  RawMap,
  RawPlanAction,
  RawRiskOpportunity,
  Reason,
  SummarizedProcess,
  SummarizedUser,
} from '../../models';
import { getAnalysis, getLevels, getTypes } from '../../reducers/enums.reducer';
import { getMaps } from '../../reducers/maps.reducer';
import { getProbabilities } from '../../reducers/probabilities.reducer';
import { saveRiskOpportunity as saveRiskOpportunityy } from '../../reducers/risks-opportunities.reducer';
import { getSeverities } from '../../reducers/severities.reducer';
import { BaseDetails } from '../components';
import { saveRiskOpportunity } from '../../service';

const AddRisk = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProcesses());
    dispatch(getUsers({}));
    dispatch(getProbabilities());
    dispatch(getSeverities());
    dispatch(getAnalysis());
    dispatch(getLevels());
    dispatch(getTypes());
    dispatch(getMaps());
  }, []);

  const allUsers = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  const allProcesses = useAppSelector<Array<Process>>(state => state.all4qmsmsgatewayrnc.process.entities);
  const probabilities: Array<Configuration> = useAppSelector<Array<Configuration>>(
    state => state.all4qmsmsgatewayro.probabilities.entities
  );
  const severities: Array<Configuration> = useAppSelector<Array<Configuration>>(state => state.all4qmsmsgatewayro.severities.entities);
  const enums: Enums = useAppSelector<Enums>(state => state.all4qmsmsgatewayro.enums.entity);
  const maps: Array<RawMap> = useAppSelector<Array<RawMap>>(state => state.all4qmsmsgatewayro.maps.entities);

  const currentMap = useMemo(() => {
    if (!maps || maps.length <= 0) {
      return null;
    }

    const filteredMaps: Array<RawMap> = maps.filter(m => m.tipoRO === 'R');
    return filteredMaps.length > 0 ? filteredMaps[0] : null;
  }, [maps]);

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

  const onSave = async (
    senderId: number,
    efficacy: ActionPlanEfficacy,
    implementation: ActionPlanImplementation,
    ishikawa: Ishikawa | null,
    reasons: Reason | null,
    details: AnalysisDetails,
    interestedParts: { id?: number; nomeParteInteressada: string },
    rawRiskOpportunity: RawRiskOpportunity,
    acoesPlano: RawPlanAction[]
  ): Promise<void> => {
    const res = await dispatch(
      saveRiskOpportunityy({
        acoesPlano,
        details,
        efficacy,
        implementation,
        interestedParts,
        ishikawa,
        reasons,
        riskOpportunity: rawRiskOpportunity,
        senderId,
      })
    );

    navigate('/risks-opportunities/');
  };

  const newOnSave = async (payload: Parameters<typeof saveRiskOpportunity>[0]) => {
    const ro = await saveRiskOpportunity(payload);
    if (ro.id) navigate(`/risks-opportunities/risk/${ro.id}`, { replace: true });
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

        <BaseDetails
          enums={enums}
          firstConfigurations={probabilities}
          map={currentMap}
          processes={getSummarizedProcesses()}
          secondConfigurations={severities}
          users={getSummarizedUsers()}
          onBack={onBack}
          onSave={onSave}
          newOnSave={newOnSave}
        />
      </div>
    </div>
  );
};

export default AddRisk;
