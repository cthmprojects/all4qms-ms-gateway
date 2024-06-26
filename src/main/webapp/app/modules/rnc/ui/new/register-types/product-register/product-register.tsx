import React, { useState, useEffect } from 'react';
import { Card, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import './product-register.css';
import { EditOutlined, UploadFileOutlined } from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import { RawMaterial } from 'app/modules/rnc/models';
import { useAppSelector } from 'app/config/store';

// TODO: Receber os dados do cliente e preencher os campos
// TODO: Validação de error dos campos

type RawMaterialProps = {
  initialData?: RawMaterial | null;
  onProductRegisterChange: (rawMaterial: RawMaterial) => void;
};

export const ProductRegister = ({ initialData, onProductRegisterChange }: RawMaterialProps) => {
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
    opNumber: 0,
    rejectionRate: 0,
    requestNumber: 0,
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
    onProductRegisterChange(rawMaterial);
  }, [rawMaterial]);

  const validateNegativeFields = (data, value) => {
    if (parseFloat(value) < 0) {
      return;
    }

    if (parseFloat(value) > 999999999) {
      return;
    }

    setRawMaterial(data);
  };

  const validatePercentageFields = (data, value) => {
    if (parseFloat(value) < 0) {
      return;
    }

    if (parseFloat(value) > 100) {
      return;
    }

    setRawMaterial(data);
  };

  const users = useAppSelector(state => state.all4qmsmsgateway.users.entities);

  return (
    <>
      <Card>
        <h2 className="m-3">Produto</h2>
        <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: '100%' }} className="mt-3">
            <TextField
              value={rawMaterial.code}
              onChange={e => validateNegativeFields({ ...rawMaterial, code: e.target.value }, e.target.value)}
              label="Código Produto"
              name="mp-code"
              className="ms-3 m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={rawMaterial.description}
              onChange={e => setRawMaterial({ ...rawMaterial, description: e.target.value })}
              label="Descrição do Produto"
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
              className="ms-3 m-2 rnc-form-field"
              id="rnc-text-field"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={rawMaterial.line}
              onChange={e => setRawMaterial({ ...rawMaterial, line: e.target.value })}
              label="Linha"
              name="production-line"
              className="m-2 rnc-form-field"
              id="rnc-text-field"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={rawMaterial.operator}
              onChange={e => setRawMaterial({ ...rawMaterial, operator: e.target.value })}
              label="Operador"
              name="mp-description"
              className="m-2"
              sx={{ width: '60% !important' }}
            />
            <TextField
              value={rawMaterial.inspector}
              onChange={e => setRawMaterial({ ...rawMaterial, inspector: e.target.value })}
              label="Inspetor"
              name="mp-description"
              className="m-2"
              sx={{ width: '60% !important' }}
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
              onChange={e => validateNegativeFields({ ...rawMaterial, batchSize: parseInt(e.target.value) }, e.target.value)}
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
              onChange={e => validateNegativeFields({ ...rawMaterial, samples: parseInt(e.target.value) }, e.target.value)}
              label="Nº Amostras"
              type="number"
              name="number-samples"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={rawMaterial.defects}
              onChange={e => validateNegativeFields({ ...rawMaterial, defects: parseInt(e.target.value) }, e.target.value)}
              label="Nº Defeitos"
              name="number-defects"
              type="number"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={(rawMaterial.defects / rawMaterial.samples) * 100}
              onChange={e => validatePercentageFields({ ...rawMaterial, rejectionRate: parseInt(e.target.value) }, e.target.value)}
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
                selected={rawMaterial.traceability.deliveredAt}
                onChange={date => setRawMaterial({ ...rawMaterial, traceability: { ...rawMaterial.traceability, deliveredAt: date } })}
                className="date-picker date-picker-rnc-client"
                id="date-picker-rnc-client"
                dateFormat={'dd/MM/yyyy'}
              />
              <label htmlFor="date-picker-rnc-client" className="date-label">
                Data de entrega
              </label>
            </FormControl>
            <TextField
              value={rawMaterial.traceability.identifier}
              onChange={e => setRawMaterial({ ...rawMaterial, traceability: { ...rawMaterial.traceability, identifier: e.target.value } })}
              label="Nota fiscal"
              name="receipt"
              className="m-2"
              sx={{ width: '25% !important' }}
            />
            <FormControl className="m-2">
              <DatePicker
                // locale='pt-BR'
                selected={rawMaterial.traceability.date}
                onChange={date => setRawMaterial({ ...rawMaterial, traceability: { ...rawMaterial.traceability, date: date } })}
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
              onChange={e => validateNegativeFields({ ...rawMaterial, requestNumber: parseInt(e.target.value) }, e.target.value)}
              label="Número do pedido"
              type="number"
              name="request-number"
              className="m-2"
              sx={{ width: '25% !important' }}
            />
            <TextField
              value={rawMaterial.opNumber}
              onChange={e => validateNegativeFields({ ...rawMaterial, opNumber: parseInt(e.target.value) }, e.target.value)}
              label="Número OP"
              type="number"
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

export default ProductRegister;
