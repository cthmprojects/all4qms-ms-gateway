import { Checkbox, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { onCheckboxChanged } from '../../utils';

const CauseInvestigation = () => {
  const [useIshikawa, setUseIshikawa] = useState<boolean>(false);
  const [useReasons, setUseReasons] = useState<boolean>(false);

  const onUseIshikawaChanged = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    if (checked && useReasons) {
      setUseReasons(false);
    }

    onCheckboxChanged(event, checked, setUseIshikawa);
  };

  const onUseReasonsChanged = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    if (checked && useIshikawa) {
      setUseIshikawa(false);
    }

    onCheckboxChanged(event, checked, setUseReasons);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Investigação de causas</Typography>

      <Stack direction="row" spacing={2}>
        <Stack direction="row" alignItems="center">
          <Checkbox checked={useIshikawa} onChange={onUseIshikawaChanged} />
          <Typography>Ishikawa</Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Checkbox checked={useReasons} onChange={onUseReasonsChanged} />
          <Typography>Resposta dos 5 porquês</Typography>
        </Stack>
      </Stack>

      {useIshikawa && (
        <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
          <TextField label="Causa" maxRows={5} multiline placeholder="Causa" />

          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
              <TextField label="Meio ambiente" placeholder="Meio ambiente" />

              <TextField label="Mão de obra" placeholder="Mão de obra" />

              <TextField label="Método" placeholder="Método" />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
              <TextField label="Máquina" placeholder="Máquina" />

              <TextField label="Medição" placeholder="Medição" />

              <TextField label="Matéria prima" placeholder="Matéria prima" />
            </Stack>
          </Stack>
        </Stack>
      )}

      {useReasons && (
        <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
          <TextField label="Causa" maxRows={5} multiline placeholder="Causa" />

          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <TextField label="Porquê?" placeholder="Porquê?" />

            <TextField label="Porquê?" placeholder="Porquê?" />

            <TextField label="Porquê?" placeholder="Porquê?" />

            <TextField label="Porquê?" placeholder="Porquê?" />

            <TextField label="Porquê?" placeholder="Porquê?" />
          </Stack>

          <TextField label="Efeito" maxRows={5} multiline placeholder="Efeito" />
        </Stack>
      )}
    </Stack>
  );
};

export default CauseInvestigation;
