import { Box, Breadcrumbs, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AnalyticsHeader, AnalyticsTable } from '../components';

const Analytics = () => {
  const navigate = useNavigate();

  const goToAddIndicator = (): void => {
    navigate('../indicator');
  };

  const goToDashboard = (): void => {
    navigate('../');
  };

  const goToManageMeasurements = (id: number): void => {
    navigate(`../indicator/${id}/measurements`);
  };

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">Indicadores Analíticos</Typography>
        </Breadcrumbs>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <h2 className="title">Analítico</h2>

            <AnalyticsHeader
              onAddIndicatorRequested={goToAddIndicator}
              onDashboardRequested={goToDashboard}
              onSearchRequested={() => {}}
              processes={[
                { id: 1, name: 'Produção' },
                { id: 2, name: 'Chão de fábrica' },
              ]}
            />

            <AnalyticsTable
              indicatorGoals={[
                {
                  frequency: 'MENSAL',
                  goals: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
                  indicator: {
                    id: 1,
                    code: null,
                    description: null,
                    name: null,
                    processId: null,
                    trend: null,
                    unit: null,
                    indicatorGoalId: null,
                  },
                  measurements: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                  year: '2024',
                  id: 1,
                },
                {
                  frequency: 'MENSAL',
                  goals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                  indicator: {
                    id: 2,
                    code: null,
                    description: null,
                    name: null,
                    processId: null,
                    trend: null,
                    unit: null,
                    indicatorGoalId: null,
                  },
                  measurements: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
                  year: '2024',
                  id: 2,
                },
              ]}
              indicators={[
                {
                  code: 'Código 1',
                  description: 'Descrição 1',
                  name: 'Nome 1',
                  processId: 1,
                  trend: 'MAIOR',
                  unit: 'DECIMAL',
                  id: 1,
                },
                {
                  code: 'Código 2',
                  description: 'Descrição 2',
                  name: 'Nome 2',
                  processId: 1,
                  trend: 'MAIOR',
                  unit: 'DECIMAL',
                  id: 2,
                },
              ]}
              onManageMeasurementsRequested={goToManageMeasurements}
              processes={[
                { id: 1, name: 'Produção' },
                { id: 2, name: 'Chão de fábrica' },
              ]}
            />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Analytics;
