import { Breadcrumbs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TabsCustom } from '../../../../shared/components/tabs';
import { Configuration, Enums, RawMap } from '../../models';
import { getConfigurations } from '../../reducers/configurations.reducer';
import { getAnalysis, getLevels, getTypes } from '../../reducers/enums.reducer';
import ConfigurationsTabOpportunity from '../components/config-tab-opportunity';
import ConfigurationsTabRisk from '../components/config-tab-risk';
import { getMaps } from '../../reducers/maps.reducer';

const Configurations = () => {
  const [valueTab, setValueTab] = useState<number>(0);
  const [opportunityConfigurations, setOpportunityConfigurations] = useState<Array<Configuration>>([]);
  const [riskConfigurations, setRiskConfigurations] = useState<Array<Configuration>>([]);
  const [riskMap, setRiskMap] = useState<RawMap | null>(null);
  const [opportunityMap, setOpportunityMap] = useState<RawMap | null>(null);

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };

  const dispatch = useAppDispatch();
  const configurations: Array<Configuration> = useAppSelector<Array<Configuration>>(
    state => state.all4qmsmsgatewayro.configurations.entities
  );
  const enums: Enums = useAppSelector<Enums>(state => state.all4qmsmsgatewayro.enums.entity);
  const maps: Array<RawMap> = useAppSelector<Array<RawMap>>(state => state.all4qmsmsgatewayro.maps.entities);

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

  useEffect(() => {
    if (!maps || maps.length <= 0) {
      return;
    }

    const filteredRiskMaps: Array<RawMap> = maps.filter(c => c.tipoRO === 'R');
    const riskMap: RawMap | null = filteredRiskMaps.length > 0 ? filteredRiskMaps[0] : null;
    setRiskMap(riskMap);

    const filteredOpportunityMaps: Array<RawMap> = maps.filter(c => c.tipoRO === 'O');
    const opportunityMap: RawMap | null = filteredOpportunityMaps.length > 0 ? filteredOpportunityMaps[0] : null;
    setOpportunityMap(opportunityMap);
  }, [maps]);

  const fetchConfigurations = (): void => {
    dispatch(getConfigurations({}));
  };

  const fetchMaps = (): void => {
    dispatch(getMaps());
  };

  const tabsPanel = [
    {
      label: 'RISCOS',
      children: (
        <ConfigurationsTabRisk
          configurations={riskConfigurations}
          levels={enums.levelOptions}
          map={riskMap}
          onSaved={fetchConfigurations}
        />
      ),
    },
    {
      label: 'OPORTUNIDADES',
      children: (
        <ConfigurationsTabOpportunity
          configurations={opportunityConfigurations}
          map={opportunityMap}
          levels={enums.levelOptions}
          onSaved={fetchConfigurations}
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
