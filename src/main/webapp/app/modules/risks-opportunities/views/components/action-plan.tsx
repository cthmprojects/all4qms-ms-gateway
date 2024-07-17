import { Autocomplete, Checkbox, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { onAutocompleteChanged, onCheckboxChanged, onDateChanged } from '../../utils';

type ActionPlanProps = {
  readonly?: boolean;
};

const ActionPlan = ({ readonly }: ActionPlanProps) => {
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [responsible, setResponsible] = useState<string>('');
  const [responsibles, setResponsibles] = useState<Array<string>>(['Usuário 1', 'Usuário 2']);
  const [shouldVerify, setShouldVerify] = useState<boolean>(false);
  const [verifiedAt, setVerifiedAt] = useState<Date>(new Date());
  const [verifiers, setVerifiers] = useState<Array<string>>(['Usuário 1', 'Usuário 2']);
  const [verifier, setVerifier] = useState<string>('');

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

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Plano de ação</Typography>

      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <TextField label="Descrição da ação" maxRows={5} multiline placeholder="Descrição da ação" />

        <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
          <DatePicker
            selected={deadline}
            disabled={readonly}
            onChange={newDate => onDateChanged(newDate, setDeadline)}
            className="date-picker"
            dateFormat={'dd/MM/yyyy'}
          />

          <Autocomplete
            onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setResponsible)}
            options={responsibles}
            renderInput={params => <TextField {...params} label="Responsável" />}
            sx={{ flexGrow: 1 }}
            value={responsible}
          />

          <Stack direction="row" alignItems="center">
            <Checkbox checked={shouldVerify} onChange={(event, checked) => onCheckboxChanged(event, checked, setShouldVerify)} />

            <Typography>Verificar</Typography>
          </Stack>

          <DatePicker
            selected={verifiedAt}
            disabled={readonly}
            onChange={newDate => onDateChanged(newDate, setVerifiedAt)}
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
      </Stack>
    </Stack>
  );
};

export default ActionPlan;
