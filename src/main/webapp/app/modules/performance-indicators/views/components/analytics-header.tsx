import { BarChartOutlined, SearchOutlined } from '@mui/icons-material';
import { Autocomplete, Button, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Indicator, SummarizedProcess } from '../../models';
import { getYearRange, onAutocompleteChanged, onTextChanged } from '../../utils';

type AnalyticsHeaderProps = {
  processes: Array<SummarizedProcess>;
  onAddIndicatorRequested: () => void;
  onDashboardRequested: () => void;
  onSearchRequested: (indicator: Indicator, process: SummarizedProcess, year: number, query: string) => void;
};

const AnalyticsHeader = ({ onAddIndicatorRequested, onDashboardRequested, onSearchRequested, processes }: AnalyticsHeaderProps) => {
  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const [process, setProcess] = useState<SummarizedProcess | null>(null);
  const [query, setQuery] = useState<string>('');
  const [year, setYear] = useState<number | null>(null);
  const [years, setYears] = useState<Array<number>>([]);

  useEffect(() => {
    setYears(getYearRange());
  }, []);

  useEffect(() => {
    if (!processes || processes.length <= 0) {
      return;
    }

    setProcess(processes[0]);
  }, [processes]);

  useEffect(() => {
    if (!years || years.length <= 0) {
      return;
    }

    const now: Date = new Date();
    const currentYear: number = now.getFullYear();

    setYear(currentYear);
  }, [years]);

  return (
    <Stack direction="row" spacing={2}>
      <Button
        onClick={_ => onAddIndicatorRequested()}
        sx={{
          background: '#e6b200',
          color: '#4e4d4d',
          '& .MuiButton-startIcon': {
            marginTop: 0,
          },
          '& .MuiTouchRipple-root': {
            marginTop: 0,
          },
        }}
        variant="contained"
      >
        Novo Registro
      </Button>

      <Button
        onClick={_ => onDashboardRequested()}
        startIcon={<BarChartOutlined />}
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
        Indicadores
      </Button>

      <Autocomplete
        disableClearable
        getOptionLabel={option => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setProcess)}
        options={processes}
        renderInput={props => <TextField {...props} label="Processo" />}
        sx={{ display: 'flex', flexGrow: 1 }}
        value={process}
      />

      <Autocomplete
        disableClearable
        getOptionLabel={option => option.toString()}
        onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setYear)}
        options={years}
        renderInput={props => <TextField {...props} label="Ano" sx={{ minWidth: '100px' }} />}
        value={year}
      />

      <TextField label="Pesquisar" onChange={event => onTextChanged(event, setQuery)} placeholder="Pesquisar" value={query} />

      <Button
        onClick={_ => onSearchRequested(indicator, process, year, query)}
        sx={{
          '& .MuiButton-startIcon': {
            marginTop: 0,
          },
          '& .MuiTouchRipple-root': {
            marginTop: 0,
          },
        }}
        variant="contained"
      >
        <SearchOutlined />
      </Button>
    </Stack>
  );
};

export default AnalyticsHeader;
