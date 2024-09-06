import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Configuration } from '../../models';

type ControlActionProps = {
  allProbabilities: Array<Configuration>;
  allSeverities: Array<Configuration>;
  readonly?: boolean;
};

const ControlAction = ({ allProbabilities, allSeverities, readonly }: ControlActionProps) => {
  const [probabilities, setProbabilities] = useState<Array<Configuration>>([]);
  const [severities, setSeverities] = useState<Array<Configuration>>([]);

  const { register, setValue, formState, control, trigger } = useFormContext();
  const fieldHook = (fieldName: string) => register(fieldName as any, { required: true });

  const probabilityForm = useWatch({ control, name: 'probability' });
  const severityForm = useWatch({ control, name: 'severity' });

  useEffect(() => {
    if (!allProbabilities || allProbabilities.length <= 0) {
      return;
    }

    setProbabilities(allProbabilities);
  }, [allProbabilities]);

  useEffect(() => {
    if (!allSeverities || allSeverities.length <= 0) {
      return;
    }

    setSeverities(allSeverities);
  }, [allSeverities]);

  useEffect(() => {
    if (!probabilities || probabilities.length > 0) {
      return;
    }

    setValue('probability', probabilities[0], { shouldValidate: true });
  }, [probabilities]);

  useEffect(() => {
    if (!severities || severities.length > 0) {
      return;
    }

    setValue('severity', severities[0], { shouldValidate: true });
  }, [severities]);

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Controle / Ação</Typography>

      <Stack direction="row" spacing={2}>
        <TextField
          disabled={readonly}
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
          disabled={readonly}
          getOptionLabel={option => `${option.grauRO} - ${option.descricaoRO}`}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, value, reason, details) => setValue('probability', value, { shouldValidate: true })}
          options={probabilities}
          renderInput={params => <TextField {...params} label="Controlar a probabilidade" />}
          sx={{ flexGrow: 1 }}
          value={probabilityForm ?? null}
        />
        <Autocomplete
          disableClearable
          disabled={readonly}
          getOptionLabel={option => `${option.grauRO} - ${option.descricaoRO}`}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, value, reason, details) => setValue('severity', value, { shouldValidate: true })}
          options={severities}
          renderInput={params => <TextField {...params} label="Controlar a severidade" />}
          sx={{ flexGrow: 1 }}
          value={severityForm ?? null}
        />
      </Stack>
    </Stack>
  );
};

export default ControlAction;
