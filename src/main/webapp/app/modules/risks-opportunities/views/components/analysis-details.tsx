import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Configuration } from '../../models';

type AnalysisDetailsProps = {
  description: string;
  firstConfigurations: Array<Configuration>;
  points: number;
  readonly?: boolean;
  secondConfigurations: Array<Configuration>;
};

const AnalysisDetails = ({ description, firstConfigurations, points, readonly, secondConfigurations }: AnalysisDetailsProps) => {
  const [probabilities, setProbabilities] = useState<Array<Configuration>>([]);
  const [severities, setSeverities] = useState<Array<Configuration>>([]);

  const { register, setValue, formState, control, trigger } = useFormContext();

  const probabilityForm = useWatch({ control, name: 'probability' });
  const severityForm = useWatch({ control, name: 'severity' });

  useEffect(() => {
    if (!firstConfigurations) {
      return;
    }

    setProbabilities(firstConfigurations);
  }, [firstConfigurations]);

  useEffect(() => {
    if (!secondConfigurations) {
      return;
    }

    setSeverities(secondConfigurations);
  }, [secondConfigurations]);

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Detalhamento</Typography>

      <Stack direction="row" spacing={2}>
        <Controller
          control={control}
          name="probability"
          render={({ field: { onChange, ...rest } }) => (
            <Autocomplete
              disableClearable
              disabled={readonly}
              getOptionLabel={option => `${option.grauRO} - ${option.descricaoRO}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={probabilities}
              renderInput={params => <TextField {...params} label="Probabilidade" />}
              sx={{ flexGrow: 1 }}
              onChange={(_, val) => onChange(val)}
              {...rest}
            />
          )}
        />

        <Controller
          control={control}
          name="severity"
          render={({ field: { onChange, ...rest } }) => (
            <Autocomplete
              disableClearable
              disabled={readonly}
              getOptionLabel={option => `${option.grauRO} - ${option.descricaoRO}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={severities}
              renderInput={params => <TextField {...params} label="Severidade" />}
              sx={{ flexGrow: 1 }}
              onChange={(_, val) => onChange(val)}
              {...rest}
            />
          )}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField disabled label="Significância" placeholder="Significância" value={points.toString()} />
        <TextField
          disabled
          label="Descrição da decisão"
          multiline
          placeholder="Descrição da decisão"
          rows={5}
          sx={{ flexGrow: 1 }}
          value={description}
        />
      </Stack>
    </Stack>
  );
};

export default AnalysisDetails;
