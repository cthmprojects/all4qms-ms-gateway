import { Box, Breadcrumbs, Button, Fab, FormControl, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { UseFormReturn, useForm, useWatch } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

type ResultItemProps = {
  save: (formMethods: UseFormReturn<any>) => void;
};

const createResult = async (payload: any) => {
  const { data } = await axios.post<any[]>('/urlalguma', payload);
  return data;
};

const ResultItem = ({ save }: ResultItemProps) => {
  const formMethods = useForm({
    defaultValues: {
      lancadoEm: null,
      periodo: null,
      parcial: false,
      metaAtingida: false,
      avaliacao: '',
      analise: '',
    },
  });

  const { control, setValue, register, formState } = formMethods;
  const field = (field: string) => register(field as any, { required: 'Campo obrigatório' });

  useEffect(() => {
    field('periodo');
    field('lancadoEm');
  }, []);

  const periodo = useWatch({ control, name: 'periodo' });
  const lancadoEm = useWatch({ control, name: 'lancadoEm' });

  return (
    <Box display="flex" flexDirection="column" gap="24px" className="container-style">
      <Box display="flex" gap="20px" alignContent="flex-start" alignItems="start">
        {/* TODO: Trocar este datePicker pelo que está criado na branch de Riscos */}
        <FormControl className="me-2">
          <DatePicker
            selected={lancadoEm}
            onChange={value => setValue('lancadoEm', value, { shouldValidate: true })}
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            className="rnc-list-date-picker"
            placeholderText="Atualizado em"
          />
          <label htmlFor="start-date-picker" className="rnc-list-date-label">
            Data
          </label>
        </FormControl>

        <FormControlLabel control={<Switch {...register('parcial')} />} label="parcial" labelPlacement="top" />
        <FormControlLabel control={<Switch {...register('metaAtingida')} />} label="meta atingida" labelPlacement="top" />

        {/* TODO: Trocar este datePicker pelo que está criado na branch de Riscos */}
        <FormControl className="me-2">
          <DatePicker
            selected={periodo}
            onChange={value => setValue('periodo', value, { shouldValidate: true })}
            dateFormat="MMMM / yyyy"
            locale="pt-BR"
            className="rnc-list-date-picker"
            placeholderText="Período"
            showMonthYearPicker
          />
          <label htmlFor="start-date-picker" className="rnc-list-date-label">
            Período
          </label>
        </FormControl>
      </Box>
      <TextField multiline rows={3} fullWidth label="Avaliação do Resultado" {...field('avaliacao')} />
      <TextField multiline rows={3} fullWidth label="Análise Crítica" {...field('analise')} />
      <Box display="flex" justifyContent="flex-end">
        <Button disabled={!formState.isValid} variant="contained" onClick={() => save(formMethods)} color="primary">
          SALVAR
        </Button>
      </Box>
    </Box>
  );
};

export const ResultPage = () => {
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const [isShowingNewForm, setIsShowingNewForm] = useState(false);

  const { idMeta } = useParams();

  const { data: recordd, isLoading: isLoadingRecord } = useQuery(
    {
      queryKey: [''],
      queryFn: () => [],
      enabled: !!idMeta, // Só faz a consulta se o ID estiver presente
      staleTime: 60000, // Dados ficam atualizados por 1 minuto,
    },
    queryClient
  );

  const record = [{ id: 2 }];

  const createMutation = useMutation(
    {
      mutationFn: createResult,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['records'] }); // Invalida as queries para atualizar a lista de registros
        navigate('/records'); // Redireciona para a lista de registros
      },
    },
    queryClient
  );

  function saveItem(formMethods: UseFormReturn<any>) {
    console.log(formMethods.getValues());
    formMethods.trigger();
    console.log(formMethods.formState.errors);
    console.log(formMethods.formState.isValid ? 'Está válido' : 'Não está válido');
  }

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">Metas e Objetivos</Typography>
          <Typography className="link">Resultado</Typography>
        </Breadcrumbs>
        <h1 className="title">Resultado</h1>
        <TextField fullWidth label="Descrição Ação" multiline rows={3} disabled InputProps={{ readOnly: true }} />
      </div>

      {record?.length && (
        <Box display="flex" justifyContent="end" position="relative">
          <Fab sx={{ position: 'absolute', top: '195px', marginRight: '15px' }} onClick={() => setIsShowingNewForm(!isShowingNewForm)}>
            {isShowingNewForm ? <DeleteIcon /> : <AddIcon />}
          </Fab>
        </Box>
      )}

      <Box display="flex" flexDirection="column" gap="15px" paddingRight="110px" mt="20px">
        {(isShowingNewForm || !record?.length) && <ResultItem save={saveItem} />}
        {(record || []).map((field, index) => (
          <ResultItem save={saveItem} key={field.id} />
        ))}
      </Box>
    </div>
  );
};
