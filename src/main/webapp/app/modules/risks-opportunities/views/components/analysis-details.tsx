import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { onAutocompleteChanged } from '../../utils';

const AnalysisDetails = () => {
  const [probability, setProbability] = useState<string>('');
  const [probabilities, setProbabilities] = useState<Array<string>>(['Alta 1', 'Alta 2', 'Alta 3']);
  const [severity, setSeverity] = useState<string>('');
  const [severities, setSeverities] = useState<Array<string>>(['Alta 1', 'Alta 2', 'Alta 3']);

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
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setProbability)}
          options={probabilities}
          renderInput={params => <TextField {...params} label="Probabilidade" />}
          sx={{ flexGrow: 1 }}
          value={probability}
        />
        <Autocomplete
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setSeverity)}
          options={severities}
          renderInput={params => <TextField {...params} label="Severidade" />}
          sx={{ flexGrow: 1 }}
          value={severity}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField label="Significância" placeholder="Significância" />
        <TextField label="Descrição da decisão" maxRows={5} multiline placeholder="Descrição da decisão" sx={{ flexGrow: 1 }} />
      </Stack>
    </Stack>
  );
};

export default AnalysisDetails;
