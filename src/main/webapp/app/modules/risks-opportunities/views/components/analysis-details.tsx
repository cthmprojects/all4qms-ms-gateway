import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { onAutocompleteChanged } from '../../utils';

const AnalysisDetails = () => {
  const [probability, setProbability] = useState<string | null>(null);
  const [probabilities, setProbabilities] = useState<Array<string>>(['Baixo', 'Médio', 'Alto']);
  const [severity, setSeverity] = useState<string | null>(null);
  const [severities, setSeverities] = useState<Array<string>>(['Baixo', 'Médio', 'Alto']);

  const { register, setValue, formState, control, trigger } = useFormContext();
  const fieldHook = (fieldName: string) => register(fieldName as any, { required: true });

  useEffect(() => {
    if (probabilities.length <= 0) {
      return;
    }

    setProbability(probabilities[0]);
  }, [probabilities]);

  useEffect(() => {
    if (severities.length <= 0) {
      return;
    }

    setSeverity(severities[0]);
  }, [severities]);

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Detalhamento</Typography>

      <Stack direction="row" spacing={2}>
        <Autocomplete
          disableClearable
          onChange={(event, value, reason, details) => setValue('probability', value, { shouldValidate: true })}
          options={probabilities}
          renderInput={params => <TextField {...params} label="Probabilidade" />}
          sx={{ flexGrow: 1 }}
          value={probability}
        />
        <Autocomplete
          disableClearable
          onChange={(event, value, reason, details) => setValue('severity', value, { shouldValidate: true })}
          options={severities}
          renderInput={params => <TextField {...params} label="Severidade" />}
          sx={{ flexGrow: 1 }}
          value={severity}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField label="Significância" placeholder="Significância" {...fieldHook('meaning')} />
        <TextField
          label="Descrição da decisão"
          multiline
          placeholder="Descrição da decisão"
          rows={5}
          sx={{ flexGrow: 1 }}
          {...fieldHook('description')}
        />
      </Stack>
    </Stack>
  );
};

export default AnalysisDetails;
