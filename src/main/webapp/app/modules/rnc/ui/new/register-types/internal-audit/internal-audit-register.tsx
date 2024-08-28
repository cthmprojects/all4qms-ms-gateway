import { Card, Divider, TextField } from '@mui/material';
import { GeneralAudit } from 'app/modules/rnc/models';
import React, { useEffect, useState } from 'react';
import './internal-audit.css';

type InternalAuditRegisterProps = {
  audit: GeneralAudit;
  onChanged: (internalAudit: GeneralAudit) => void;
};

export const InternalAuditRegister = ({ audit, onChanged }: InternalAuditRegisterProps) => {
  const [nc, setNc] = useState<string>('');
  const [norm, setNorm] = useState<string>('');
  const [report, setReport] = useState<string>('');
  const [requirement, setRequirement] = useState<string>('');

  useEffect(() => {
    onChanged({
      ncNumber: parseInt(nc),
      norm: norm,
      normRequirements: requirement,
      reportNumber: parseInt(report),
    });
  }, [nc, norm, report, requirement]);

  useEffect(() => {
    if (!audit) {
      return;
    }

    setNc(audit.ncNumber?.toString() ?? '');
    setNorm(audit.norm);
    setRequirement(audit.normRequirements);
    setReport(audit.reportNumber?.toString() ?? '');
  }, [audit]);

  const validateNegativeFields = (value: string): string => {
    const parsed: number = parseFloat(value);

    if (parsed < 0 || parsed > 999999999) {
      return '';
    }

    return value;
  };

  const onNcChanged = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    const { value } = event.target;

    setNc(validateNegativeFields(value));
  };

  const onNormChanged = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    const { value } = event.target;

    setNorm(value);
  };

  const onReportChanged = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    const { value } = event.target;

    setReport(validateNegativeFields(value));
  };

  const onRequirementChanged = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    const { value } = event.target;

    setRequirement(value);
  };

  return (
    <>
      <Card>
        <h2 className="m-3">Auditoria Interna</h2>
        <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextField fullWidth label="Norma" name="norma" className="form-field m-3" value={norm} onChange={onNormChanged} />
          <TextField
            fullWidth
            label="Número NC"
            name="numeroNC"
            className="form-field m-3"
            type="number"
            value={nc}
            onChange={onNcChanged}
          />
          <TextField
            fullWidth
            label="Requisito(s) da Norma"
            name="requisitosNorma"
            className="form-field m-3"
            value={requirement}
            onChange={onRequirementChanged}
          />
          <TextField
            fullWidth
            label="Número do Relatório"
            name="numeroRelatorio"
            type="number"
            className="form-field m-3"
            value={report}
            onChange={onReportChanged}
          />
        </div>
      </Card>
    </>
  );
};

export default InternalAuditRegister;
