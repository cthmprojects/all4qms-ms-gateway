import { Checkbox, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { onCheckboxChanged } from '../../utils';
import { useFormContext, useWatch } from 'react-hook-form';

const CauseInvestigation = () => {
  const [useIshikawa, setUseIshikawa] = useState<boolean>(false);
  const [useReasons, setUseReasons] = useState<boolean>(true);

  const { register, setValue, formState, control, trigger } = useFormContext();
  const fieldHook = (fieldName: string) => register(fieldName as any, { required: true });

  const onUseIshikawaChanged = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    if (checked && useReasons) {
      setUseReasons(false);
    }

    setValue('useIshikawa', checked);
    onCheckboxChanged(event, checked, setUseIshikawa);
  };

  const onUseReasonsChanged = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    if (checked && useIshikawa) {
      setUseIshikawa(false);
    }

    setValue('useReasons', checked);
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
          <TextField label="Causa" maxRows={5} multiline placeholder="Causa" {...fieldHook('ishikawaCause')} />

          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
              <TextField label="Meio ambiente" placeholder="Meio ambiente" {...fieldHook('environment')} />

              <TextField label="Mão de obra" placeholder="Mão de obra" {...fieldHook('workforce')} />

              <TextField label="Método" placeholder="Método" {...fieldHook('method')} />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
              <TextField label="Máquina" placeholder="Máquina" {...fieldHook('machine')} />

              <TextField label="Medição" placeholder="Medição" {...fieldHook('measurement')} />

              <TextField label="Matéria prima" placeholder="Matéria prima" {...fieldHook('rawMaterial')} />
            </Stack>
          </Stack>
        </Stack>
      )}

      {useReasons && (
        <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
          <TextField label="Causa" maxRows={5} multiline placeholder="Causa" {...fieldHook('reasonCause')} />

          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <TextField label="Porquê?" placeholder="Porquê?" {...fieldHook('reason1')} />

            <TextField label="Porquê?" placeholder="Porquê?" {...fieldHook('reason2')} />

            <TextField label="Porquê?" placeholder="Porquê?" {...fieldHook('reason3')} />

            <TextField label="Porquê?" placeholder="Porquê?" {...fieldHook('reason4')} />

            <TextField label="Porquê?" placeholder="Porquê?" {...fieldHook('reason5')} />
          </Stack>

          <TextField label="Efeito" maxRows={5} multiline placeholder="Efeito" {...fieldHook('reasonEffect')} />
        </Stack>
      )}
    </Stack>
  );
};

export default CauseInvestigation;
