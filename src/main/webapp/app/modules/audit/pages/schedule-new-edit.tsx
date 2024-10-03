import { Box, Breadcrumbs, Dialog, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AgendamentoAuditoria, PlanejamentoAuditoria } from '../audit-models';
import { useMutation } from '@tanstack/react-query';
import { getAgendamentoById, getPlanejamentoById, getProcessos, saveAgendamento } from '../audit-service';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { ScheduleForm } from '../components/schedule-form';
import { RescheduleForm } from '../components/reschedule-form';

export const ScheduleNewEdit = () => {
  const { idPlanning } = useParams();
  const [localSchedule, setLocalSchedule] = useState<AgendamentoAuditoria>({} as AgendamentoAuditoria);
  const [open, setOpen] = useState(false);
  let [searchParams] = useSearchParams();

  const idSchedule = searchParams.get('idSchedule');

  const formMethods = useForm<AgendamentoAuditoria>({
    defaultValues: {
      id: null,
      planejamento: '' as unknown as PlanejamentoAuditoria,
      auditores: [],
      dataAuditoria: '' as unknown as Date,
      responsavelAuditoria: 0,
      horaInicial: '' as unknown as Date,
      horaFinal: '' as unknown as Date,
      idProcesso: '' as unknown as number,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { getValues, setValue, formState, reset } = formMethods;

  const navigate = useNavigate();

  const { mutate: saveScheduling } = useMutation({
    mutationFn: () => saveAgendamento(getValues()),
    onSuccess: whenSave,
  });

  const { mutate: getCurentSchedule, data: currentSchedule } = useMutation({
    mutationFn: () => getAgendamentoById(Number(idSchedule)),
    onSuccess: (agendamento: AgendamentoAuditoria) => {
      reset(agendamento);
    },
  });

  const { data: planning, mutate: getPlanning } = useMutation({
    mutationFn: () => getPlanejamentoById(Number(idPlanning)),
  });

  const { data: processes, mutate: listProcesses } = useMutation({
    mutationFn: () => getProcessos(),
  });

  function crumbCLick(e: SyntheticEvent) {
    e.stopPropagation();
    navigate(-1);
  }

  function whenSave(agendamento: AgendamentoAuditoria) {
    agendamento.id && navigate(`/audit/planning/${idPlanning}/schedule?idSchedule=${agendamento.id}`, { replace: true });
  }

  function onClose() {
    setOpen(false);
    setTimeout(() => {
      reset();
      setLocalSchedule({} as AgendamentoAuditoria);
    }, 200);
  }

  function reschedule() {
    setLocalSchedule(getValues());
    setOpen(true);
  }

  useEffect(() => {
    idPlanning && getPlanning();
    listProcesses();
  }, []);

  useEffect(() => {
    idSchedule && getCurentSchedule();
  }, [idSchedule]);

  useEffect(() => {
    planning?.id && setValue('planejamento', planning);
  }, [planning]);

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <span onClick={crumbCLick}>
            <Link to="" style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
              Auditoria
            </Link>
          </span>
          <Typography className="link">{idSchedule ? 'Validar' : 'Cadastrar'} Agendamento</Typography>
        </Breadcrumbs>

        <h2 className="title">{idSchedule ? 'Validar' : 'Novo'} Agendamento</h2>
        <Box display="flex" flexDirection="column" gap="24px">
          {planning?.auditores.length && <ScheduleForm processes={processes} formObject={formMethods} planning={planning} />}
        </Box>
      </div>
      <Stack justifyContent="flex-end" gap="2.5rem" flexDirection="row" mt="20px">
        {currentSchedule?.id && (
          <Button
            disabled={!formState.isDirty}
            type="submit"
            onClick={reschedule}
            variant="contained"
            color="primary"
            style={{ background: '#2196F3', color: '#4e4d4d' }}
          >
            Reagendar
          </Button>
        )}
        <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={() => navigate(-1)}>
          Voltar
        </Button>

        {currentSchedule?.id ? (
          <Button
            disabled={formState.isDirty}
            type="submit"
            onClick={() => console.log('Tentei Validar')}
            variant="contained"
            color="primary"
            style={{ background: '#e6b200', color: '#4e4d4d' }}
          >
            Validar
          </Button>
        ) : (
          <Button
            disabled={!formState.isValid}
            type="submit"
            onClick={() => saveScheduling()}
            variant="contained"
            color="primary"
            style={{ background: '#e6b200', color: '#4e4d4d' }}
          >
            Salvar
          </Button>
        )}
      </Stack>

      <Dialog open={open} onClose={onClose}>
        <RescheduleForm onClose={onClose} agendamento={localSchedule} />
      </Dialog>
    </div>
  );
};
