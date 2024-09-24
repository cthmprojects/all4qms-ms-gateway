import { Box, Breadcrumbs, Tab, Tabs, Typography } from '@mui/material';
import { CustomTabPanel } from 'app/shared/components/tabs';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TimelineTabContent } from '../components/timeline-tab-content';
import { PlanningTabContent } from '../components/planning-tab-content';

export const HomeAudit = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const onTabChange = (_, index) => setTabIndex(index);
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
            Item Four
          </CustomTabPanel>
        </div>
      </div>
    </div>
  );
};
