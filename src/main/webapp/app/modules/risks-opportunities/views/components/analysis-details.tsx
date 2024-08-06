import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { onAutocompleteChanged } from '../../utils';

const AnalysisDetails = () => {
  const [probability, setProbability] = useState<string | null>(null);
  const [probabilities, setProbabilities] = useState<Array<string>>(['Baixo', 'Médio', 'Alto']);
  const [severity, setSeverity] = useState<string | null>(null);
  const [severities, setSeverities] = useState<Array<string>>(['Baixo', 'Médio', 'Alto']);

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
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setProbability)}
          options={probabilities}
          renderInput={params => <TextField {...params} label="Probabilidade" />}
          sx={{ flexGrow: 1 }}
          value={probability}
        />
        <Autocomplete
          disableClearable
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setSeverity)}
          options={severities}
          renderInput={params => <TextField {...params} label="Severidade" />}
          sx={{ flexGrow: 1 }}
          value={severity}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField label="Significância" placeholder="Significância" />
        <TextField label="Descrição da decisão" multiline placeholder="Descrição da decisão" rows={5} sx={{ flexGrow: 1 }} />
      </Stack>
    </Stack>
  );
};

export default AnalysisDetails;
