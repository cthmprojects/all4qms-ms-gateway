import { Autocomplete, Checkbox, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { onAutocompleteChanged, onCheckboxChanged, onDateChanged } from '../../utils';

type ClosingActionProps = {
  action: string;
  description: string;
  readonly?: boolean;
};

const ClosingAction = ({ action, description, readonly }: ClosingActionProps) => {
  const [implemented, setImplemented] = useState<boolean>(false);
  const [implementedAt, setImplementedAt] = useState<Date>(new Date());
  const [verifiers, setVerifiers] = useState<Array<string>>(['Usuário 1', 'Usuário 2']);
  const [verifier, setVerifier] = useState<string>('');

  useEffect(() => {
    if (verifiers.length <= 0) {
      return;
    }

    setVerifier(verifiers[0]);
  }, [verifiers]);

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
          selected={implementedAt}
          disabled={readonly}
          onChange={newDate => onDateChanged(newDate, setImplementedAt)}
          className="date-picker"
          dateFormat={'dd/MM/yyyy'}
        />

        <Autocomplete
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setVerifier)}
          options={verifiers}
          renderInput={params => <TextField {...params} label="Responsável pela verificação" />}
          sx={{ flexGrow: 1 }}
          value={verifier}
        />
      </Stack>

      <TextField label={description} maxRows={5} multiline placeholder={description} />
    </Stack>
  );
};

export default ClosingAction;
