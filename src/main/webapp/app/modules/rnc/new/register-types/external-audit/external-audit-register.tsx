import React from 'react';
import { Button, Card, Divider, TextField } from '@mui/material';
import './external-audit.css';
import { toast } from 'react-toastify';

export const ExternalAuditRegister = ({ setExternalAuditRegister }) => {
  const [external, setExternal] = React.useState({
    norma: '',
    numberNC: '',
    normaRequiremeents: '',
    numberReport: '',
  });

  const handleChange = () => {
    setExternalAuditRegister({
      norma: external.norma,
      numberNC: external.numberNC,
      normaRequiremeents: external.normaRequiremeents,
      numberReport: external.numberReport,
    });
    toast.success('Origem salva com sucesso!');
  };

  return (
    <>
      <Card>
        <h2 className="m-3">Auditoria Externa</h2>
        <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            fullWidth
            label="Norma"
            name="norma"
            className="form-field m-3"
            value={external.norma}
            onChange={e => setExternal({ ...external, norma: e.target.value })}
          />
          <TextField
            fullWidth
            label="Número NC"
            name="numeroNC"
            className="form-field m-3"
            type="number"
            value={external.numberNC}
            onChange={e => setExternal({ ...external, numberNC: e.target.value })}
          />
          <TextField
            fullWidth
            label="Requisito(s) da Norma"
            name="requisitosNorma"
            className="form-field m-3"
            value={external.normaRequiremeents}
            onChange={e => setExternal({ ...external, normaRequiremeents: e.target.value })}
          />
          <TextField
            fullWidth
            label="Número do Relatório"
            name="numeroRelatorio"
            type="number"
            className="form-field m-3"
            value={external.numberReport}
            onChange={e => setExternal({ ...external, numberReport: e.target.value })}
          />
        </div>
        <div className="m-2" style={{ display: 'flex', width: '100%', justifyContent: 'end' }}>
          <Button
            className="me-4 mb-3"
            variant="contained"
            color="primary"
            style={{ background: '#e6b200', color: '#4e4d4d' }}
            onClick={() => handleChange()}
          >
            Salvar
          </Button>
        </div>
      </Card>
    </>
  );
};

export default ExternalAuditRegister;
