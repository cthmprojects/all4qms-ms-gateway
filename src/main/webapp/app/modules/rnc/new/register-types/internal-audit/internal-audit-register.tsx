import React from 'react';
import { Card, Divider, TextField } from '@mui/material';
import './internal-audit.css';

export const InternalAuditRegister = () => {
  return (
    <>
      <Card>
        <h2 className="m-3">Auditoria Interna</h2>
        <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextField fullWidth label="Norma" name="norma" disabled className="form-field m-3" />
          <TextField fullWidth label="Número NC" name="numeroNC" className="form-field m-3" />
          <TextField fullWidth label="Requisito(s) da Norma" name="requisitosNorma" className="form-field m-3" />
          <TextField fullWidth label="Número do Relatório" name="numeroRelatorio" className="form-field m-3" />
        </div>
      </Card>
    </>
  );
};

export default InternalAuditRegister;
