import { Box, Breadcrumbs, MenuItem, TextField, Typography, Stack } from '@mui/material';
import { MaterialDatepicker } from 'app/shared/components/input/material-datepicker';
import { MaterialSelect } from 'app/shared/components/select/material-select';
import { EnumStatusAuditoria } from 'app/shared/model/enumerations/enum-status-auditoria';
import { EnumPartes } from 'app/shared/model/enumerations/enum-partes';
import { formField } from 'app/shared/util/form-utils';
import { SyntheticEvent, useEffect } from 'react';
import { Controller, useForm, useFormState, useWatch } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'reactstrap';
import { queryClientAudit } from '..';
import { useMutation } from '@tanstack/react-query';
import { getCronogramaById, getPaginatedModelos, saveCronograma, updateCronograma } from '../audit-service';
import { CronogramaAuditoria, ModeloAuditoria } from '../audit-models';
import { capitalize } from 'lodash';
import { PartesAdutoria } from 'app/shared/model/constants';
import { renderValueModelo } from '../audit-helper';

const sx = { minWidth: { xs: '215px', md: '300px', lg: '360px', xl: '380px' } };

export const TimelineNewEdit = () => {
  const { idTimeline } = useParams();
  const navigate = useNavigate();

  // TODO: Nada aqui é o nome real, isso é apenas um exemplo. Por favor facilitar a vida e usar o mesmo nome e props que o backend utilizar
  const { control, register, setValue, getValues, trigger, reset } = useForm<CronogramaAuditoria>({
    defaultValues: {
      id: null,
      modelo: '' as unknown as ModeloAuditoria,
      periodoInicial: null,
      periodoFinal: null,
      parte: '' as EnumPartes,
      status: '' as EnumStatusAuditoria,
      escopo: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const {
    data: timeline,
    isPending: isLoadingtimeline,
    mutate: getTimeline,
  } = useMutation({
    mutationFn: () => getCronogramaById(Number(idTimeline)),
  });

  const { data: auditModels, mutate: getModels } = useMutation({
    mutationFn: () => getPaginatedModelos({}),
  });

  useEffect(() => {
    idTimeline && getTimeline();
    getModels();
  }, []);

  useEffect(() => {
    timeline && reset(timeline);
  }, [timeline]);

  useEffect(() => {
    register('periodoInicial', { required: 'Data inicial obrigatória' });
    register('periodoFinal', { required: 'Data final obrigatória' });
  }, []);

  const { isValid, errors } = useFormState({ control });

  const startDate = useWatch({ control, name: 'periodoInicial' });
  const endDate = useWatch({ control, name: 'periodoFinal' });

  const onChangePicker = ([startDate, endDate]) => {
    setValue('periodoInicial', startDate, { shouldValidate: true, shouldTouch: true });
    setValue('periodoFinal', endDate, { shouldValidate: true, shouldTouch: true });
    onBlurPicker();
  };
  const onBlurPicker = () => {
    trigger('periodoInicial');
    trigger('periodoFinal');
  };

  const whenSave = (timeline: CronogramaAuditoria) => {
    reset(timeline);
    queryClientAudit.invalidateQueries({ queryKey: ['timeline/list'] }); // Invalida as queries para atualizar a lista de registros
    !idTimeline && navigate(`/audit/timeline/edit/${timeline.id}`, { replace: true });
    // onClose();
    // toast.success('Recurso salvo com sucesso');
  };

  const createMutation = useMutation({
    mutationFn: saveCronograma,
    onSuccess: whenSave,
  });

  const updateMutation = useMutation({
    mutationFn: updateCronograma,
    onSuccess: whenSave,
  });

  const doUpdate = () => {
    updateMutation.mutate(getValues());
  };

  const doRegister = () => {
    createMutation.mutate(getValues());
  };

  const save = () => {
    if (idTimeline) doUpdate();
    else doRegister();
  };

  const contextTitle = `${idTimeline ? 'Editar' : 'Cadastrar'} Cronograma`;
  const someDateError = errors?.periodoInicial?.message || errors?.periodoFinal?.message;

  function crumbCLick(e: SyntheticEvent) {
    e.stopPropagation();
    navigate(-1);
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
          <Typography className="link">{contextTitle}</Typography>
        </Breadcrumbs>

        <h2 className="title">{contextTitle}</h2>
        <Box display="flex" flexDirection="column" gap="24px">
          <Box display="flex" gap="24px" justifyContent="space-between" flexWrap="wrap">
            <Controller
              name="modelo"
              control={control}
              rules={{ required: 'Campo obrigatório' }}
              render={renderPayload => (
                <MaterialSelect
                  variant="outlined"
                  label="Modelo de Auditoria"
                  renderValue={renderValueModelo}
                  {...formField(renderPayload)}
                  sx={sx}
                >
                  {auditModels?.content?.map(item => (
                    //@ts-ignore - necessary to load object into value
                    <MenuItem key={item.id} value={item}>
                      {item.nomeAuditoria} - {capitalize(item.tipo)} - {capitalize(item.frequencia)}
                    </MenuItem>
                  ))}
                </MaterialSelect>
              )}
            />

            <MaterialDatepicker
              selected={startDate}
              onChange={onChangePicker}
              dateFormat="dd/MM/yyyy"
              label="Período"
              startDate={startDate}
              endDate={endDate}
              selectsRange
              showMonthDropdown
              showYearDropdown
              required={true}
              onBlur={onBlurPicker}
              error={!!someDateError}
              helperText={someDateError as string}
              sx={sx}
            />

            <Controller
              name="parte"
              control={control}
              rules={{ required: 'Campo obrigatório' }}
              render={renderPayload => (
                <MaterialSelect variant="outlined" label="Parte" {...formField(renderPayload)} sx={sx}>
                  {PartesAdutoria.map((item, idx) => (
                    <MenuItem key={idx} value={item.value}>
                      {item.name}
                    </MenuItem>
                  ))}
                </MaterialSelect>
              )}
            />

            <Controller
              name="status"
              control={control}
              rules={{ required: 'Campo obrigatório' }}
              render={renderPayload => (
                <MaterialSelect variant="outlined" label="Status" {...formField(renderPayload)} sx={sx}>
                  {Object.values(EnumStatusAuditoria).map((value, idx) => (
                    <MenuItem key={idx} value={value}>
                      {capitalize(value)}
                    </MenuItem>
                  ))}
                </MaterialSelect>
              )}
            />
          </Box>

          <Controller
            name="escopo"
            control={control}
            rules={{ required: 'Campo obrigatório' }}
            render={renderPayload => <TextField multiline rows="3" fullWidth label="Escopo" {...formField(renderPayload)} />}
          />
        </Box>
      </div>
      <Stack justifyContent="flex-end" gap="2.5rem" flexDirection="row" mt="20px">
        <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={() => navigate(-1)}>
          Voltar
        </Button>

        <Button
          disabled={!isValid || createMutation.isPending || updateMutation.isPending}
          type="submit"
          onClick={save}
          variant="contained"
          color="primary"
          style={{ background: '#e6b200', color: '#4e4d4d' }}
        >
          Salvar
        </Button>
      </Stack>
    </div>
  );
};
