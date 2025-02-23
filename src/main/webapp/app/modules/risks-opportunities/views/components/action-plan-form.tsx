import { Autocomplete, Checkbox, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { SummarizedUser } from '../../models';
import { onAutocompleteChanged, onCheckboxChanged, onDateChanged } from '../../utils';
import { Controller, useFormContext, useWatch, useFieldArray } from 'react-hook-form';
import { MaterialDatepicker } from 'app/shared/components/input/material-datepicker';

type ActionPlanProps = {
  users: Array<SummarizedUser>;
  readonly?: boolean;
  prefix: string;
};

const ActionPlanForm = ({ readonly, users, prefix }: ActionPlanProps) => {
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [responsible, setResponsible] = useState<SummarizedUser | null>(null);
  const [responsibles, setResponsibles] = useState<Array<SummarizedUser>>([]);
  const [shouldVerify, setShouldVerify] = useState<boolean>(false);
  const [verifiedAt, setVerifiedAt] = useState<Date>(new Date());
  const [verifiers, setVerifiers] = useState<Array<SummarizedUser>>([]);
  const [verifier, setVerifier] = useState<SummarizedUser | null>(null);

  const { register, setValue, formState, control, trigger } = useFormContext();

  const actionDate = useWatch({ control, name: withPrefix('prazoAcao') });
  const actionVerificationDate = useWatch({ control, name: withPrefix('dataVerificao') });

  const verifierForm = useWatch({ control, name: 'idResponsavelVerificaoAcao' });
  const responsibleForm = useWatch({ control, name: 'idResponsavelAcao' });

  function withPrefix(field: string) {
    return `${prefix}.${field}`;
  }

  useEffect(() => {
    setValue(withPrefix('dataConclusaoAcao'), actionVerificationDate);
  }, [actionVerificationDate]);

  useEffect(() => {
    setResponsibles(users);
    setVerifiers(users);
  }, [users]);

  useEffect(() => {
    if (responsibles.length <= 0) {
      return;
    }

    setResponsible(responsibles[0]);
  }, [responsibles]);

  useEffect(() => {
    if (verifiers.length <= 0) {
      return;
    }

    setVerifier(verifiers[0]);
  }, [verifiers]);

  useEffect(() => {
    setValue('verifyAction', shouldVerify);
  }, [shouldVerify]);

  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
      <Controller
        control={control}
        name={withPrefix('descricaoAcao')}
        render={({ field }) => (
          <TextField disabled={readonly} label="Descrição da ação" maxRows={5} multiline placeholder="Descrição da ação" {...field} />
        )}
      />

      <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
        <MaterialDatepicker
          label="Prazo"
          disabled={readonly}
          selected={actionDate}
          onChange={newDate => setValue(withPrefix('prazoAcao'), newDate, { shouldValidate: true })}
          className="date-picker"
          dateFormat={'dd/MM/yyyy'}
        />

        <Controller
          control={control}
          name={withPrefix('idResponsavelAcao')}
          render={({ field }) => (
            <FormControl className="ms-3">
              <InputLabel>Responsável</InputLabel>
              <Select label="Responsável" name="funcao" disabled={readonly} {...field} sx={{ minWidth: '260px' }}>
                <MenuItem>-</MenuItem>
                {users.map(user => (
                  <MenuItem value={user.id} key={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Stack direction="row" alignItems="center">
          <Checkbox
            disabled={readonly}
            checked={!!actionVerificationDate}
            onChange={(event, checked) => onCheckboxChanged(event, checked, setShouldVerify)}
          />

          <Typography>Verificar</Typography>
        </Stack>

        <MaterialDatepicker
          label="Data de verificação"
          selected={actionVerificationDate}
          disabled={readonly}
          onChange={newDate => setValue(withPrefix('dataVerificao'), newDate, { shouldValidate: true })}
          className="date-picker"
          dateFormat={'dd/MM/yyyy'}
        />

        <Controller
          control={control}
          name={withPrefix('idResponsavelVerificaoAcao')}
          render={({ field }) => (
            <FormControl className="ms-3">
              <InputLabel>Responsável pela verificação</InputLabel>
              <Select label="Responsável pela verificação" name="funcao" disabled={readonly} {...field} sx={{ minWidth: '260px' }}>
                <MenuItem>-</MenuItem>
                {users.map(user => (
                  <MenuItem value={user.id} key={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Stack>
    </Stack>
  );
};

export default ActionPlanForm;
