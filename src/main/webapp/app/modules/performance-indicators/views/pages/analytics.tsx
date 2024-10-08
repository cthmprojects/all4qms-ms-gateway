import { Box, Breadcrumbs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Process } from 'app/modules/infodoc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Indicator, IndicatorGoal, SummarizedProcess } from '../../models';
import { getAllIndicatorGoals } from '../../reducers/indicator-goals.reducer';
import { getAllIndicators } from '../../reducers/indicators.reducer';
import { AnalyticsHeader, AnalyticsTable } from '../components';

const Analytics = () => {
  const [process, setProcess] = useState<SummarizedProcess | null>(null);
  const [query, setQuery] = useState<string>('');
  const [year, setYear] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProcesses());
    dispatch(getAllIndicators());
    dispatch(getAllIndicatorGoals());
  }, []);

  const indicators: Array<Indicator> = useAppSelector(state => state.all4qmsmsgatewaymetaind.indicators.entities);
  const indicatorGoals: Array<IndicatorGoal> = useAppSelector(state => state.all4qmsmsgatewaymetaind.indicatorGoals.entities);
  const processes: Array<Process> = useAppSelector(state => state.all4qmsmsgatewayrnc.process.entities);

  const goToAddIndicator = (): void => {
    navigate('../indicator');
  };

  const goToDashboard = (): void => {
    navigate('../');
  };

  const doSearch = (): Array<Indicator> => {
    return indicators;
  };

  const findIndicatorById = (id: number): Indicator | null => {
    return indicators.find(i => i.id === id);
  };

  const goToManageMeasurements = (id: number): void => {
    navigate(`../indicator/${id}/measurements`);
  };

  const onSearch = (indicator: Indicator | null, process: SummarizedProcess | null, year: number | null, query: string): void => {
    setProcess(process);
    setQuery(query);
    setYear(year);
  };

  const filteredIndicatorGoals = useMemo<Array<IndicatorGoal>>(() => {
    return indicatorGoals.filter(ig => {
      if (!ig || !ig.indicator || !ig.indicator.id || ig.indicator.id <= 0) {
        return false;
      }

      const indicatorId: number = ig.indicator.id;
      const indicator: Indicator | null = findIndicatorById(indicatorId);

      if (!indicator) {
        return false;
      }

      const matchesProcess: boolean = (process && indicator.processId === process.id) || !process;
      const matchesYear: boolean = (year && ig.year === year.toString()) || !year;
      const matchesIndicator: boolean = indicator.name.includes(query);

      return matchesProcess && matchesYear && matchesIndicator;
    });
  }, [indicatorGoals, process, query, year]);

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

          <Typography className="link">Indicadores Analíticos</Typography>
        </Breadcrumbs>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <h2 className="title">Analítico</h2>

            <AnalyticsHeader
              onAddIndicatorRequested={goToAddIndicator}
              onDashboardRequested={goToDashboard}
              onSearchRequested={onSearch}
              processes={summarizedProcesses}
            />

            <AnalyticsTable
              indicatorGoals={filteredIndicatorGoals}
              indicators={indicators}
              onManageMeasurementsRequested={goToManageMeasurements}
              processes={summarizedProcesses}
            />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Analytics;
