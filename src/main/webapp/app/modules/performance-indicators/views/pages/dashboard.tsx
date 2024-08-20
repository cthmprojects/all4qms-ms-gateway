import { Box, Breadcrumbs, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardHeader } from '../components';

const Dashboard = () => {
  const navigate = useNavigate();

  const goToAnalytics = (): void => {
    navigate('analytics');
  };

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">Indicadores</Typography>
        </Breadcrumbs>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <h2 className="title">Indicador</h2>

            <DashboardHeader
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
              onAnalyticsRequested={goToAnalytics}
              onSearchRequested={() => {}}
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

export default Dashboard;
