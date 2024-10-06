import { Box, Breadcrumbs, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Typography } from '@mui/material';
import { EnumTemporal } from 'app/modules/goals-objectives/models/enums';
import { EnumPartes } from 'app/shared/model/enumerations/enum-partes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'reactstrap';
import { TiposAuditoria } from 'app/shared/model/constants';
import { ModeloAuditoria } from '../audit-models';
import { useForm } from 'react-hook-form';

const defaultRule = { required: 'Campo obrigatório' };

export const ModelAuditNewEdit = () => {
  const navigate = useNavigate();
  const { idModel } = useParams();

  const { control, reset, getValues } = useForm<ModeloAuditoria>({
    defaultValues: {
      id: null,
      tipo: '',
      nomeAuditoria: '',
      frequencia: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

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
          <Typography className="link">Cadastrar Modelo</Typography>
        </Breadcrumbs>

        <h2 className="title">Cadastrar Modelos de Auditoria</h2>

        <div style={{ flexGrow: 0.4, display: 'inline-flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          <TextField
            className="me-2"
            label="Nome da Auditoria"
            style={{ minWidth: '20vw' }}
            onChange={null}
            placeholder="Auditoria"
            value={null}
          />

          <FormControl className="me-2" variant="outlined" fullWidth>
            <InputLabel>Frequência</InputLabel>
            <Select value={null} onChange={null} label="Selecionar" fullWidth>
              {Object.values(EnumTemporal).map((value, idx) => (
                <MenuItem key={idx} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className="me-2" variant="outlined" fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select value={null} onChange={null} label="Selecionar" fullWidth>
              {TiposAuditoria.map(item => (
                <MenuItem key={item.name} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <hr></hr>
        <div style={{ display: 'flex', justifyContent: 'end' }} className="ms-3 me-2 mt-3">
          <Button
            variant="contained"
            style={{ background: '#d9d9d9', color: '#4e4d4d' }}
            className="me-2"
            onClick={() => {
              navigate('/audit');
            }}
          >
            Voltar
          </Button>
          <Button variant="contained" color="primary" style={{ width: '115px', background: '#e6b200', color: '#4e4d4d' }} onClick={null}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};
