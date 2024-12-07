import { Box, Breadcrumbs, CardHeader, Stack, TextField, Typography } from '@mui/material';
import { FormProvider, useForm, Controller, useWatch } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RegisterAuditNcOmList } from '../components/register-nc-om-list';
import { Rnc } from 'app/modules/rnc/models';
import { OnlyRequired } from 'app/shared/model/util';
import { Button } from 'reactstrap';
import { useMutation } from '@tanstack/react-query';
import { getAgendamentoById, getListNcsOmsAuditoria, getProcessos, getUsuarios, persistRegistroAuditoria } from '../audit-service';
import { AgendamentoAuditoria, RegistrarAuditoriaForm, RegistroAuditoria } from '../audit-models';
import { SyntheticEvent, useEffect, useMemo } from 'react';
import { ScheduleForm } from '../components/schedule-form';
import { formField } from 'app/shared/util/form-utils';
import { defaultRule } from 'app/shared/model/constants';
import { useAppSelector } from 'app/config/store';
import { IUser } from 'app/shared/model/user.model';

const TIPOS_AUDITORIA = {
  INTERNA: 'AUDITORIA_INTERNA',
  EXTERNA: 'AUDITORIA_EXTERNA',
};

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
  const { control, register, getValues, getFieldState, reset, trigger, setValue } = localForm;

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

  const {
    data: listNcOmAuditoria,
    mutate: getListNcs,
    isPending: isListPending,
  } = useMutation({
    mutationFn: () => getListNcsOmsAuditoria(schedule?.registro),
  });

  function whenSaveAudit(scheduleReturn: AgendamentoAuditoria) {
    reset({ agendamento: scheduleReturn });
    baseReset(scheduleReturn.registro);
  }

  const account = useAppSelector(state => state.authentication.accountQms) as IUser;

  const raizNaoConformidade: OnlyRequired<Omit<Rnc, 'tipoNC'>> = {
    dtNC: schedule?.dataAuditoria,
    idEmissorNC: account?.id, // talvez usuário atual
    idReceptorNC: schedule?.responsavelAuditoria, // TODO reponsável agendamento:
    idUsuarioAtual: account?.id, //
    possuiReincidencia: true,
    qtdPorques: 0,
    origemNC: TIPOS_AUDITORIA[schedule?.planejamento?.cronograma?.modelo?.tipo],
    processoEmissor: schedule?.idProcesso,
    processoNC: schedule?.idProcesso,
    statusAtual: 'PREENCHIMENTO',
  };

  const formSchedule = useForm<AgendamentoAuditoria>({
    defaultValues: {
      idProcesso: '' as unknown as number,
      responsavelAuditoria: '' as unknown as number,
    },
  });

  useEffect(() => {
    listProcesses();
    listUsers();
    idSchedule && getSchedule();
  }, []);

  useEffect(() => {
    setValue('ncList', []);
    setValue('omList', []);
    schedule?.registro?.id && getListNcs();
  }, [schedule?.id, savedRegister]);

  const isSaveButtonDisabled = useMemo(() => {
    if (!baseFormState.isValid) return true;
    if (audit.id && !baseFormState.isDirty && !localForm.formState.isDirty) return true;
    if (!audit?.id && !baseFormState.isValid) return true;

    return false;
  }, [baseFormState.isValid, baseFormState.isDirty, localForm.formState.isDirty]);

  const listNc = useMemo(() => {
    return listNcOmAuditoria?.length ? listNcOmAuditoria.filter(item => item.tipoDescricao == 'NC') : [];
  }, [schedule?.registro, listNcOmAuditoria]);

  const listOm = useMemo(() => {
    return listNcOmAuditoria?.length ? listNcOmAuditoria.filter(item => item.tipoDescricao == 'OM') : [];
  }, [schedule?.registro, listNcOmAuditoria]);

  function crumbCLick(e: SyntheticEvent) {
    e.stopPropagation();
    navigate(-1);
  }

  return (
    <Stack gap="24px" className="padding-container" paddingLeft="3rem" paddingRight="2rem">
      <Stack className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <span onClick={crumbCLick}>
            <Link to="" style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
              Auditoria
            </Link>
          </span>
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
              render={renderPayload => <TextField fullWidth label="Número do Relatório" {...formField(renderPayload)} />}
            />
          </Stack>
        </Stack>
      </Stack>
      <FormProvider {...localForm}>
        {!isListPending && (
          <Stack gap="24px">
            <RegisterAuditNcOmList audit={audit} previousList={listNc} type="NC" raizNcParcial={raizNaoConformidade} />
            <RegisterAuditNcOmList audit={audit} previousList={listOm} type="OM" raizNcParcial={raizNaoConformidade} />
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
