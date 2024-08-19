import { Box, Breadcrumbs, Button, Fab, FormControl, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Controller, UseFormReturn, useForm, useWatch } from 'react-hook-form';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { createResult, getMeta, getMetaResultAttatchment, getMetaResults } from '../../goal-result.service';
import { MaterialDatepicker } from 'app/shared/components/input/material-datepicker';
import { AttachmentButton } from 'app/shared/layout/AttachmentButton';

type ResultItemProps = {
  save: (formMethods: UseFormReturn<any>) => void;
  initialPayload?: any;
};

const queryClient = new QueryClient();

const ResultItem = ({ save, initialPayload }: ResultItemProps) => {
  const formMethods = useForm({
    defaultValues: initialPayload
      ? initialPayload
      : {
          lancadoEm: null,
          periodo: null,
          parcial: false,
          metaAtingida: false,
          avaliacao: '',
          analise: '',
          anexos: null,
        },
    mode: 'onBlur',
  });

  const metaId = initialPayload?.id;

  const { control, setValue, register, formState } = formMethods;
  const field = (field: string) => register(field as any, { required: 'Campo obrigatório' });

  useEffect(() => {
    field('periodo');
    field('lancadoEm');
  }, []);

  const periodo = useWatch({ control, name: 'periodo' });
  const lancadoEm = useWatch({ control, name: 'lancadoEm' });

  const isDisabled = !!initialPayload?.id;

  const { data: attatchment, isLoading: isLoadingAttatchment } = useQuery(
    {
      queryKey: [`result-attatchment/${metaId}`],
      queryFn: () => getMetaResultAttatchment(Number(metaId)),
      enabled: !!metaId,
      staleTime: 60000, // Dados ficam atualizados por 1 minuto,
    },
    queryClient
  );

  function download() {
    const link = document.createElement('a');
    link.href = '/services/all4qmsmsmetaind/api/metaobj/anexos/download/zip/' + initialPayload?.id;
    link.download = attatchment.nomeFisico;

    // Simula um clique no link para iniciar o download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Box display="flex" flexDirection="column" gap="24px" className="container-style">
      <Box display="flex" gap="20px" alignContent="flex-start" alignItems="start">
        {/* TODO: Trocar este datePicker pelo que está criado na branch de Riscos */}
        <FormControl className="me-2">
          <MaterialDatepicker
            selected={lancadoEm}
            onChange={value => setValue('lancadoEm', value, { shouldValidate: true })}
            dateFormat="dd/MM/yyyy"
            label="Atualizado em"
            disabled={isDisabled}
          />
        </FormControl>

        <Controller
          control={control}
          name="parcial"
          render={({ field: { value, onChange } }) => (
            <FormControlLabel
              control={<Switch disabled={isDisabled} onChange={onChange} checked={value} />}
              label="parcial"
              labelPlacement="top"
            />
          )}
        />

        <Controller
          control={control}
          name="metaAtingida"
          render={({ field: { value, onChange } }) => (
            <FormControlLabel
              control={<Switch disabled={isDisabled} onChange={onChange} checked={value} />}
              label="meta atingida"
              labelPlacement="top"
            />
          )}
        />

        {/* TODO: Trocar este datePicker pelo que está criado na branch de Riscos */}
        <FormControl className="me-2">
          <MaterialDatepicker
            selected={periodo}
            onChange={value => setValue('periodo', value, { shouldValidate: true })}
            dateFormat="MMMM/yyyy"
            label="Período"
            showMonthYearPicker
            disabled={isDisabled}
          />
        </FormControl>

        <Controller
          control={control}
          name={'anexos'}
          rules={{ required: 'Arquivo(s) obrigatórios' }}
          render={({ field: { value, onChange, ...field } }) => {
            return <AttachmentButton {...(initialPayload?.id ? { download } : {})} onChange={onChange} />;
          }}
        />
      </Box>
      <TextField disabled={isDisabled} multiline rows={3} fullWidth label="Avaliação do Resultado" {...field('avaliacao')} />
      <TextField disabled={isDisabled} multiline rows={3} fullWidth label="Análise Crítica" {...field('analise')} />
      {!isDisabled && (
        <Box display="flex" justifyContent="flex-end">
          <Button disabled={!formState.isValid} variant="contained" onClick={() => save(formMethods)} color="primary">
            SALVAR
          </Button>
        </Box>
      )}
    </Box>
  );
};

export const ResultPage = () => {
  const [isShowingNewForm, setIsShowingNewForm] = useState(false);

  const { metaId } = useParams();

  const { data: meta, isLoading: isLoadingMeta } = useQuery(
    {
      queryKey: [`meta/${metaId}`],
      queryFn: () => getMeta(Number(metaId)),
      enabled: !!metaId,
      staleTime: 60000, // Dados ficam atualizados por 1 minuto,
    },
    queryClient
  );

  const { data: results, isLoading: isLoadingResults } = useQuery(
    {
      queryKey: [`meta-results/${metaId}`],
      queryFn: () => getMetaResults(Number(metaId)),
      enabled: !!metaId, // Só faz a consulta se o ID estiver presente
      staleTime: 60000, // Dados ficam atualizados por 1 minuto,
    },
    queryClient
  );

  const createMutation = useMutation(
    {
      mutationFn: createResult,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`meta-results/${metaId}`] }); // Invalida as queries para atualizar a lista de registros
        setIsShowingNewForm(false);
        toast.success('Resultado cadastrado com sucesso');
      },
    },
    queryClient
  );

  function saveItem(formMethods: UseFormReturn<any>) {
    const { anexos, ...payload } = formMethods.getValues();
    payload.meta = { id: metaId };

    const formData = new FormData();
    formData.append('metaResultadoDTO', JSON.stringify(payload));
    for (const item of anexos as any[]) {
      formData.append('anexos', item);
    }

    createMutation.mutate(formData);
  }

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Link to={'/goals'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Metas e Objetivos
          </Link>
          <Typography className="link">Resultado</Typography>
        </Breadcrumbs>
        <h1 className="title">Resultado</h1>
        <TextField fullWidth label="Descrição Ação" multiline rows={3} value={meta?.acao || ''} disabled />
      </div>

      {!!results?.length && (
        <Box display="flex" justifyContent="end" position="relative">
          <Fab sx={{ position: 'absolute', top: '195px', marginRight: '15px' }} onClick={() => setIsShowingNewForm(!isShowingNewForm)}>
            {isShowingNewForm ? <DeleteIcon /> : <AddIcon />}
          </Fab>
        </Box>
      )}

      <Box display="flex" flexDirection="column" gap="15px" paddingRight="110px" mt="20px">
        {(isShowingNewForm || !results?.length) && !isLoadingResults && <ResultItem save={saveItem} />}
        {(results || []).map((field, index) => (
          <ResultItem save={saveItem} key={field.id} initialPayload={field} />
        ))}
      </Box>
    </div>
  );
};
