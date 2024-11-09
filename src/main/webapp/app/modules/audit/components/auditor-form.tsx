import { Box, Button, CircularProgress, IconButton, Stack, TextField, Typography } from '@mui/material';
import { forwardRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Close as CloseIcon } from '@mui/icons-material';
import { Auditor } from '../audit-models';
import { formField } from 'app/shared/util/form-utils';

type AuditorFormProps = {
  onClose: () => void;
  initialPayload?: Partial<Auditor>;
  onSave: (payload: Partial<Auditor>) => void;
  pendingRequest?: boolean;
};

export const AuditorForm = forwardRef(({ initialPayload, onClose, onSave, pendingRequest }: AuditorFormProps, ref) => {
  const { formState, getValues, register, control } = useForm<Auditor>({
    defaultValues: initialPayload || {
      nomeAuditor: '',
      emailAuditor: '',
    },
    delayError: 500,
    mode: 'all',
    reValidateMode: 'onBlur',
  });

  return (
    <Box minWidth={{ xs: '340px', md: '600px' }} padding={{ xs: '20px 16px' }}>
      <Box display="flex" justifyContent="center" position="relative">
        <Typography fontSize="24px" fontWeight="500" marginX="auto" lineHeight="46px">
          {initialPayload && 'Editar'} Auditor
        </Typography>
        <IconButton sx={{ position: 'absolute', right: 0 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Stack padding={{ xs: '0px', md: '0px 44px' }} gap="24px" marginTop="16px">
        <Controller
          name="nomeAuditor"
          control={control}
          rules={{ required: 'Campo obrigatório' }}
          render={renderPayload => <TextField fullWidth label="Nome do auditor" {...formField(renderPayload)} />}
        />
        <Controller
          name="emailAuditor"
          control={control}
          rules={{
            required: 'Campo obrigatório',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Formato de e-mail inválido',
            },
          }}
          render={renderPayload => <TextField fullWidth label="E-mail do auditor" {...formField(renderPayload)} />}
        />
      </Stack>
      <Box display="flex" justifyContent="flex-end" padding={{ xs: '0px', md: '0px 44px' }} marginTop="16px">
        <Button disabled={!formState.isValid || pendingRequest} variant="contained" onClick={() => onSave(getValues())} color="primary">
          {pendingRequest ? <CircularProgress size="20px" /> : 'SALVAR'}
        </Button>
      </Box>
    </Box>
  );
});
