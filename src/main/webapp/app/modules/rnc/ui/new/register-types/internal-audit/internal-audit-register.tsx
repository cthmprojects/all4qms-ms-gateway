import { Card, Divider, TextField } from '@mui/material';
import { GeneralAudit } from 'app/modules/rnc/models';
import React, { useEffect, useState } from 'react';
import './internal-audit.css';

type InternalAuditRegisterProps = {
  onChanged: (internalAudit: GeneralAudit) => void;
};

export const InternalAuditRegister = ({ onChanged }: InternalAuditRegisterProps) => {
  const [internal, setInternal] = useState<GeneralAudit>({
    ncNumber: 0,
    norm: '',
    normRequirements: '',
    reportNumber: 0,
  });

  useEffect(() => {
    onChanged(internal);
  }, [internal]);

  return (
    <>
      <Card>
        <h2 className="m-3">Auditoria Interna</h2>
        <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            fullWidth
            onChange={e => setInternal({ ...internal, norm: e.target.value })}
            label="Norma"
            name="norma"
            className="form-field m-3"
          />
          <TextField
            fullWidth
            onChange={e => setInternal({ ...internal, ncNumber: parseInt(e.target.value) })}
            type="number"
            label="Número NC"
            name="numeroNC"
            className="form-field m-3"
          />
          <TextField
            fullWidth
            onChange={e => setInternal({ ...internal, normRequirements: e.target.value })}
            label="Requisito(s) da Norma"
            name="requisitosNorma"
            className="form-field m-3"
          />
          <TextField
            fullWidth
            onChange={e => setInternal({ ...internal, reportNumber: parseInt(e.target.value) })}
            type="number"
            label="Número do Relatório"
            name="numeroRelatorio"
            className="form-field m-3"
          />
        </div>
      </Card>
    </>
  );
};

export default InternalAuditRegister;
