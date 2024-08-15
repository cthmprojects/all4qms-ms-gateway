import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Configuration } from '../../models';
import { onAutocompleteChanged } from '../../utils';

type AnalysisDetailsProps = {
  description: string;
  firstConfigurations: Array<Configuration>;
  points: number;
  readonly?: boolean;
  secondConfigurations: Array<Configuration>;
};

const AnalysisDetails = ({ description, firstConfigurations, points, readonly, secondConfigurations }: AnalysisDetailsProps) => {
  const [probability, setProbability] = useState<Configuration | null>(null);
  const [probabilities, setProbabilities] = useState<Array<Configuration>>([]);
  const [severity, setSeverity] = useState<Configuration | null>(null);
  const [severities, setSeverities] = useState<Array<Configuration>>([]);

  const { register, setValue, formState, control, trigger } = useFormContext();

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

  useEffect(() => {
    setValue('description', description ?? '', { shouldValidate: true });
  }, [description]);

  useEffect(() => {
    setValue('meaning', points?.toString() ?? '0', { shouldValidate: true });
  }, [points]);

  useEffect(() => {
    setValue('probability', probability, { shouldValidate: true });
  }, [probability]);

  useEffect(() => {
    setValue('severity', severity, { shouldValidate: true });
  }, [severity]);

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Detalhamento</Typography>

      <Stack direction="row" spacing={2}>
        <Autocomplete
          disableClearable
          disabled={readonly}
          getOptionLabel={option => `${option.grauRO} - ${option.descricaoRO}`}
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setProbability)}
          options={probabilities}
          renderInput={params => <TextField {...params} label="Probabilidade" />}
          sx={{ flexGrow: 1 }}
          value={probability}
        />
        <Autocomplete
          disableClearable
          disabled={readonly}
          getOptionLabel={option => `${option.grauRO} - ${option.descricaoRO}`}
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setSeverity)}
          options={severities}
          renderInput={params => <TextField {...params} label="Severidade" />}
          sx={{ flexGrow: 1 }}
          value={severity}
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
