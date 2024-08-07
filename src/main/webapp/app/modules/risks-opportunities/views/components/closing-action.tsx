import { Autocomplete, Checkbox, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { onAutocompleteChanged, onCheckboxChanged, onDateChanged } from '../../utils';
import { SummarizedUser } from '../../models';
import { useFormContext, useWatch } from 'react-hook-form';

type ClosingActionProps = {
  action: string;
  description: string;
  isImplementation?: boolean;
  users: Array<SummarizedUser>;
  readonly?: boolean;
};

const ClosingAction = ({ action, description, isImplementation, readonly, users }: ClosingActionProps) => {
  const [implemented, setImplemented] = useState<boolean>(false);
  const [implementedAt, setImplementedAt] = useState<Date>(new Date());
  const [verifiers, setVerifiers] = useState<Array<SummarizedUser>>([]);
  const [verifier, setVerifier] = useState<SummarizedUser | null>(null);

  const { register, setValue, formState, control, trigger } = useFormContext();
  const fieldHook = (fieldName: string) => register(fieldName as any, { required: true });

  const implementationDate = useWatch({ control, name: 'implementationDate' });
  const efficacyVerificationDate = useWatch({ control, name: 'efficacyVerificationDate' });

  useEffect(() => {
    setVerifiers(users);
  }, [users]);

  useEffect(() => {
    if (verifiers.length <= 0) {
      return;
    }

    setVerifier(verifiers[0]);
  }, [verifiers]);

  useEffect(() => {
    setValue(isImplementation ? 'implemented' : 'efficacyVerified', implemented);
  }, [implemented]);

  useEffect(() => {
    setValue(isImplementation ? 'implementationResponsibleId' : 'efficacyResponsibleId', verifier?.id);
  }, [verifier]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Stack spacing={2}>
          <Typography>{action}</Typography>

          <Stack direction="row" spacing={2}>
            <Stack direction="row" alignItems="center">
              <Checkbox checked={implemented} onChange={(event, checked) => onCheckboxChanged(event, checked, setImplemented)} />

              <Typography>Sim</Typography>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Checkbox checked={!implemented} onChange={(event, checked) => onCheckboxChanged(event, !checked, setImplemented)} />

              <Typography>Não</Typography>
            </Stack>
          </Stack>
        </Stack>

        <DatePicker
          selected={isImplementation ? implementationDate : efficacyVerificationDate}
          disabled={readonly}
          onChange={newDate => setValue(isImplementation ? 'implementationDate' : 'efficacyVerificationDate', newDate)}
          className="date-picker"
          dateFormat={'dd/MM/yyyy'}
        />

        <Autocomplete
          disableClearable
          getOptionLabel={option => option.name}
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setVerifier)}
          options={verifiers}
          renderInput={params => <TextField {...params} label="Responsável pela verificação" />}
          sx={{ flexGrow: 1 }}
          value={verifier}
        />
      </Stack>

      <TextField
        label={description}
        maxRows={5}
        multiline
        placeholder={description}
        {...fieldHook(isImplementation ? 'implementationDescription' : 'efficacyDescription')}
      />
    </Stack>
  );
};

export default ClosingAction;
