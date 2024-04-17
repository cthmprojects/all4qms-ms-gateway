import { Card, Divider, TextField } from '@mui/material';
import { GeneralAudit } from 'app/modules/rnc/models';
import React, { useEffect, useState } from 'react';
import './external-audit.css';

type ExternalAuditRegisterProps = {
  onChanged: (externalAudit: GeneralAudit) => void;
};

export const ExternalAuditRegister = ({ onChanged }: ExternalAuditRegisterProps) => {
  const [external, setExternal] = useState<GeneralAudit>({
    ncNumber: 0,
    norm: '',
    normRequirements: '',
    reportNumber: 0,
  });

  useEffect(() => {
    onChanged(external);
  }, [external]);

  const validateNegativeFields = (data, value) => {
    if (parseFloat(value) < 0) {
      return;
    }

    if (parseFloat(value) > 999999999) {
      return;
    }

    setExternal(data);
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
            value={external.norm}
            onChange={e => setExternal({ ...external, norm: e.target.value })}
          />
          <TextField
            fullWidth
            label="Número NC"
            name="numeroNC"
            className="form-field m-3"
            type="number"
            value={external.ncNumber}
            onChange={e => validateNegativeFields({ ...external, ncNumber: parseInt(e.target.value) }, e.target.value)}
          />
          <TextField
            fullWidth
            label="Requisito(s) da Norma"
            name="requisitosNorma"
            className="form-field m-3"
            value={external.normRequirements}
            onChange={e => setExternal({ ...external, normRequirements: e.target.value })}
          />
          <TextField
            fullWidth
            label="Número do Relatório"
            name="numeroRelatorio"
            type="number"
            className="form-field m-3"
            value={external.reportNumber}
            onChange={e => validateNegativeFields({ ...external, reportNumber: parseInt(e.target.value) }, e.target.value)}
          />
        </div>
      </Card>
    </>
  );
};

export default ExternalAuditRegister;
