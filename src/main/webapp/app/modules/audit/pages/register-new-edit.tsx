import { Box, Breadcrumbs, CardHeader, Stack, TextField, Typography } from '@mui/material';
import { FormProvider, useForm, useFormState, Path } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RegisterAuditNcOmList } from '../components/register-nc-om-list';
import { Rnc } from 'app/modules/rnc/models';
import { OnlyRequired } from 'app/shared/model/util';
import { Button } from 'reactstrap';
// import { useMemo } from 'react';

export const RegisterNewEdit = () => {
  const { idTimeline } = useParams();
  const navigate = useNavigate();

  // TODO: Nada aqui é o nome real, isso é apenas um exemplo. Por favor facilitar a vida e usar o mesmo nome e props que o backend utilizar
  const localForm = useForm({
    defaultValues: {
      base: { resumoAuditoria: '', numeroNC: '', numeroRelatorio: '' },
      ncList: [],
      omList: [],
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const { control, register, getValues, getFieldState } = localForm;

  const { isValid, errors } = useFormState({ control });

  const formr = (name: Path<typeof control._defaultValues>) => {
    const { error } = getFieldState(name);
    return {
      ...register(name, { required: 'Campo obrigatório' }),
      required: true,
      error: !!error?.message,
      helperText: error?.message,
    };
  };

  const raizNaoConformidade: OnlyRequired<Omit<Rnc, 'tipoNC'>> = {
    dtNC: new Date(),
    idEmissorNC: 1,
    idReceptorNC: 1,
    idUsuarioAtual: 1,
    possuiReincidencia: true,
    qtdPorques: 0,
    origemNC: 'AUDITORIA_INTERNA',
    processoEmissor: 1,
    processoNC: 1,
    statusAtual: 'PREENCHIMENTO',
  };

  // TODO: Verificar se realmente é obrigatório NC e OM
  /* const { invalid: isBaseInvalid } = getFieldState('base');
  const { invalid: isNcListInvalid } = getFieldState('ncList');
  const { invalid: isOmListInvalid } = getFieldState('omList');

  const isDisabled = useMemo(() => {
    const {ncList, omList} = getValues()

  }, [isBaseInvalid, isNcListInvalid, isOmListInvalid]) */

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
      </Stack>

      <Stack className="container-style">
        <CardHeader title="Registro" />
        <Stack flexDirection="column" gap="26px">
          <TextField multiline rows="3" fullWidth label="Resumo da auditoria" {...formr('base.resumoAuditoria')} />
          <Stack flexDirection="row" gap="26px">
            <TextField fullWidth label="Número da NC" {...formr('base.numeroNC')} sx={{ flexBasis: '33%' }} />
            <TextField type="number" fullWidth label="Número do Relatório" {...formr('base.numeroRelatorio')} sx={{ flexBasis: '33%' }} />
          </Stack>
        </Stack>
      </Stack>
      <FormProvider {...localForm}>
        <Stack gap="24px">
          <RegisterAuditNcOmList audit={{}} previousList={[]} type="NC" raizNcParcial={raizNaoConformidade} />
          <RegisterAuditNcOmList audit={{}} previousList={[]} type="OM" raizNcParcial={raizNaoConformidade} />
        </Stack>
      </FormProvider>
      <Stack justifyContent="flex-end" gap="2.5rem" flexDirection="row" mt="20px">
        <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={() => navigate('/audit')}>
          Voltar
        </Button>

        <Button
          disabled={!isValid}
          type="submit"
          onClick={null}
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
