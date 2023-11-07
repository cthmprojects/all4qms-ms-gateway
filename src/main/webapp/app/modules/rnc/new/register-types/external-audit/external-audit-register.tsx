import React from 'react';
import { Card, Divider, TextField } from '@mui/material';
import './external-audit.css';

export const ExternalAuditRegister = () => {
  return (
    <>
      <Card>
        <h2 className="m-3">Auditoria Externa</h2>
        <Divider variant="middle" />
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

export default ExternalAuditRegister;
