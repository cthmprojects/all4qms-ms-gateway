import { Breadcrumbs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { Process } from 'app/modules/rnc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Configuration, Enums, RawMap, SummarizedProcess, SummarizedUser } from '../../models';
import { getComplexities } from '../../reducers/complexities.reducer';
import { getAnalysis, getLevels, getTypes } from '../../reducers/enums.reducer';
import { getImprovements } from '../../reducers/improvements.reducer';
import { getMaps } from '../../reducers/maps.reducer';
import { BaseDetails } from '../components';
import { saveRiskOpportunity } from '../../service';

const AddOpportunity = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProcesses());
    dispatch(getUsers({}));
    dispatch(getComplexities());
    dispatch(getImprovements());
    dispatch(getAnalysis());
    dispatch(getLevels());
    dispatch(getTypes());
    dispatch(getMaps());
  }, []);

  const allUsers = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);
  const allProcesses = useAppSelector<Array<Process>>(state => state.all4qmsmsgatewayrnc.process.entities);
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

  const newOnSave = async (payload: Parameters<typeof saveRiskOpportunity>[0]) => {
    const ro = await saveRiskOpportunity(payload);
    if (ro.id) navigate(`/risks-opportunities/opportunity/${ro.id}`, { replace: true });
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
          secondConfigurations={improvements}
          users={getSummarizedUsers()}
          onBack={onBack}
          newOnSave={newOnSave}
        />
      </div>
    </div>
  );
};

export default AddOpportunity;
