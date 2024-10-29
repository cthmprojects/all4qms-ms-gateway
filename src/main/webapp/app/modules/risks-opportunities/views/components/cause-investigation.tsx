import { Autocomplete, Checkbox, Chip, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { onCheckboxChanged } from '../../utils';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

type CauseInvestigationProps = {
  readonly?: boolean;
};

const CauseInvestigation = ({ readonly }: CauseInvestigationProps) => {
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
            name="ishikawaCause"
            render={({ field }) => (
              <TextField disabled={readonly} label="Causa" maxRows={5} multiline placeholder="Causa" rows={5} {...field} />
            )}
          />

          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
              <Controller
                control={control}
                name="environment"
                render={({ field: { onChange, ...rest } }) => (
                  <Autocomplete
                    className="m-2"
                    disableClearable
                    disabled={readonly}
                    freeSolo
                    options={['']}
                    multiple
                    onChange={(_, values) => onChange(values)}
                    renderInput={params => <TextField {...params} label="Meio Ambiente" />}
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
                    }
                    sx={{ flexGrow: 1, maxWidth: 350 }}
                    {...rest}
                  />
                )}
              />

              <Controller
                control={control}
                name="workforce"
                render={({ field: { onChange, ...rest } }) => (
                  <Autocomplete
                    className="m-2"
                    disableClearable
                    disabled={readonly}
                    freeSolo
                    options={['']}
                    multiple
                    onChange={(_, values) => onChange(values)}
                    renderInput={params => <TextField {...params} label="Mão de obra" />}
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
                    }
                    sx={{ flexGrow: 1, maxWidth: 350 }}
                    {...rest}
                  />
                )}
              />

              <Controller
                control={control}
                name="method"
                render={({ field: { onChange, ...rest } }) => (
                  <Autocomplete
                    className="m-2"
                    disableClearable
                    disabled={readonly}
                    freeSolo
                    options={['']}
                    multiple
                    onChange={(_, values) => onChange(values)}
                    renderInput={params => <TextField {...params} label="Método" />}
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
                    }
                    sx={{ flexGrow: 1, maxWidth: 350 }}
                    {...rest}
                  />
                )}
              />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
              <Controller
                control={control}
                name="machine"
                render={({ field: { onChange, ...rest } }) => (
                  <Autocomplete
                    className="m-2"
                    disableClearable
                    disabled={readonly}
                    freeSolo
                    options={['']}
                    multiple
                    onChange={(_, values) => onChange(values)}
                    renderInput={params => <TextField {...params} label="Máquina" />}
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
                    }
                    sx={{ flexGrow: 1, maxWidth: 350 }}
                    {...rest}
                  />
                )}
              />

              <Controller
                control={control}
                name="measurement"
                render={({ field: { onChange, ...rest } }) => (
                  <Autocomplete
                    className="m-2"
                    disableClearable
                    disabled={readonly}
                    freeSolo
                    options={['']}
                    multiple
                    onChange={(_, values) => onChange(values)}
                    renderInput={params => <TextField {...params} label="Medição" />}
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
                    }
                    sx={{ flexGrow: 1, maxWidth: 350 }}
                    {...rest}
                  />
                )}
              />

              <Controller
                control={control}
                name="rawMaterial"
                render={({ field: { onChange, ...rest } }) => (
                  <Autocomplete
                    className="m-2"
                    disableClearable
                    disabled={readonly}
                    freeSolo
                    options={['']}
                    multiple
                    onChange={(_, values) => onChange(values)}
                    renderInput={params => <TextField {...params} label="Matéria Prima" />}
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
                    }
                    sx={{ flexGrow: 1, maxWidth: 350 }}
                    {...rest}
                  />
                )}
              />
            </Stack>
          </Stack>
        </Stack>
      )}

      {useReasons && (
        <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
          <Controller
            control={control}
            name="reasonCause"
            render={({ field }) => <TextField disabled={readonly} label="Causa" maxRows={5} multiline placeholder="Causa" {...field} />}
          />

          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <Controller
              control={control}
              name="reason1"
              render={({ field }) => <TextField disabled={readonly} label="Porquê?" placeholder="Porquê?" {...field} />}
            />

            <Controller
              control={control}
              name="reason2"
              render={({ field }) => <TextField disabled={readonly} label="Porquê?" placeholder="Porquê?" {...field} />}
            />
            <Controller
              control={control}
              name="reason3"
              render={({ field }) => <TextField disabled={readonly} label="Porquê?" placeholder="Porquê?" {...field} />}
            />
            <Controller
              control={control}
              name="reason4"
              render={({ field }) => <TextField disabled={readonly} label="Porquê?" placeholder="Porquê?" {...field} />}
            />
            <Controller
              control={control}
              name="reason5"
              render={({ field }) => <TextField disabled={readonly} label="Porquê?" placeholder="Porquê?" {...field} />}
            />
          </Stack>

          <Controller
            control={control}
            name="reasonEffect"
            render={({ field }) => <TextField disabled={readonly} label="Efeito" maxRows={5} multiline placeholder="Efeito" {...field} />}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default CauseInvestigation;
