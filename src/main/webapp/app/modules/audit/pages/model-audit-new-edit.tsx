import { Breadcrumbs, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { EnumTemporal } from 'app/modules/goals-objectives/models/enums';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'reactstrap';
import { TiposAuditoria } from 'app/shared/model/constants';
import { ModeloAuditoria } from '../audit-models';
import { Controller, useForm } from 'react-hook-form';
import { MaterialSelect } from 'app/shared/components/select/material-select';
import { formField } from 'app/shared/util/form-utils';
import { useMutation } from '@tanstack/react-query';
import { getModelById, getPaginatedModelos, persistModelo } from '../audit-service';
import { SyntheticEvent, useEffect } from 'react';

export const ModelAuditNewEdit = () => {
  const navigate = useNavigate();
  const { idModel } = useParams();

  const { control, reset, getValues } = useForm<ModeloAuditoria>({
    defaultValues: {
      tipo: '',
      nomeAuditoria: '',
      frequencia: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const {
    data: model,
    isPending: isLoadingModel,
    mutate: getModel,
  } = useMutation({
    mutationFn: () => getModelById(Number(idModel)),
    onSuccess: (modelo: ModeloAuditoria) => {
      reset(modelo);
    },
  });

  const {
    data: savedModel,
    isPending: isLoadingSavedModel,
    mutate: saveModel,
  } = useMutation({
    mutationFn: () => persistModelo(getValues()),
    onSuccess: (modelo: ModeloAuditoria) => {
      reset(modelo);
      navigate(`/audit/model/edit/${modelo.id}`, { replace: true });
    },
  });

  useEffect(() => idModel && getModel(), []);

  const nameValidate = async (value: string) => {
    const result = await getPaginatedModelos({ search: value });

    const filtered = result.content.filter(model => model.nomeAuditoria.toLowerCase() == value.toLowerCase());
    return filtered.length ? 'Auditoria já cadastrada' : true;
  };

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
          <Typography className="link">{idModel ? 'Editar' : 'Cadastrar'} Modelo</Typography>
        </Breadcrumbs>

        <h2 className="title">{idModel ? 'Editar' : 'Cadastrar'} Modelo de Auditoria</h2>

        <Stack flexDirection="row" gap="24px">
          <Controller
            name="nomeAuditoria"
            control={control}
            rules={{ required: 'Campo obrigatório', validate: nameValidate }}
            render={renderPayload => (
              <TextField
                className="me-2"
                label="Nome da Auditoria"
                style={{ minWidth: '20vw' }}
                placeholder="Auditoria"
                {...formField(renderPayload)}
              />
            )}
          />

          <Controller
            name="frequencia"
            control={control}
            rules={{ required: 'Campo obrigatório' }}
            render={renderPayload => (
              <MaterialSelect variant="outlined" label="Frequência" fullWidth {...formField(renderPayload)}>
                {Object.values(EnumTemporal).map((value, idx) => (
                  <MenuItem key={idx} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </MaterialSelect>
            )}
          />

          <Controller
            name="tipo"
            control={control}
            rules={{ required: 'Campo obrigatório' }}
            render={renderPayload => (
              <MaterialSelect variant="outlined" label="Tipo" fullWidth {...formField(renderPayload)}>
                {TiposAuditoria.map(item => (
                  <MenuItem key={item.name} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </MaterialSelect>
            )}
          />
        </Stack>
        <hr></hr>
        <div style={{ display: 'flex', justifyContent: 'end' }} className="ms-3 me-2 mt-3">
          <Button
            variant="contained"
            style={{ background: '#d9d9d9', color: '#4e4d4d' }}
            className="me-2"
            onClick={() => {
              navigate(-1);
            }}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ width: '115px', background: '#e6b200', color: '#4e4d4d' }}
            onClick={() => saveModel()}
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};
