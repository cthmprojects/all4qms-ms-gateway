import { Breadcrumbs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { Process } from 'app/modules/infodoc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Configuration, Enums, RawMap, RawRiskOpportunity, SummarizedProcess, SummarizedUser } from '../../models';
import { getAnalysis, getLevels, getTypes } from '../../reducers/enums.reducer';
import { getMaps } from '../../reducers/maps.reducer';
import { getProbabilities } from '../../reducers/probabilities.reducer';
import { getROById } from '../../reducers/risks-opportunities.reducer';
import { getSeverities } from '../../reducers/severities.reducer';
import { BaseDetails } from '../components';

const ViewRisk = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProcesses());
    dispatch(getUsers({}));
    dispatch(getROById(id));
    dispatch(getProbabilities());
    dispatch(getSeverities());
    dispatch(getAnalysis());
    dispatch(getLevels());
    dispatch(getTypes());
    dispatch(getMaps());
  }, []);

  const allUsers = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  const allProcesses = useAppSelector<Array<Process>>(state => state.all4qmsmsgatewayrnc.process.entities);
  const rawRiskOpportunity: RawRiskOpportunity = useAppSelector<RawRiskOpportunity>(state => state.all4qmsmsgatewayro.risco.entity);
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
    navigate('/risks-opportunities/');
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
          readonly
          riskOpportunity={rawRiskOpportunity}
          secondConfigurations={severities}
          users={getSummarizedUsers()}
          onBack={onBack}
        />
      </div>
    </div>
  );
};

export default ViewRisk;