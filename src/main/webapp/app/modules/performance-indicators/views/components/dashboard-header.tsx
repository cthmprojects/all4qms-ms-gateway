import { SearchOutlined, TableChart } from '@mui/icons-material';
import { Autocomplete, Button, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Indicator, SummarizedProcess } from '../../models';
import { getYearRange, onAutocompleteChanged, onTextChanged } from '../../utils';

type DashboardHeaderProps = {
  indicators: Array<Indicator>;
  processes: Array<SummarizedProcess>;
  onAnalyticsRequested: () => void;
  onSearchRequested: (indicator: Indicator, process: SummarizedProcess, year: number, query: string) => void;
};

const DashboardHeader = ({ indicators, onAnalyticsRequested, onSearchRequested, processes }: DashboardHeaderProps) => {
  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const [process, setProcess] = useState<SummarizedProcess | null>(null);
  const [query, setQuery] = useState<string>('');
  const [year, setYear] = useState<number | null>(null);
  const [years, setYears] = useState<Array<number>>([]);

  useEffect(() => {
    setYears(getYearRange());
  }, []);

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

      {/* <Autocomplete
        disableClearable
        getOptionLabel={option => `${option.code} - ${option.name}`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setIndicator)}
        options={indicators}
        renderInput={props => <TextField {...props} label="Indicador" />}
        sx={{ display: 'flex', flexGrow: 1 }}
        value={indicator}
      />

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
      </Button> */}
    </Stack>
  );
};

export default DashboardHeader;
