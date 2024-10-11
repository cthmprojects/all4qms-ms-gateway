import { Card, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { RawMaterial } from 'app/modules/rnc/models';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import './mp-register.css';

type RawMaterialProps = {
  initialData?: RawMaterial | null;
  onChanged: (rawMaterial: RawMaterial) => void;
};

export const MPRegister = ({ initialData, onChanged }: RawMaterialProps) => {
  const [rawMaterial, setRawMaterial] = useState<RawMaterial>({
    batch: '',
    batchSize: 0,
    code: '',
    defects: 0,
    deliveredAt: new Date(),
    description: '',
    identifier: '',
    inspectionRule: '',
    inspector: '',
    invoice: '',
    invoiceDate: new Date(),
    line: '',
    nqa: '',
    operator: '',
    opNumber: '',
    rejectionRate: 0,
    requestNumber: '',
    samples: 0,
    shift: '',
    traceability: {
      deliveredAt: new Date(),
      identifier: '',
      date: new Date(),
      rncId: 0,
    },
  });

  useEffect(() => {
    if (!initialData) {
      return;
    }
    setRawMaterial({
      batch: initialData.batch,
      batchSize: initialData.batchSize,
      code: initialData.code,
      defects: initialData.defects,
      deliveredAt: new Date(initialData.deliveredAt),
      description: initialData.description,
      identifier: initialData.identifier,
      inspectionRule: initialData.inspectionRule,
      inspector: initialData.inspector,
      invoice: initialData.invoice,
      invoiceDate: new Date(initialData.invoiceDate),
      line: initialData.line,
      nqa: initialData.nqa,
      operator: initialData.operator,
      opNumber: initialData.opNumber,
      rejectionRate: initialData.rejectionRate,
      requestNumber: initialData.requestNumber,
      samples: initialData.samples,
      shift: initialData.shift,
      traceability: {
        deliveredAt: new Date(initialData.traceability.deliveredAt),
        identifier: initialData.traceability.identifier,
        date: new Date(initialData.traceability.date),
        rncId: initialData.traceability.rncId,
      },
    });
  }, [initialData]);

  useEffect(() => {
    onChanged(rawMaterial);
  }, [rawMaterial]);

  return (
    <>
      <Card>
        <h2 className="m-3">MP/Insumo</h2>
        <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: '100%' }} className="mt-3">
            <TextField
              value={rawMaterial.code}
              onChange={e => setRawMaterial({ ...rawMaterial, code: e.target.value })}
              label="Código MP/Insumo"
              name="mp-code"
              className="ms-3 m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={rawMaterial.description}
              onChange={e => setRawMaterial({ ...rawMaterial, description: e.target.value })}
              label="Descrição da MP/Insumo"
              name="mp-description"
              className="m-2"
              sx={{ width: '60% !important' }}
            />
            <FormControl className="m-2 select-mp">
              <InputLabel>Identificado no:</InputLabel>
              <Select
                value={rawMaterial.identifier}
                onChange={e => setRawMaterial({ ...rawMaterial, identifier: e.target.value })}
                label="Identificado no:"
                name="identifiedStep"
              >
                <MenuItem value="reception">Recebimento</MenuItem>
                <MenuItem value="process">Processo</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <TextField
              value={rawMaterial.shift}
              onChange={e => setRawMaterial({ ...rawMaterial, shift: e.target.value })}
              label="Turno"
              name="production-shift"
              className="ms-3 m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={rawMaterial.line}
              onChange={e => setRawMaterial({ ...rawMaterial, line: e.target.value })}
              label="Linha"
              name="production-line"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={rawMaterial.operator}
              onChange={e => setRawMaterial({ ...rawMaterial, operator: e.target.value })}
              label="Operador"
              name="operator"
              className="m-2"
              sx={{ width: '40% !important' }}
            />
            <TextField
              value={rawMaterial.inspector}
              onChange={e => setRawMaterial({ ...rawMaterial, inspector: e.target.value })}
              label="Inspetor"
              name="inspector"
              className="m-2"
              sx={{ width: '40% !important' }}
            />
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <TextField
              value={rawMaterial.batch}
              onChange={e => setRawMaterial({ ...rawMaterial, batch: e.target.value })}
              label="Lote"
              name="lot"
              className="ms-3 m-2"
              sx={{ width: '20% !important' }}
            />
            <TextField
              value={rawMaterial.batchSize}
              onChange={e => setRawMaterial({ ...rawMaterial, batchSize: parseInt(e.target.value.slice(0, 10), 10) })}
              label="Quantidade do Lote"
              name="lot-quantity"
              className="m-2"
              sx={{ width: '20% !important' }}
              type="number"
            />
            <FormControl className="m-2 select-mp select-mp-inspection">
              <InputLabel>Regime de inspeção</InputLabel>
              <Select
                value={rawMaterial.inspectionRule}
                onChange={e => setRawMaterial({ ...rawMaterial, inspectionRule: e.target.value })}
                label="Regime de inspeção"
                name="inspection-type"
              >
                <MenuItem value="AMOSTRAGEM">Amostragem</MenuItem>
                <MenuItem value="COMPLETA">Completa</MenuItem>
              </Select>
            </FormControl>
            <TextField
              value={rawMaterial.nqa}
              onChange={e => setRawMaterial({ ...rawMaterial, nqa: e.target.value })}
              label="NQA"
              name="nqa"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={rawMaterial.samples}
              onChange={e => setRawMaterial({ ...rawMaterial, samples: parseInt(e.target.value.slice(0, 10), 10) })}
              label="Número de amostras"
              type="number"
              name="number-samples"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={rawMaterial.defects}
              onChange={e => setRawMaterial({ ...rawMaterial, defects: parseInt(e.target.value.slice(0, 10), 10) })}
              label="Número de defeitos"
              name="number-defects"
              type="number"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={((rawMaterial.defects / rawMaterial.samples) * 100).toFixed(2)}
              onChange={e => setRawMaterial({ ...rawMaterial, rejectionRate: parseInt(e.target.value.slice(0, 10), 10) })}
              label="% Rejeição"
              name="rejection-rate"
              type="number"
              className="m-2"
              disabled
              sx={{ width: '10% !important' }}
            />
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <FormControl className="ms-3 m-2">
              <DatePicker
                // locale='pt-BR'
                selected={rawMaterial.deliveredAt}
                onChange={e => setRawMaterial({ ...rawMaterial, deliveredAt: e.target.value })}
                className="date-picker date-picker-rnc-client"
                id="date-picker-rnc-client"
                dateFormat={'dd/MM/yyyy'}
              />
              <label htmlFor="date-picker-rnc-client" className="date-label">
                Data de entrega
              </label>
            </FormControl>
            <TextField
              value={rawMaterial.invoice}
              onChange={e => setRawMaterial({ ...rawMaterial, invoice: e.target.value })}
              label="Nota fiscal"
              name="receipt"
              className="m-2"
              sx={{ width: '25% !important' }}
            />
            <FormControl className="m-2">
              <DatePicker
                // locale='pt-BR'
                selected={rawMaterial.invoiceDate}
                onChange={e => setRawMaterial({ ...rawMaterial, invoiceDate: e.target.value })}
                className="date-picker date-picker-rnc-client"
                id="date-picker-rnc-client-nf"
                dateFormat={'dd/MM/yyyy'}
              />
              <label htmlFor="date-picker-rnc-client-nf" className="date-label date-label-nf">
                Data NF
              </label>
            </FormControl>
            <TextField
              value={rawMaterial.requestNumber}
              onChange={e => setRawMaterial({ ...rawMaterial, requestNumber: e.target.value })}
              label="Número do pedido"
              name="request-number"
              className="m-2"
              sx={{ width: '25% !important' }}
            />
            <TextField
              value={rawMaterial.opNumber}
              onChange={e => setRawMaterial({ ...rawMaterial, opNumber: e.target.value })}
              label="Número OP"
              name="op-number"
              className="m-2"
              sx={{ width: '25% !important' }}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default MPRegister;
