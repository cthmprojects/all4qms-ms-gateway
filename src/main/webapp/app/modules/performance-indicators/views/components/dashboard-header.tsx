import { TableChart } from '@mui/icons-material';
import { Autocomplete, Button, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Indicator, SummarizedProcess } from '../../models';

type DashboardHeaderProps = {
  indicators: Array<Indicator>;
  processes: Array<SummarizedProcess>;
  onAnalyticsRequested: () => void;
  onSearchRequested: (indicator: Indicator, process: SummarizedProcess, year: number) => void;
};

const DashboardHeader = ({ indicators, onAnalyticsRequested, onSearchRequested, processes }: DashboardHeaderProps) => {
  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const [process, setProcess] = useState<SummarizedProcess | null>(null);

  useEffect(() => {
    if (!indicators || indicators.length <= 0) {
      return;
    }

    setIndicator(indicators[0]);
  }, [indicators]);

  useEffect(() => {
    if (!processes || processes.length <= 0) {
      return;
    }

    setProcess(processes[0]);
  }, [processes]);

  return (
    <Stack direction="row" spacing={2}>
      <Button
        onClick={_ => onAnalyticsRequested()}
        startIcon={<TableChart />}
        sx={{
          '& .MuiButton-startIcon': {
            marginTop: 0,
          },
          '& .MuiTouchRipple-root': {
            marginTop: 0,
          },
        }}
        variant="outlined"
      >
        Analítico
      </Button>

      <Autocomplete
        disableClearable
        getOptionLabel={option => `${option.code} - ${option.name}`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        options={indicators}
        renderInput={props => <TextField {...props} label="Indicador" />}
        sx={{ display: 'flex', flexGrow: 1 }}
        value={indicator}
      />

      <Autocomplete
        disableClearable
        getOptionLabel={option => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        options={processes}
        renderInput={props => <TextField {...props} label="Processo" />}
        sx={{ display: 'flex', flexGrow: 1 }}
        value={process}
      />

      <Autocomplete
        disableClearable
        options={['2022', '2023', '2024', '2025']}
        renderInput={props => <TextField {...props} label="Ano" sx={{ minWidth: '100px' }} />}
      />

      <Button onClick={_ => onSearchRequested(indicator, process, 2024)} variant="contained">
        Pesquisar
      </Button>
    </Stack>
  );
};

export default DashboardHeader;
