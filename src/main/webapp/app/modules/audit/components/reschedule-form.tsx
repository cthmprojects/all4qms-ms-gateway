import { Box, Button, CircularProgress, IconButton, TextField, Typography } from '@mui/material';
import { forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Close as CloseIcon } from '@mui/icons-material';
import { AgendamentoAuditoria } from '../audit-models';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { persistAgendamento } from '../audit-service';

type RescheduleFormProps = {
  onClose: () => void;
  agendamento: AgendamentoAuditoria;
};

export const RescheduleForm = forwardRef(({ agendamento, onClose }: RescheduleFormProps, ref) => {
  const { formState, getValues, register, reset } = useForm<AgendamentoAuditoria>({
    mode: 'all',
    reValidateMode: 'onBlur',
  });

  const navigate = useNavigate();

  const { mutate: saveScheduling, isPending: pendingRequest } = useMutation({
    mutationFn: () => persistAgendamento(getValues()),
    onSuccess: (schedule: AgendamentoAuditoria) => {
      onClose();
      agendamento.id && navigate(`/audit/planning/${schedule.planejamento.id}/schedule?idSchedule=${schedule.id}`, { replace: true });
    },
  });

  useEffect(() => {
    const { id, ...rest } = agendamento;
    reset({ ...rest, justificativaReagendamento: '' });
  }, [agendamento]);

  return (
    <Box minWidth={{ xs: '340px', md: '600px' }} padding={{ xs: '20px 16px' }}>
      <Box display="flex" justifyContent="center" position="relative">
        <Typography fontSize="24px" fontWeight="500" marginX="auto" lineHeight="46px">
          Reagendamento
        </Typography>
        <IconButton sx={{ position: 'absolute', right: 0 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box padding={{ xs: '0px', md: '0px 44px' }} marginTop="16px">
        <TextField
          label="Justificativa do reagendamento"
          multiline
          rows={3}
          fullWidth
          {...register('justificativaReagendamento', { required: 'Campo obrigatório' })}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" padding={{ xs: '0px', md: '0px 44px' }} marginTop="16px">
        <Button disabled={!formState.isValid || pendingRequest} variant="contained" onClick={() => saveScheduling()} color="primary">
          {pendingRequest ? <CircularProgress size="20px" /> : 'SALVAR'}
        </Button>
      </Box>
    </Box>
  );
});
