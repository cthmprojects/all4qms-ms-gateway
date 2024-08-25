import { Box, Breadcrumbs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Process } from 'app/modules/rnc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Indicator, SummarizedProcess } from '../../models';
import { getAllIndicators } from '../../reducers/indicators.reducer';
import { DashboardHeader } from '../components';
import DashboardBody from '../components/dashboard-body';
import DashboardBottom from '../components/dashboard-bottom';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProcesses());
    dispatch(getAllIndicators());
  }, []);

  const goToAnalytics = (): void => {
    navigate('analytics');
  };

  const indicators: Array<Indicator> = useAppSelector(state => state.all4qmsmsgatewaymetaind.indicators.entities);
  const processes: Array<Process> = useAppSelector(state => state.all4qmsmsgatewayrnc.process.entities);

  const summarizedProcesses = useMemo<Array<SummarizedProcess>>(() => {
    if (!processes || processes.length <= 0) {
      return [];
    }

    return processes.map(p => {
      return {
        id: p.id,
        name: p.nome,
      };
    });
  }, [processes]);

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
              indicators={indicators}
              onAnalyticsRequested={goToAnalytics}
              onSearchRequested={() => {}}
              processes={summarizedProcesses}
            />
          </Box>
          <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
            <DashboardBody />
          </Box>
          <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
            <DashboardBottom />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Dashboard;
