import { Autocomplete, Box, Breadcrumbs, Chip, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CronogramaAuditoria, PlanejamentoAuditoria } from '../audit-models';
import { MaterialSelect } from 'app/shared/components/select/material-select';
import { formField } from 'app/shared/util/form-utils';
import { isEqual, renderValueAuditor, renderValueCronograma } from '../audit-helper';
import { useMutation } from '@tanstack/react-query';
import { getPaginatedAuditor, getPaginatedCronograma, getPlanejamentoById, persistPlanejamento } from '../audit-service';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Button } from 'reactstrap';

const defaultRule = { required: 'Campo obrigatório' };

function createPlanIdentifier() {
  const now = new Date(); // Obtém a data atual

  // Formata o mês com dois dígitos (01, 02, ..., 12)
  const month = String(now.getMonth() + 1).padStart(2, '0');

  // Obtém os últimos dois dígitos do ano
  const year = String(now.getFullYear()).slice(-2);

  // Retorna a string no formato desejado
  return `plan-${month}-${year}`;
}

export const PlanningNewEdit = () => {
  const { idPlanning } = useParams();

  // TODO: Nada aqui é o nome real, isso é apenas um exemplo. Por favor facilitar a vida e usar o mesmo nome e props que o backend utilizar
  const { control, getValues, reset } = useForm<PlanejamentoAuditoria>({
    defaultValues: {
      id: null,
      identificadorPlanejamento: createPlanIdentifier(),
      objetivoAuditoria: '',
      criteriosNormas: '',
      auditores: [],
      requisitos: '',
      metodo: '',
      escopo: '',
      cronograma: '' as unknown as CronogramaAuditoria,
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const navigate = useNavigate();

  const { data: timelines, mutate: getTimelines } = useMutation({
    mutationFn: () => getPaginatedCronograma({ search: searchCronograma }),
  });

  const { data: auditors, mutate: getAuditors } = useMutation({
    mutationFn: () => getPaginatedAuditor({ search }),
  });

  const { mutate: savePlanejamento } = useMutation({
    mutationFn: () => persistPlanejamento(getValues()),
    onSuccess: whenSave,
  });

  function whenSave(planning: PlanejamentoAuditoria) {
    reset(planning);
    !idPlanning && navigate(`/audit/planning/edit/${planning.id}`, { replace: true });
  }

  const [auditorInput, setAuditorInput] = useState('');
  const [search] = useDebounce(auditorInput, 400);

  const [cronogramaInput, setCronogramaInput] = useState('');
  const [searchCronograma] = useDebounce(cronogramaInput, 400);

  const { data: planning, mutate: getPlanning } = useMutation({
    mutationFn: () => getPlanejamentoById(Number(idPlanning)),
  });

  useEffect(getAuditors, [search]);
  useEffect(getTimelines, [searchCronograma]);

  useEffect(() => {
    idPlanning && getPlanning();
  }, []);

  useEffect(() => {
    planning && reset(planning);
  }, [planning]);

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

          <Typography className="link">{idPlanning ? 'Editar' : 'Cadastrar'} Planejamento</Typography>
        </Breadcrumbs>

        <h2 className="title">{idPlanning ? 'Editar' : 'Novo'} Planejamento</h2>
        <Box display="flex" flexDirection="column" gap="24px">
          <Stack flexDirection="row" gap="4rem">
            <Controller
              name="identificadorPlanejamento"
              control={control}
              render={renderPayload => (
                <TextField label="ID Planejamento" {...formField(renderPayload)} disabled sx={{ flexBasis: '35%' }} />
              )}
            />

            <Controller
              name="cronograma"
              control={control}
              rules={defaultRule}
              render={renderPayload => (
                <MaterialSelect
                  fullWidth
                  variant="outlined"
                  label="Cronograma"
                  renderValue={renderValueCronograma}
                  {...formField(renderPayload)}
                  sx={{ minWidth: '215px' }}
                >
                  {timelines?.content?.map(item => (
                    //@ts-ignore - necessary to load object into value
                    <MenuItem key={item?.id} value={item}>
                      {renderValueCronograma(item)}
                    </MenuItem>
                  ))}
                </MaterialSelect>
              )}
            />
          </Stack>
          <Controller
            name="objetivoAuditoria"
            control={control}
            rules={defaultRule}
            render={renderPayload => <TextField multiline rows="3" fullWidth label="Objetivo da auditoria" {...formField(renderPayload)} />}
          />
          <Controller
            name="criteriosNormas"
            control={control}
            rules={defaultRule}
            render={renderPayload => (
              <TextField multiline rows="3" fullWidth label="Critérios da Auditoria / Norma de referência" {...formField(renderPayload)} />
            )}
          />
          <Controller
            name="requisitos"
            control={control}
            rules={defaultRule}
            render={renderPayload => <TextField multiline rows="3" fullWidth label="Requisitos" {...formField(renderPayload)} />}
          />

          <Controller
            name="auditores"
            control={control}
            rules={{
              validate: value => (value && value.length > 0) || 'Selecione pelo menos um auditor',
            }}
            render={({ field, fieldState }) => (
              <Autocomplete
                multiple
                filterOptions={x => x} // Evita o filtro padrão
                getOptionLabel={renderValueAuditor}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      label={option.nomeAuditor} // Customiza o conteúdo da tag (Chip)
                    />
                  ))
                }
                onInputChange={(_, newInputValue) => {
                  if (newInputValue.length >= 3) {
                    setAuditorInput(newInputValue);
                  }
                }}
                options={auditors?.content || []}
                filterSelectedOptions
                onChange={(_, val) => field.onChange(val)}
                onBlur={field.onBlur}
                value={field.value}
                isOptionEqualToValue={isEqual}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Auditores"
                    placeholder="Digite o nome do auditor"
                    error={!!fieldState?.error?.message}
                    helperText={fieldState?.error?.message}
                  />
                )}
              />
            )}
          />

          <Typography variant="h6">Conhecimentos aplicados</Typography>

          <Controller
            name="metodo"
            control={control}
            rules={defaultRule}
            render={renderPayload => <TextField multiline rows="3" fullWidth label="Método" {...formField(renderPayload)} />}
          />

          <Controller
            name="escopo"
            control={control}
            rules={defaultRule}
            render={renderPayload => <TextField multiline rows="3" fullWidth label="Escopo" {...formField(renderPayload)} />}
          />
        </Box>
      </div>
      <Stack justifyContent="flex-end" gap="2.5rem" flexDirection="row" mt="20px">
        <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={() => navigate(-1)}>
          Voltar
        </Button>

        <Button
          /* disabled={!isValid || createMutation.isPending || updateMutation.isPending} */
          type="submit"
          onClick={() => savePlanejamento()}
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
