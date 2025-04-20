import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
  Card,
  Dialog,
  Fab,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AgendamentoAuditoria, PlanejamentoAuditoria } from '../audit-models';
import { useMutation } from '@tanstack/react-query';
import {
  getAgendamentoById,
  getPlanejamentoById,
  getProcessos,
  getUsuarios,
  persistAgendamento,
  persistManyAgendamentos,
  reagendar,
} from '../audit-service';
import { SyntheticEvent, useEffect, useState } from 'react';
import { ScheduleForm } from '../components/schedule-form';
import { RescheduleForm } from '../components/reschedule-form';
import { ConfirmContent } from '../components/confim-content';
import { renderValueCronograma } from '../audit-helper';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Button } from 'reactstrap';

const defaultAgendamento = {
  id: null,
  planejamento: '' as unknown as PlanejamentoAuditoria,
  auditores: [],
  dataAuditoria: '' as unknown as Date,
  responsavelAuditoria: '' as unknown as number,
  horaInicial: '' as unknown as Date,
  horaFinal: '' as unknown as Date,
  idProcesso: '' as unknown as number,
} as AgendamentoAuditoria;

export const ScheduleNewEdit = () => {
  const { idPlanning } = useParams();
  const [localSchedule, setLocalSchedule] = useState<AgendamentoAuditoria>({} as AgendamentoAuditoria);
  const [open, setOpen] = useState(false);
  const [openValidate, setOpenValidate] = useState(false);

  let [searchParams] = useSearchParams();

  const idSchedule = searchParams.get('idSchedule');

  const formMethods = useForm<AgendamentoAuditoria>({
    defaultValues: defaultAgendamento,
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const formForArray = useForm<{ array: AgendamentoAuditoria[] }>({
    defaultValues: {
      array: [],
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: formForArray.control,
    name: 'array',
    keyName: 'key',
    rules: { required: true },
  });
  const { getValues, setValue, formState, reset } = formMethods;

  const navigate = useNavigate();

  const { mutate: saveScheduling, isPending } = useMutation<
    AgendamentoAuditoria | AgendamentoAuditoria[],
    Error,
    Partial<AgendamentoAuditoria>
  >({
    mutationFn: (newPayload: Partial<AgendamentoAuditoria>) =>
      newPayload.isFinalizado ? reagendar({ ...getValues(), ...newPayload }) : persistManyAgendamentos(formForArray.getValues().array),
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

  const { data: users, mutate: listUsers } = useMutation({
    mutationFn: () => getUsuarios(),
  });

  function crumbCLick(e: SyntheticEvent) {
    e.stopPropagation();
    navigate(-1);
  }

  function whenSave(agendamento: AgendamentoAuditoria) {
    navigate(-1);
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
    listUsers();
  }, []);

  useEffect(() => {
    idSchedule && getCurentSchedule();
  }, [idSchedule]);

  useEffect(() => {
    planning?.id && setValue('planejamento', planning);
    planning?.id && !fields.length && addInArray();
  }, [planning]);

  const arr1 = useWatch({ control: formForArray.control, name: 'array.0' });

  function addInArray() {
    const obj = fields.length
      ? { ...arr1, ...{ idProcesso: '' as unknown as number } }
      : { ...defaultAgendamento, ...{ planejamento: planning } };
    append(obj);
  }

  const hasMoreItens = fields.length > 1;

  function renderForm() {
    if (!planning?.auditores.length) {
      return null;
    }

    if (idSchedule) return <ScheduleForm processes={processes} formObject={formMethods} planning={planning} users={users} />;

    return (
      <Box display="flex" flexDirection="column" justifyContent="center">
        {fields.map((item, idx) => (
          <Card
            sx={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              padding: '12px',
              marginBottom: '32px',
            }}
          >
            <Box width="95%" paddingBottom="24px">
              <ScheduleForm
                key={item.key}
                prefix={`array.${idx}`}
                processes={processes}
                formObject={formForArray}
                planning={planning}
                users={users}
              />
            </Box>
            {hasMoreItens ? (
              <span>
                <IconButton onClick={() => remove(idx)}>
                  <DeleteIcon />
                </IconButton>
              </span>
            ) : null}
          </Card>
        ))}
        <Box display="flex" justifyContent="end" position="relative">
          <Fab onClick={addInArray}>
            <AddIcon />
          </Fab>
        </Box>
      </Box>
    );
  }

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

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}
          >
            <Typography variant="h6">Planejamento {planning?.identificadorPlanejamento?.toUpperCase()}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            Escopo: {planning?.escopo}
            <br />
            {renderValueCronograma(planning?.cronograma)}
          </AccordionDetails>
        </Accordion>
        <Box display="flex" flexDirection="column" gap="24px">
          <Box>
            <br />
          </Box>
          {renderForm()}
        </Box>
      </div>
      <Stack justifyContent="flex-end" gap="2.5rem" flexDirection="row" mt="20px">
        {currentSchedule?.id && (
          <Button
            disabled={!formState.isDirty || !formState.isValid}
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
            disabled={formState.isDirty || !formState.isValid}
            type="submit"
            onClick={() => setOpenValidate(true)}
            variant="contained"
            color="primary"
            style={{ background: '#e6b200', color: '#4e4d4d' }}
          >
            Validar
          </Button>
        ) : (
          <Button
            disabled={!formForArray.formState.isValid}
            type="submit"
            onClick={() => saveScheduling({})}
            variant="contained"
            color="primary"
            style={{ background: '#e6b200', color: '#4e4d4d' }}
          >
            Salvar
          </Button>
        )}
      </Stack>

      <Dialog open={open} onClose={onClose}>
        <RescheduleForm onClose={onClose} agendamento={localSchedule} previous={currentSchedule} />
      </Dialog>

      <Dialog open={openValidate} onClose={() => setOpenValidate(false)}>
        <ConfirmContent isPending={isPending} onClose={() => setOpenValidate(false)} save={saveScheduling} />
      </Dialog>
    </div>
  );
};
