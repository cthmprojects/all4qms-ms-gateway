import { Box, Button, CircularProgress, IconButton, TextField, Typography } from '@mui/material';
import { forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { MetaRecurso } from '../../models/goals';
import { Close as CloseIcon } from '@mui/icons-material';

type ResourceFormProps = {
  onClose: () => void;
  initialPayload?: Partial<MetaRecurso>;
  onSave: (payload: Partial<MetaRecurso>) => void;
  pendingRequest?: boolean;
};

export const ResourceForm = forwardRef(({ initialPayload, onClose, onSave, pendingRequest }: ResourceFormProps, ref) => {
  const { formState, getValues, register } = useForm<MetaRecurso>({
    defaultValues: initialPayload || {
      recursoNome: '',
    },
    mode: 'all',
    reValidateMode: 'onBlur',
  });

  return (
    <Box minWidth={{ xs: '340px', md: '600px' }} padding={{ xs: '20px 16px' }}>
      <Box display="flex" justifyContent="center" position="relative">
        <Typography fontSize="24px" fontWeight="500" marginX="auto" lineHeight="46px">
          {initialPayload && 'Editar'} Recurso
        </Typography>
        <IconButton sx={{ position: 'absolute', right: 0 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box padding={{ xs: '0px', md: '0px 44px' }} marginTop="16px">
        <TextField variant="filled" fullWidth {...register('recursoNome', { required: 'É necessário fornecer um nome' })} />
      </Box>
      <Box display="flex" justifyContent="flex-end" padding={{ xs: '0px', md: '0px 44px' }} marginTop="16px">
        <Button disabled={!formState.isValid || pendingRequest} variant="contained" onClick={() => onSave(getValues())} color="primary">
          {pendingRequest ? <CircularProgress size="20px" /> : 'SALVAR'}
        </Button>
      </Box>
    </Box>
  );
});
