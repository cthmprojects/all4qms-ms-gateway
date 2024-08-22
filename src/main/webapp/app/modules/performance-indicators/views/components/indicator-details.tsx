import { Autocomplete, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { SummarizedProcess } from '../../models';
import { onAutocompleteChanged, onTextChanged } from '../../utils';

type IndicatorDetailsProps = {
  processes: Array<SummarizedProcess>;
  trends: Array<string>;
  units: Array<string>;
  onChanged: (code: string, description: string, name: string, process: SummarizedProcess, trend: string, unit: string) => void;
};

const IndicatorDetails = ({ processes, trends, units, onChanged }: IndicatorDetailsProps) => {
  const [code, setCode] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [process, setProcess] = useState<SummarizedProcess | null>(null);
  const [trend, setTrend] = useState<string | null>(null);
  const [unit, setUnit] = useState<string | null>(null);

  useEffect(() => {
    onChanged(code, description, name, process, trend, unit);
  }, [code, description, name, process, trend, unit]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <TextField label="Código" onChange={event => onTextChanged(event, setCode)} placeholder="Código" value={code} />

        <TextField label="Nome" onChange={event => onTextChanged(event, setName)} placeholder="Nome" sx={{ flexGrow: 1 }} value={name} />

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

      <TextField
        label="Descrição do indicador"
        multiline
        onChange={event => onTextChanged(event, setDescription)}
        placeholder="Descrição do indicador"
        rows={5}
        value={description}
      />
    </Stack>
  );
};

export default IndicatorDetails;
