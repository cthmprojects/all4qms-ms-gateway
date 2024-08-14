import { Autocomplete, Checkbox, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { SummarizedUser } from '../../models';
import { onAutocompleteChanged, onCheckboxChanged, onDateChanged } from '../../utils';
import { useFormContext, useWatch } from 'react-hook-form';

type ActionPlanProps = {
  users: Array<SummarizedUser>;
  readonly?: boolean;
};

const ActionPlan = ({ readonly, users }: ActionPlanProps) => {
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [responsible, setResponsible] = useState<SummarizedUser | null>(null);
  const [responsibles, setResponsibles] = useState<Array<SummarizedUser>>([]);
  const [shouldVerify, setShouldVerify] = useState<boolean>(false);
  const [verifiedAt, setVerifiedAt] = useState<Date>(new Date());
  const [verifiers, setVerifiers] = useState<Array<SummarizedUser>>([]);
  const [verifier, setVerifier] = useState<SummarizedUser | null>(null);

  const { register, setValue, formState, control, trigger } = useFormContext();
  const fieldHook = (fieldName: string) => register(fieldName as any, { required: true });

  const actionDate = useWatch({ control, name: 'actionDate' });
  const actionVerificationDate = useWatch({ control, name: 'actionVerificationDate' });

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
    setValue('responsibleId', responsible?.id);
  }, [responsible]);

  useEffect(() => {
    setValue('verifyAction', shouldVerify);
  }, [shouldVerify]);

  useEffect(() => {
    setValue('actionVerifierId', verifier?.id);
  }, [verifier]);

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Plano de ação</Typography>

      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <TextField
          disabled={readonly}
          label="Descrição da ação"
          maxRows={5}
          multiline
          placeholder="Descrição da ação"
          {...fieldHook('actionDescription')}
        />

        <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
          <DatePicker
            disabled={readonly}
            selected={actionDate}
            onChange={newDate => setValue('actionDate', newDate, { shouldValidate: true })}
            className="date-picker"
            dateFormat={'dd/MM/yyyy'}
          />

          <Autocomplete
            disableClearable
            disabled={readonly}
            getOptionLabel={option => option.name}
            onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setResponsible)}
            options={responsibles}
            renderInput={params => <TextField {...params} label="Responsável" />}
            sx={{ flexGrow: 1 }}
            value={responsible}
          />

          <Stack direction="row" alignItems="center">
            <Checkbox
              disabled={readonly}
              checked={shouldVerify}
              onChange={(event, checked) => onCheckboxChanged(event, checked, setShouldVerify)}
            />

            <Typography>Verificar</Typography>
          </Stack>

          <DatePicker
            selected={actionVerificationDate}
            disabled={readonly}
            onChange={newDate => setValue('actionVerificationDate', newDate, { shouldValidate: true })}
            className="date-picker"
            dateFormat={'dd/MM/yyyy'}
          />

          <Autocomplete
            disableClearable
            disabled={readonly}
            getOptionLabel={option => option.name}
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
