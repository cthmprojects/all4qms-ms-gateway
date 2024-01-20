import React from 'react';
import { Card, Divider, TextField } from '@mui/material';
import './external-audit.css';

export const ExternalAuditRegister = ({ RNCsecondForm, setRNCsecondForm }) => {
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
            value={RNCsecondForm.norma}
            onChange={e => setRNCsecondForm({ ...RNCsecondForm, norma: e.target.value })}
          />
          <TextField
            fullWidth
            label="Número NC"
            name="numeroNC"
            className="form-field m-3"
            value={RNCsecondForm.numberNC}
            onChange={e => setRNCsecondForm({ ...RNCsecondForm, numberNC: e.target.value })}
          />
          <TextField
            fullWidth
            label="Requisito(s) da Norma"
            name="requisitosNorma"
            className="form-field m-3"
            value={RNCsecondForm.normaRequiremeents}
            onChange={e => setRNCsecondForm({ ...RNCsecondForm, normaRequiremeents: e.target.value })}
          />
          <TextField
            fullWidth
            label="Número do Relatório"
            name="numeroRelatorio"
            className="form-field m-3"
            value={RNCsecondForm.numberReport}
            onChange={e => setRNCsecondForm({ ...RNCsecondForm, numberReport: e.target.value })}
          />
        </div>
      </Card>
    </>
  );
};

export default ExternalAuditRegister;
