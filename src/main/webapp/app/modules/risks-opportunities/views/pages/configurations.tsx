import { Breadcrumbs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TabsCustom } from '../../../../shared/components/tabs';
import { Configuration, Enums, RawMap } from '../../models';
import { getConfigurations } from '../../reducers/configurations.reducer';
import { getAnalysis, getLevels, getTypes } from '../../reducers/enums.reducer';
import { getMaps } from '../../reducers/maps.reducer';
import ConfigurationsTabOpportunity from '../components/config-tab-opportunity';
import ConfigurationsTabRisk from '../components/config-tab-risk';

const Configurations = () => {
  const [valueTab, setValueTab] = useState<number>(0);
  const [opportunityConfigurations, setOpportunityConfigurations] = useState<Array<Configuration>>([]);
  const [riskConfigurations, setRiskConfigurations] = useState<Array<Configuration>>([]);

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };

  const dispatch = useAppDispatch();
  const configurations: Array<Configuration> = useAppSelector<Array<Configuration>>(
    state => state.all4qmsmsgatewayro.configurations.entities
  );
  const enums: Enums = useAppSelector<Enums>(state => state.all4qmsmsgatewayro.enums.entity);
  const loading: boolean = useAppSelector<boolean>(state => state.all4qmsmsgatewayro.maps.loading);
  const map: RawMap | null = useAppSelector<RawMap | null>(state => state.all4qmsmsgatewayro.maps.entity);
  const maps: Array<RawMap> = useAppSelector<Array<RawMap>>(state => state.all4qmsmsgatewayro.maps.entities);
  const userQms = useAppSelector(state => state.authentication.accountQms);

  useEffect(() => {
    fetchConfigurations();
    fetchMaps();

    dispatch(getAnalysis());
    dispatch(getLevels());
    dispatch(getTypes());
  }, []);

  useEffect(() => {
    if (!configurations || configurations.length <= 0) {
      return;
    }

    setOpportunityConfigurations(configurations.filter(c => c.tipoRO === 'O'));
    setRiskConfigurations(configurations.filter(c => c.tipoRO === 'R'));
  }, [configurations]);

  const riskMap = useMemo<RawMap | null>(() => {
    if ((!maps || maps.length <= 0) && !map) {
      return null;
    }

    if (map && map.tipoRO === 'R') {
      return map;
    }

    return maps.find(m => m.tipoRO === 'R');
  }, [maps, map]);

  const opportunityMap = useMemo<RawMap | null>(() => {
    if ((!maps || maps.length <= 0) && !map) {
      return null;
    }

    if (map && map.tipoRO === 'O') {
      return map;
    }

    return maps.find(m => m.tipoRO === 'O');
  }, [maps, map]);

  const fetchConfigurations = (): void => {
    dispatch(getConfigurations({}));
  };

  const fetchMaps = (): void => {
    dispatch(getMaps());
  };

  const fetchAll = (): void => {
    fetchConfigurations();
    fetchMaps();
  };

  const tabsPanel = [
    {
      label: 'RISCOS',
      children: (
        <ConfigurationsTabRisk
          configurations={riskConfigurations}
          levels={enums.levelOptions}
          loading={loading}
          map={riskMap}
          onSaved={fetchAll}
          userId={userQms?.id}
        />
      ),
    },
    {
      label: 'OPORTUNIDADES',
      children: (
        <ConfigurationsTabOpportunity
          configurations={opportunityConfigurations}
          levels={enums.levelOptions}
          loading={loading}
          map={opportunityMap}
          onSaved={fetchAll}
          userId={userQms?.id}
        />
      ),
    },
  ];

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
          <Typography className="link">Configurações</Typography>
        </Breadcrumbs>

        <TabsCustom tabsPanel={tabsPanel} valueTab={valueTab} setValueTab={setValueTab} handleChange={handleChangeTab} />
      </div>
    </div>
  );
};

export default Configurations;
