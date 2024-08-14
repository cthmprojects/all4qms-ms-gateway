import { Breadcrumbs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { Process } from 'app/modules/rnc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ActionPlanEfficacy,
  ActionPlanImplementation,
  ActionPlanSummary,
  AnalysisDetails,
  Configuration,
  Enums,
  Ishikawa,
  RawMap,
  RawRiskOpportunity,
  Reason,
  SummarizedProcess,
  SummarizedUser,
} from '../../models';
import { getComplexities } from '../../reducers/complexities.reducer';
import { getAnalysis, getLevels, getTypes } from '../../reducers/enums.reducer';
import { getImprovements } from '../../reducers/improvements.reducer';
import { getMaps } from '../../reducers/maps.reducer';
import {
  editRiskOpportunity,
  getROById,
  saveInterestedPartAsync,
  saveRiskOpportunityApprovalAsync,
  saveRiskOpportunityInvestigation,
  saveRiskOpportunityPlanAsync,
} from '../../reducers/risks-opportunities.reducer';
import { BaseDetails } from '../components';
import { mapInterestPartToRaw } from '../../mappers';

const EditOpportunity = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProcesses());
    dispatch(getUsers({}));
    dispatch(getROById(id));
    dispatch(getComplexities());
    dispatch(getImprovements());
    dispatch(getAnalysis());
    dispatch(getLevels());
    dispatch(getTypes());
    dispatch(getMaps());
  }, []);

  const allUsers = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  const allProcesses = useAppSelector<Array<Process>>(state => state.all4qmsmsgatewayrnc.process.entities);
  const rawRiskOpportunity: RawRiskOpportunity = useAppSelector<RawRiskOpportunity>(state => state.all4qmsmsgatewayro.risco.entity);
  const complexities: Array<Configuration> = useAppSelector<Array<Configuration>>(state => state.all4qmsmsgatewayro.complexities.entities);
  const improvements: Array<Configuration> = useAppSelector<Array<Configuration>>(state => state.all4qmsmsgatewayro.improvements.entities);
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
    navigate('/risks-opportunities/');
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
    const riskOpportunityApprovalId: number = await saveRiskOpportunityApprovalAsync(implementation, efficacy);

    const riskOpportunityPlanId: number = await saveRiskOpportunityPlanAsync(actionPlanSummary);

    const riskOpportunityInvestigationId: number = await saveRiskOpportunityInvestigation(ishikawa, reasons);

    const riskOpportunityInterestedPartsIds: Array<number> = [];
    for (let i = 0; i < interestedParts.length; i++) {
      const interestedPart: string = interestedParts[i];

      const interestPartId: number | null = await saveInterestedPartAsync(mapInterestPartToRaw(interestedPart, senderId));

      if (interestPartId) {
        riskOpportunityInterestedPartsIds.push(interestPartId);
      }
    }

    rawRiskOpportunity.idPartesInteressadas = riskOpportunityInterestedPartsIds.length > 0 ? riskOpportunityInterestedPartsIds[0] : 0;
    rawRiskOpportunity.id = parseInt(id);

    dispatch(editRiskOpportunity(rawRiskOpportunity));

    // const riskOpportunityAnalysisId: number = await saveRiskOpportunityAnalysis(
    //   details,
    //   senderId,
    //   riskOpportunityApprovalId,
    //   riskOpportunityInvestigationId,
    //   riskOpportunityPlanId
    // );
    // rawRiskOpportunity.idsAnaliseROS = [riskOpportunityAnalysisId];
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
          <Typography className="link">Oportunidades</Typography>
        </Breadcrumbs>

        <h2 className="title">Oportunidade</h2>

        <BaseDetails
          enums={enums}
          firstConfigurations={complexities}
          isOpportunity
          map={currentMap}
          processes={getSummarizedProcesses()}
          riskOpportunity={rawRiskOpportunity}
          secondConfigurations={improvements}
          users={getSummarizedUsers()}
          onBack={onBack}
          onSave={onSave}
        />
      </div>
    </div>
  );
};

export default EditOpportunity;
