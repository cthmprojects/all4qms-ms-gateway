import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const ControlAction = () => {
  const [description, setDescription] = useState<string>('');
  const [probability, setProbability] = useState<string | null>(null);
  const [probabilities, setProbabilities] = useState<Array<string>>(['Baixo', 'Médio', 'Alto']);
  const [severity, setSeverity] = useState<string | null>(null);
  const [severities, setSeverities] = useState<Array<string>>(['Baixo', 'Médio', 'Alto']);

  const { register, setValue, formState, control, trigger } = useFormContext();
  const fieldHook = (fieldName: string) => register(fieldName as any, { required: true });

  const probabilityForm = useWatch({ control, name: 'probability' });
  const severityForm = useWatch({ control, name: 'severity' });

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
      <Typography variant="h6">Controle / Ação</Typography>

      <Stack direction="row" spacing={2}>
        <TextField
          label="Descrição do controle"
          multiline
          placeholder="Descrição do controle"
          rows={5}
          sx={{ flexGrow: 1 }}
          {...fieldHook('description')}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <Autocomplete
          disableClearable
          onChange={(event, value, reason, details) => setValue('probability', value, { shouldValidate: true })}
          options={probabilities}
          renderInput={params => <TextField {...params} label="Controlar a probabilidade" />}
          sx={{ flexGrow: 1 }}
          value={probability}
        />
        <Autocomplete
          disableClearable
          onChange={(event, value, reason, details) => setValue('severity', value, { shouldValidate: true })}
          options={severities}
          renderInput={params => <TextField {...params} label="Controlar a severidade" />}
          sx={{ flexGrow: 1 }}
          value={severity}
        />
      </Stack>
    </Stack>
  );
};

export default ControlAction;
