import { Box, Breadcrumbs, Tab, Tabs, Typography } from '@mui/material';
import { CustomTabPanel } from 'app/shared/components/tabs';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { TimelineTabContent } from '../components/timeline-tab-content';
import { PlanningTabContent } from '../components/planning-tab-content';
import { ModelTabContent } from '../components/model-tab-content';
import { ModelListContent } from '../components/model-list-content';

export const HomeAudit = () => {
  const query = new URLSearchParams(location.search);

  const [tabIndex, setTabIndex] = useState(Number(query.get('tab')) || 0);
  const navigate = useNavigate();

  const onTabChange = (_, index) => {
    navigate(`/audit?tab=${index}`, { replace: true });
    setTabIndex(index);
  };
  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">Auditoria</Typography>
        </Breadcrumbs>

        <h2 className="title">Auditoria</h2>
        <div>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabIndex} onChange={onTabChange} aria-label="basic tabs example">
              <Tab label="Cronogramas" />
              <Tab label="Planejamentos" />
              <Tab label="Auditorias" />
              <Tab label="Modelos de Auditorias" />
            </Tabs>
          </Box>
          <CustomTabPanel value={tabIndex} index={0}>
            <TimelineTabContent />
          </CustomTabPanel>
          <CustomTabPanel value={tabIndex} index={1}>
            <PlanningTabContent />
          </CustomTabPanel>
          <CustomTabPanel value={tabIndex} index={2}>
            Item Three
          </CustomTabPanel>
          <CustomTabPanel value={tabIndex} index={3}>
            <ModelTabContent />
          </CustomTabPanel>
        </div>
      </div>
    </div>
  );
};
