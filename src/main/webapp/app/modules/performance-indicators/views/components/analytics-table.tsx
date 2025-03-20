import { EditOutlined } from '@mui/icons-material';
import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { Storage } from 'react-jhipster';
import { Indicator, IndicatorGoal, SummarizedProcess } from '../../models';

type AnalyticsTableProps = {
  indicatorGoals: Array<IndicatorGoal>;
  indicators: Array<Indicator>;
  processes: Array<SummarizedProcess>;
  onManageMeasurementsRequested: (id: number) => void;
};

const AnalyticsTable = ({ indicatorGoals, indicators, onManageMeasurementsRequested, processes }: AnalyticsTableProps) => {
  const matchesRole = (userRole: string, role: string) => {
    if (!userRole || !role) {
      return false;
    }

    return userRole.includes(role);
  };

  const userRole = useMemo<string>(() => {
    return Storage.local.get('ROLE');
  }, []);

  const getIndicator = (id: number): Indicator | null => {
    const filteredIndicators: Array<Indicator> = indicators.filter(i => i.id === id);

    return filteredIndicators.length > 0 ? filteredIndicators[0] : null;
  };

  const getProcess = (id: number): SummarizedProcess | null => {
    const filteredProcesses: Array<SummarizedProcess> = processes.filter(i => i.id === id);

    return filteredProcesses.length > 0 ? filteredProcesses[0] : null;
  };

  const getColor = (measurement: number | null, goal: number, trend: 'MAIOR' | 'MENOR' | 'ESTABILIZAR'): string => {
    if (trend === 'ESTABILIZAR') {
      return 'green';
    }

    if (!measurement) {
      return 'black';
    }

    const diff: number = measurement - goal;

    if ((trend === 'MAIOR' && diff >= 0) || (trend === 'MENOR' && diff <= 0)) {
      return 'green';
    } else {
      return 'red';
    }
  };

  const render = (measurement: number | null, goal: number | null, avg: string, trend: 'MAIOR' | 'MENOR' | 'ESTABILIZAR') => {
    const decimalGoal: string = goal ? `${goal.toFixed(2)}%` : '-';

    return (
      <TableCell>
        <Stack spacing={2} alignItems="center">
          <Typography sx={{ color: 'black', fontSize: 12 }}>{decimalGoal}</Typography>
          <Typography sx={{ color: getColor(measurement, goal, trend), fontSize: 12 }}>{avg ?? '-'}</Typography>
        </Stack>
      </TableCell>
    );
  };

  const getCurrentGoal = (measurements: Array<number | null>, frequency: string): number => {
    const now: Date = new Date();
    const month: number = now.getMonth();

    if (frequency === 'MENSAL') {
      return measurements[month];
    } else if (frequency === 'BIMESTRAL') {
      const index: number = month - (month % 2);
      return measurements[index];
    } else if (frequency === 'TRIMESTRAL') {
      const index: number = month - (month % 3);
      return measurements[index];
    } else if (frequency === 'QUADRIMESTRAL') {
      const index: number = month - (month % 4);
      return measurements[index];
    } else if (frequency === 'SEMESTRAL') {
      const index: number = month - (month % 6);
      return measurements[index];
    } else {
      return measurements[0];
    }
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell align="left">Indicador</TableCell>
            <TableCell align="left">Processo</TableCell>
            <TableCell align="left">Meta Atual</TableCell>
            <TableCell align="left">Frequência</TableCell>
            <TableCell align="left">JAN</TableCell>
            <TableCell align="left">FEV</TableCell>
            <TableCell align="left">MAR</TableCell>
            <TableCell align="left">ABR</TableCell>
            <TableCell align="left">MAI</TableCell>
            <TableCell align="left">JUN</TableCell>
            <TableCell align="left">JUL</TableCell>
            <TableCell align="left">AGO</TableCell>
            <TableCell align="left">SET</TableCell>
            <TableCell align="left">OUT</TableCell>
            <TableCell align="left">NOV</TableCell>
            <TableCell align="left">DEZ</TableCell>
            <TableCell align="left">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {indicatorGoals?.map(indicatorGoal => {
            const { frequency, goals, id, indicator, measurements, year } = indicatorGoal;

            const completeIndicator: Indicator | null = getIndicator(indicator.id);
            const trend = completeIndicator.trend;

            const process: SummarizedProcess | null = getProcess(completeIndicator?.processId);

            const avgs: Array<number> = [];
            const avgsToShow: Array<string> = [];
            for (let i = 0; i < 12; i++) {
              if (goals[i] && measurements[i]) {
                avgs[i] = (measurements[i] / goals[i]) * 100;
                avgsToShow[i] = `${measurements[i].toFixed(2)}%`;
              } else {
                avgs[i] = 0;
                avgsToShow[i] = '-';
              }
            }

            const currentGoal: number | null = getCurrentGoal(measurements, frequency);

            return (
              <TableRow key={id}>
                <TableCell>{completeIndicator?.name ?? '-'}</TableCell>
                <TableCell>{process?.name ?? '-'}</TableCell>
                <TableCell sx={{ color: 'black' }}>{currentGoal?.toFixed(2) ?? '-'}%</TableCell> <TableCell>{frequency}</TableCell>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => render(measurements[month], goals[month], avgsToShow[month], trend))}
                <TableCell>
                  <Tooltip
                    title={matchesRole(userRole, 'ROLE_SGQ') || matchesRole(userRole, 'ROLE_ADMIN') ? 'Editar' : 'Incluir Resultados'}
                  >
                    <IconButton color="primary" onClick={() => onManageMeasurementsRequested(id)}>
                      <EditOutlined sx={{ color: '#e6b200' }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AnalyticsTable;
