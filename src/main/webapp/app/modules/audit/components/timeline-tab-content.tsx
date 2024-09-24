import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Button } from 'reactstrap';

export const TimelineTabContent = () => {
  return (
    <div>
      <div style={{ paddingBottom: '30px', display: 'inline-flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          className="primary-button me-2 infodoc-list-form-field"
          style={{ marginRight: '10px', height: '58px' }}
          onClick={null}
          title="Novo Registro"
        >
          Novo Registro
        </Button>

        <div style={{ flexGrow: 0.4, display: 'inline-flex' }}>
          <FormControl className="me-2" variant="outlined" fullWidth>
            <InputLabel>Tipo de auditoria</InputLabel>
            <Select value={null} onChange={null} label="Tipo de auditoria" fullWidth>
              <MenuItem value={0}>Selecionar</MenuItem>

              <MenuItem key={0} value={1}>
                Auditoria Externa XPTO
              </MenuItem>
            </Select>
          </FormControl>

          <TextField label="Pesquisa" style={{ minWidth: '20vw' }} onChange={null} placeholder="Descrição" value={null} />

          <Button
            variant="contained"
            className="secondary-button me-2 rnc-list-form-field"
            style={{ height: '49px', marginLeft: '7px' }}
            onClick={null}
            title="Pesquisar"
          >
            Pesquisar
          </Button>
        </div>
      </div>
    </div>
  );
};
