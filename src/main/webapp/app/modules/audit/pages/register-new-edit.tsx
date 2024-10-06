import { Box, Breadcrumbs, CardHeader, Stack, TextField, Typography } from '@mui/material';
import { FormProvider, useForm, Controller, useWatch } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RegisterAuditNcOmList } from '../components/register-nc-om-list';
import { Rnc } from 'app/modules/rnc/models';
import { OnlyRequired } from 'app/shared/model/util';
import { Button } from 'reactstrap';
import { useMutation } from '@tanstack/react-query';
import { getAgendamentoById, getProcessos, getUsuarios, persistRegistroAuditoria } from '../audit-service';
import { AgendamentoAuditoria, RegistrarAuditoriaForm, RegistroAuditoria } from '../audit-models';
import { useEffect, useMemo } from 'react';
import { ScheduleForm } from '../components/schedule-form';
import { formField } from 'app/shared/util/form-utils';
import { defaultRule } from 'app/shared/model/constants';
// import { useMemo } from 'react';

export const RegisterNewEdit = () => {
  const { idSchedule } = useParams();
  const navigate = useNavigate();

  const localForm = useForm<Omit<RegistrarAuditoriaForm, 'base'>>({
    defaultValues: {
      ncList: [],
      omList: [],
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { control, register, getValues, getFieldState, reset, trigger } = localForm;

  const {
    control: baseControl,
    formState: baseFormState,
    getValues: baseGetValues,
    reset: baseReset,
  } = useForm<RegistroAuditoria>({
    defaultValues: { resumoAuditoria: '', numeroNC: '', numeroRelatorio: '' },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const audit = useWatch({ control: baseControl }) as RegistroAuditoria;

  useEffect(() => {
    register('ncList');
    register('omList');
  }, []);

  function onSuccess(agendamento: AgendamentoAuditoria) {
    agendamento.id && formSchedule.reset(agendamento);
    reset({ agendamento });
    agendamento?.registro?.id && baseReset(agendamento.registro);
  }

  const { mutate: getSchedule, data: schedule } = useMutation({
    mutationFn: () => getAgendamentoById(Number(idSchedule)),
    onSuccess,
  });

  const { data: processes, mutate: listProcesses } = useMutation({
    mutationFn: () => getProcessos(),
  });

  const { data: users, mutate: listUsers } = useMutation({
    mutationFn: () => getUsuarios(),
  });

  const {
    data: savedRegister,
    mutate: saveRegister,
    isPending,
  } = useMutation({
    mutationFn: () => persistRegistroAuditoria({ ...getValues(), base: baseGetValues() }),
    onSuccess: whenSaveAudit,
  });

  function whenSaveAudit(scheduleReturn: AgendamentoAuditoria) {
    reset({ agendamento: scheduleReturn });
    baseReset(scheduleReturn.registro);
  }

  const raizNaoConformidade: OnlyRequired<Omit<Rnc, 'tipoNC'>> = {
    dtNC: schedule?.dataAuditoria,
    idEmissorNC: 1, // talvez usuário atual
    idReceptorNC: 1, // TODO reponsável agendamento:
    idUsuarioAtual: 1, //
    possuiReincidencia: true,
    qtdPorques: 0,
    origemNC: schedule?.planejamento?.cronograma?.modelo?.tipo,
    processoEmissor: schedule?.idProcesso,
    processoNC: schedule?.idProcesso,
    statusAtual: 'PREENCHIMENTO',
  };

  const formSchedule = useForm<AgendamentoAuditoria>({});

  useEffect(() => {
    listProcesses();
    listUsers();
    idSchedule && getSchedule();
  }, []);

  const isSaveButtonDisabled = useMemo(() => {
    if (audit.id && !baseFormState.isDirty) return true;
    if (!audit?.id && !baseFormState.isValid) return true;

    return false;
  }, [baseFormState.isValid, baseFormState.isDirty]);

  return (
    <Stack gap="24px" className="padding-container" paddingLeft="3rem" paddingRight="2rem">
      <Stack className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Link to={'/audit'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Auditoria
          </Link>
          <Typography className="link">Registro</Typography>
        </Breadcrumbs>
        <h2 className="title">Agendamento</h2>
        <Box>
          {schedule?.id && (
            <ScheduleForm formObject={formSchedule} planning={schedule?.planejamento} processes={processes} users={users} disabled />
          )}
        </Box>
      </Stack>

      <Stack className="container-style">
        <CardHeader title="Registro" />
        <Stack flexDirection="column" gap="26px">
          <Controller
            name="resumoAuditoria"
            control={baseControl}
            rules={defaultRule}
            render={renderPayload => <TextField multiline rows="3" fullWidth label="Resumo da auditoria" {...formField(renderPayload)} />}
          />
          <Stack flexDirection="row" gap="26px">
            <Controller
              name="numeroNC"
              control={baseControl}
              rules={defaultRule}
              render={renderPayload => <TextField fullWidth label="Número da NC" {...formField(renderPayload)} />}
            />
            <Controller
              name="numeroRelatorio"
              control={baseControl}
              rules={defaultRule}
              render={renderPayload => <TextField type="number" fullWidth label="Número do Relatório" {...formField(renderPayload)} />}
            />
          </Stack>
        </Stack>
      </Stack>
      <FormProvider {...localForm}>
        {!isPending && (
          <Stack gap="24px">
            <RegisterAuditNcOmList audit={audit} previousList={[]} type="NC" raizNcParcial={raizNaoConformidade} />
            <RegisterAuditNcOmList audit={audit} previousList={[]} type="OM" raizNcParcial={raizNaoConformidade} />
          </Stack>
        )}
      </FormProvider>
      <Stack justifyContent="flex-end" gap="2.5rem" flexDirection="row" mt="20px">
        <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={() => navigate(-1)}>
          Voltar
        </Button>

        <Button
          disabled={isSaveButtonDisabled}
          type="submit"
          onClick={() => saveRegister()}
          variant="contained"
          color="primary"
          style={{ background: '#e6b200', color: '#4e4d4d' }}
        >
          Salvar
        </Button>
      </Stack>
    </Stack>
  );
};
