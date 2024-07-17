import React, { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, Stack, TextField, Typography } from '@mui/material';
import { onAutocompleteChanged, onTextChanged } from '../../utils';

const ControlAction = () => {
  const [description, setDescription] = useState<string>('');
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
      <Typography variant="h6">Controle / Ação</Typography>

      <Stack direction="row" spacing={2}>
        <TextField
          label="Descrição do controle"
          maxRows={5}
          multiline
          onChange={event => onTextChanged(event, setDescription)}
          placeholder="Descrição do controle"
          sx={{ flexGrow: 1 }}
          value={description}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <Autocomplete
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setProbability)}
          options={probabilities}
          renderInput={params => <TextField {...params} label="Controlar a probabilidade" />}
          sx={{ flexGrow: 1 }}
          value={probability}
        />
        <Autocomplete
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setSeverity)}
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
