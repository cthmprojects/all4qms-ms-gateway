import { Box, Breadcrumbs, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TabsCustom } from '../../../../shared/components/tabs';
import ConfigurationsTabRisk from '../components/config-tab-risk';
import ConfigurationsTabOpportunity from '../components/config-tab-opportunity';
import { Configuration } from '../../models';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getConfigurations } from '../../reducers/configurations.reducer';

const tabsPanel = [
  {
    label: 'RISCOS',
    children: <ConfigurationsTabRisk />,
  },
  {
    label: 'OPORTUNIDADES',
    children: <ConfigurationsTabOpportunity />,
  },
];
const Configurations = () => {
  const [valueTab, setValueTab] = useState(0);

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };

  const dispatch = useAppDispatch();
  const configurations: Array<Configuration> = useAppSelector<Array<Configuration>>(
    state => state.all4qmsmsgatewayro.configurations.entities
  );

  useEffect(() => {
    console.log('configurations', configurations);
  }, [configurations]);

  useEffect(() => {
    dispatch(getConfigurations({}));
  }, []);

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
