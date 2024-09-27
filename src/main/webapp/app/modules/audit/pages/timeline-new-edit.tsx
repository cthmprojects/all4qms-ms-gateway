import { Box, Breadcrumbs, MenuItem, TextField, Typography, Stack } from '@mui/material';
import { MaterialDatepicker } from 'app/shared/components/input/material-datepicker';
import { MaterialSelect } from 'app/shared/components/select/material-select';
import { EnumStatusAuditoria } from 'app/shared/model/enumerations/enum-status-auditoria';
import { EnumPartes } from 'app/shared/model/enumerations/enun-partes';
import { formField } from 'app/shared/util/form-utils';
import { useEffect } from 'react';
import { Controller, useForm, useFormState, useWatch } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'reactstrap';

const tste = {
  id: null,
  modeloAuditoria: '',
  dataInicio: new Date('2024-09-09T04:00:00.000Z'),
  dataFim: new Date('2024-09-20T04:00:00.000Z'),
  parte: '2ª Parte',
  status: 'Realizado',
  escopo: 'TESTE',
};

export const TimelineNewEdit = () => {
  const { idTimeline } = useParams();
  const navigate = useNavigate();

  // TODO: Nada aqui é o nome real, isso é apenas um exemplo. Por favor facilitar a vida e usar o mesmo nome e props que o backend utilizar
  const { control, register, setValue, getValues, trigger } = useForm({
    defaultValues: idTimeline
      ? tste
      : {
          id: null,
          modeloAuditoria: '',
          dataInicio: null,
          dataFim: null,
          parte: '',
          status: '',
          escopo: '',
        },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const formr = (name: keyof typeof control._defaultValues) => ({
    ...register(name, { required: 'Campo obrigatório' }),
    required: true,
    error: !!errors?.[name]?.message,
    helperText: errors?.[name]?.message as string,
  });

  useEffect(() => {
    register('dataInicio', { required: 'Data inicial obrigatória' });
    register('dataFim', { required: 'Data final obrigatória' });
  }, []);

  const { isValid, errors } = useFormState({ control });

  const startDate = useWatch({ control, name: 'dataInicio' });
  const endDate = useWatch({ control, name: 'dataFim' });

  const onChangePicker = ([startDate, endDate]) => {
    setValue('dataInicio', startDate, { shouldValidate: true, shouldTouch: true });
    setValue('dataFim', endDate, { shouldValidate: true, shouldTouch: true });
    onBlurPicker();
  };
  const onBlurPicker = () => {
    trigger('dataFim');
    trigger('dataInicio');
  };

  const doUpdate = () => {};

  const doRegister = () => {};

  const save = () => {
    const payload = getValues();
    console.log('#### payload', payload);
    if (idTimeline) doUpdate();
    else doRegister();
  };

  const contextTitle = `${idTimeline ? 'Editar' : 'Cadastrar'} Cronograma`;
  const someDateError = errors?.dataInicio?.message || errors?.dataFim?.message;

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Link to={'/audit'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Auditoria
          </Link>
          <Typography className="link">{contextTitle}</Typography>
        </Breadcrumbs>

        <h2 className="title">{contextTitle}</h2>
        <Box display="flex" flexDirection="column" gap="24px">
          <Box display="flex" gap="24px" justifyContent="space-between">
            <Controller
              name="modeloAuditoria"
              control={control}
              rules={{ required: 'Campo obrigatório' }}
              render={renderPayload => (
                <MaterialSelect
                  variant="outlined"
                  label="Modelo de Auditoria"
                  fullWidth
                  {...formField(renderPayload)}
                  sx={{ minWidth: '215px' }}
                >
                  <MenuItem key={0} value={1}>
                    Auditoria Externa XPTO
                  </MenuItem>
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
              sx={{ minWidth: '215px' }}
            />

            <Controller
              name="parte"
              control={control}
              rules={{ required: 'Campo obrigatório' }}
              render={renderPayload => (
                <MaterialSelect variant="outlined" label="Parte" fullWidth {...formField(renderPayload)} sx={{ minWidth: '215px' }}>
                  {Object.values(EnumPartes).map((value, idx) => (
                    <MenuItem key={idx} value={value}>
                      {value}
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
                <MaterialSelect variant="outlined" label="Status" fullWidth {...formField(renderPayload)} sx={{ minWidth: '215px' }}>
                  {Object.values(EnumStatusAuditoria).map((value, idx) => (
                    <MenuItem key={idx} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </MaterialSelect>
              )}
            />
          </Box>
          <TextField multiline rows="3" fullWidth label="Escopo" {...formr('escopo')} />
        </Box>
      </div>
      <Stack justifyContent="flex-end" gap="20px" flexDirection="row" mt="20px">
        <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={() => navigate('/audit')}>
          Voltar
        </Button>

        <Button
          disabled={!isValid}
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
