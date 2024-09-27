import { Box, Breadcrumbs, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';

export const ModelAuditNewEdit = () => {
  const navigate = useNavigate();
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
              <MenuItem value={0}>Selecionar</MenuItem>
              <MenuItem key={0} value={1}>
                Menu 1
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl className="me-2" variant="outlined" fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select value={null} onChange={null} label="Selecionar" fullWidth>
              <MenuItem value={0}>Selecionar</MenuItem>
              <MenuItem key={0} value={1}>
                Menu 1
              </MenuItem>
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
