import { Autocomplete, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { SummarizedProcess } from '../../models';
import { onAutocompleteChanged } from '../../utils';

type IndicatorDetailsProps = {
  processes: Array<SummarizedProcess>;
  trends: Array<string>;
  units: Array<string>;
};

const IndicatorDetails = ({ processes, trends, units }: IndicatorDetailsProps) => {
  const [process, setProcess] = useState<SummarizedProcess | null>(null);
  const [trend, setTrend] = useState<string | null>(null);
  const [unit, setUnit] = useState<string | null>(null);

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <TextField label="Código" placeholder="Código" />

        <TextField label="Nome" placeholder="Nome" sx={{ flexGrow: 1 }} />

        <Autocomplete
          disableClearable
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setUnit)}
          options={units}
          renderInput={props => <TextField {...props} label="Unidade" />}
          sx={{ flexGrow: 1 }}
          value={unit}
        />

        <Autocomplete
          disableClearable
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setTrend)}
          options={trends}
          renderInput={props => <TextField {...props} label="Tendência" />}
          sx={{ flexGrow: 1 }}
          value={trend}
        />

        <Autocomplete
          disableClearable
          getOptionLabel={option => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setProcess)}
          options={processes}
          renderInput={props => <TextField {...props} label="Processo" />}
          sx={{ flexGrow: 1 }}
          value={process}
        />
      </Stack>

      <TextField label="Descrição do indicador" multiline placeholder="Descrição do indicador" rows={5} />
    </Stack>
  );
};

export default IndicatorDetails;
