import { Checkbox, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { onCheckboxChanged } from '../../utils';
import { SummarizedUser } from '../../models';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { MaterialDatepicker } from 'app/shared/components/input/material-datepicker';

type ClosingActionProps = {
  action: string;
  description: string;
  isImplementation?: boolean;
  users: Array<SummarizedUser>;
  readonly?: boolean;
  pathPrefix?: string;
};

const ClosingAction = ({ action, description, isImplementation, readonly, users, pathPrefix }: ClosingActionProps) => {
  const [implemented, setImplemented] = useState<boolean>(false);
  const [implementedAt, setImplementedAt] = useState<Date>(new Date());
  const [verifiers, setVerifiers] = useState<Array<SummarizedUser>>([]);
  const [verifier, setVerifier] = useState<SummarizedUser | null>(null);

  const { register, setValue, formState, control, trigger } = useFormContext();

  const dateValue = useWatch({ control, name: withPrefix(isImplementation ? 'dataImplementacao' : 'dataEficacia') });

  useEffect(() => {
    setVerifiers(users);
  }, [users]);

  useEffect(() => {
    setValue(withPrefix(isImplementation ? 'possuiImplementacao' : 'possuiEficacia'), !!dateValue);
  }, [dateValue]);

  function withPrefix(prop: string) {
    return pathPrefix + prop;
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Stack spacing={2}>
          <Typography>{action}</Typography>

          <Stack direction="row" spacing={2}>
            <Stack direction="row" alignItems="center">
              <Checkbox
                disabled={readonly}
                checked={!!dateValue}
                onChange={(event, checked) => onCheckboxChanged(event, checked, setImplemented)}
              />

              <Typography>Sim</Typography>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Checkbox
                disabled={readonly}
                checked={!dateValue}
                onChange={(event, checked) => onCheckboxChanged(event, !checked, setImplemented)}
              />

              <Typography>Não</Typography>
            </Stack>
          </Stack>
        </Stack>

        <MaterialDatepicker
          label="Data"
          selected={dateValue}
          disabled={readonly}
          onChange={newDate => setValue(withPrefix(isImplementation ? 'dataImplementacao' : 'dataEficacia'), newDate)}
          className="date-picker"
          dateFormat={'dd/MM/yyyy'}
        />

        <Controller
          control={control}
          name={withPrefix(isImplementation ? 'responsavelImplementacao' : 'responsavelEficacia')}
          render={({ field }) => (
            <FormControl className="ms-3">
              <InputLabel>Responsável</InputLabel>
              <Select label="Responsável" name="Responsável" disabled={readonly} {...field} sx={{ minWidth: '260px' }}>
                <MenuItem>-</MenuItem>
                {verifiers.map(user => (
                  <MenuItem value={user.id} key={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Stack>

      <Controller
        control={control}
        name={withPrefix(isImplementation ? 'descImplementacao' : 'descEficacia')}
        render={({ field }) => (
          <TextField disabled={readonly} label={description} maxRows={5} multiline placeholder={description} {...field} />
        )}
      />
    </Stack>
  );
};

export default ClosingAction;
