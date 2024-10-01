import { Breadcrumbs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { Process } from 'app/modules/rnc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ActionPlanEfficacy,
  ActionPlanImplementation,
  ActionPlanSummary,
  AnalysisDetails,
  Configuration,
  Enums,
  Ishikawa,
  RawCompleteAnalysis,
  RawMap,
  RawRiskOpportunity,
  Reason,
  SummarizedProcess,
  SummarizedUser,
} from '../../models';
import { getAnalysis, getLevels, getTypes } from '../../reducers/enums.reducer';
import { getMaps } from '../../reducers/maps.reducer';
import { getProbabilities } from '../../reducers/probabilities.reducer';
import { saveRiskOpportunity } from '../../reducers/risks-opportunities.reducer';
import { getSeverities } from '../../reducers/severities.reducer';
import { BaseDetails } from '../components';
import { EixosSwot } from '../../../strategic-planning/models/swot';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { updateSwot } from '../../../strategic-planning/reducers/swot.reducer';

type redirectDataType = {
  from?: string;
  data?: EixosSwot;
};

const AddRisk = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectData = location?.state as redirectDataType;

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

    const filteredMaps: Array<RawMap> = maps.filter(m => m.tipoRO === 'O');
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
    if (redirectData.from) navigate(`/${redirectData.from}`);
    else navigate('/risks-opportunities/');
  };

  const onSave = async (
    senderId: number,
    efficacy: ActionPlanEfficacy,
    implementation: ActionPlanImplementation,
    actionPlanSummary: ActionPlanSummary,
    ishikawa: Ishikawa | null,
    reasons: Reason | null,
    details: AnalysisDetails,
    interestedParts: Array<string>,
    rawRiskOpportunity: RawRiskOpportunity
  ): Promise<void> => {
    dispatch(
      saveRiskOpportunity({
        actionPlanSummary,
        details,
        efficacy,
        implementation,
        interestedParts,
        ishikawa,
        reasons,
        riskOpportunity: rawRiskOpportunity,
        senderId,
      })
    ).then(res => {
      const resRo: RawCompleteAnalysis = (res.payload as AxiosResponse).data;
      if (resRo) {
        toast.error('Riscos & Oportunidades salvos com sucesso!.');

        if (redirectData.data) {
          dispatch(updateSwot({ ...redirectData.data, idRiscoOportunidade: resRo.analise.id }));
          navigate(`/${redirectData.from}`);
        } else navigate('/risks-opportunities/');
      } else toast.error('Tente novamente mais tarde documento.');
    });
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
          swotData={redirectData.data}
          onBack={onBack}
          onSave={onSave}
        />
      </div>
    </div>
  );
};

export default AddRisk;
