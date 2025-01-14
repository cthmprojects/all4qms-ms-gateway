import { Checkbox, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { onCheckboxChanged } from '../../utils';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

type CauseInvestigationProps = {
  readonly?: boolean;
  pathPrefix?: string;
};

const CauseInvestigation = ({ readonly, pathPrefix }: CauseInvestigationProps) => {
  const [useIshikawa, setUseIshikawa] = useState<boolean>(false);
  const [useReasons, setUseReasons] = useState<boolean>(true);

  const { register, setValue, formState, control, trigger } = useFormContext();

  const onUseIshikawaChanged = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    if (checked && useReasons) {
      setUseReasons(false);
    }

    setValue('useIshikawa', checked);
    onCheckboxChanged(event, checked, setUseIshikawa);
  };

  function withPrefix(prop: string) {
    return pathPrefix + prop;
  }

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
          <Checkbox disabled={readonly} checked={useIshikawa} onChange={onUseIshikawaChanged} />
          <Typography>Ishikawa</Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Checkbox disabled={readonly} checked={useReasons} onChange={onUseReasonsChanged} />
          <Typography>Resposta dos 5 porquês</Typography>
        </Stack>
      </Stack>

      {useIshikawa && (
        <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
          <Controller
            control={control}
            name={withPrefix('ishikawa.descCausaEfeito')}
            render={({ field }) => <TextField disabled={readonly} label="Causa" maxRows={5} multiline placeholder="Causa" {...field} />}
          />

          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
              <Controller
                control={control}
                name={withPrefix('ishikawa.meioAmbiente')}
                render={({ field }) => <TextField disabled={readonly} label="Meio ambiente" placeholder="Meio ambiente" {...field} />}
              />
              <Controller
                control={control}
                name={withPrefix('ishikawa.maoDeObra')}
                render={({ field }) => <TextField disabled={readonly} label="Mão de obra" placeholder="Mão de obra" {...field} />}
              />
              <Controller
                control={control}
                name={withPrefix('ishikawa.metodo')}
                render={({ field }) => <TextField disabled={readonly} label="Método" placeholder="Método" {...field} />}
              />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
              <Controller
                control={control}
                name={withPrefix('ishikawa.maquina')}
                render={({ field }) => <TextField disabled={readonly} label="Máquina" placeholder="Máquina" {...field} />}
              />
              <Controller
                control={control}
                name={withPrefix('ishikawa.medicao')}
                render={({ field }) => <TextField disabled={readonly} label="Medição" placeholder="Medição" {...field} />}
              />
              <Controller
                control={control}
                name={withPrefix('ishikawa.materiaPrima')}
                render={({ field }) => <TextField disabled={readonly} label="Matéria prima" placeholder="Matéria prima" {...field} />}
              />
            </Stack>
          </Stack>
        </Stack>
      )}

      {useReasons && (
        <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
          <Controller
            control={control}
            name={withPrefix('porques.descCausa')}
            render={({ field }) => <TextField disabled={readonly} label="Causa" maxRows={5} multiline placeholder="Causa" {...field} />}
          />

          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <Controller
              control={control}
              name={withPrefix('porques.pq1')}
              render={({ field }) => <TextField disabled={readonly} label="Porquê?" placeholder="Porquê?" {...field} />}
            />

            <Controller
              control={control}
              name={withPrefix('porques.pq2')}
              render={({ field }) => <TextField disabled={readonly} label="Porquê?" placeholder="Porquê?" {...field} />}
            />
            <Controller
              control={control}
              name={withPrefix('porques.pq3')}
              render={({ field }) => <TextField disabled={readonly} label="Porquê?" placeholder="Porquê?" {...field} />}
            />
            <Controller
              control={control}
              name={withPrefix('porques.pq4')}
              render={({ field }) => <TextField disabled={readonly} label="Porquê?" placeholder="Porquê?" {...field} />}
            />
            <Controller
              control={control}
              name={withPrefix('porques.pq5')}
              render={({ field }) => <TextField disabled={readonly} label="Porquê?" placeholder="Porquê?" {...field} />}
            />
          </Stack>

          <Controller
            control={control}
            name={withPrefix('porques.descProblema')}
            render={({ field }) => <TextField disabled={readonly} label="Efeito" maxRows={5} multiline placeholder="Efeito" {...field} />}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default CauseInvestigation;
