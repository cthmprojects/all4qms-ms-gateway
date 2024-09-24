import { Box, Breadcrumbs, TextField, Typography } from '@mui/material';
import { Control, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export const PlanningNewEdit = () => {
  // TODO: Nada aqui é o nome real, isso é apenas um exemplo. Por favor facilitar a vida e usar o mesmo nome e props que o backend utilizar
  const { control, register } = useForm({
    defaultValues: {
      id: null,
      objetivo: '',
      criterio: null,
      auditores: [],
      requisitos: '',
      metodo: '',
      escopo: '',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const formr = (name: keyof typeof control._defaultValues) => ({ ...register(name, { required: 'Campo obrigatório' }), required: true });

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
          <Typography className="link">Cadastrar Planejamento</Typography>
        </Breadcrumbs>

        <h2 className="title">Novo Planejamento</h2>
        <Box display="flex" flexDirection="column" gap="24px">
          <div></div>
          <TextField multiline rows="3" fullWidth label="Objetivo da auditoria" {...formr('objetivo')} />
          <TextField multiline rows="3" fullWidth label="Critérios da Auditoria / Norma de referência" {...formr('criterio')} />
          <TextField multiline rows="3" fullWidth label="Requisitos" {...formr('requisitos')} />
          <TextField multiline rows="3" fullWidth label="Método" {...formr('metodo')} />
          <TextField multiline rows="3" fullWidth label="Escopo" {...formr('escopo')} />
        </Box>
      </div>
    </div>
  );
};
