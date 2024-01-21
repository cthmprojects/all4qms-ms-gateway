import React from 'react';
import { Button, Card, Divider, TextField } from '@mui/material';
import './internal-audit.css';
import { toast } from 'react-toastify';

export const InternalAuditRegister = ({ setInternalAuditRegister }) => {
  const [internal, setInternal] = React.useState({
    norma: '',
    numberNC: '',
    normaRequiremeents: '',
    numberReport: '',
  });

  const handleChange = () => {
    setInternalAuditRegister({
      norma: internal.norma,
      numberNC: internal.numberNC,
      normaRequiremeents: internal.normaRequiremeents,
      numberReport: internal.numberReport,
    });
    toast.success('Origem salva com sucesso!');
  };

  return (
    <>
      <Card>
        <h2 className="m-3">Auditoria Interna</h2>
        <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            fullWidth
            onChange={e => setInternal({ ...internal, norma: e.target.value })}
            label="Norma"
            name="norma"
            disabled
            className="form-field m-3"
          />
          <TextField
            fullWidth
            onChange={e => setInternal({ ...internal, numberNC: e.target.value })}
            label="Número NC"
            name="numeroNC"
            className="form-field m-3"
          />
          <TextField
            fullWidth
            onChange={e => setInternal({ ...internal, normaRequiremeents: e.target.value })}
            label="Requisito(s) da Norma"
            name="requisitosNorma"
            className="form-field m-3"
          />
          <TextField
            fullWidth
            onChange={e => setInternal({ ...internal, numberReport: e.target.value })}
            label="Número do Relatório"
            name="numeroRelatorio"
            className="form-field m-3"
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

export default InternalAuditRegister;
