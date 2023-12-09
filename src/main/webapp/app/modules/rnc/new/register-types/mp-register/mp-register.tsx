import React, { useState, useEffect } from 'react';
import { Card, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import './mp-register.css';
import { EditOutlined, UploadFileOutlined } from '@mui/icons-material';
import DatePicker from 'react-datepicker';

// TODO: Receber os dados do cliente e preencher os campos
// TODO: Validação de error dos campos
export const MPRegister = ({ onMPChange }) => {
  const [mpForm, setMPForm] = useState({
    mpCode: {
      value: '',
      error: false,
    },
    mpDescription: {
      value: '',
      error: false,
    },
    identifiedStep: {
      value: '',
      error: false,
    },
    productionShift: {
      value: '',
      error: false,
    },
    productionLine: {
      value: '',
      error: false,
    },
    operator: {
      value: '',
      error: false,
    },
    inspector: {
      value: '',
      error: false,
    },
    lot: {
      value: '',
      error: false,
    },
    inspectionType: {
      value: '',
      error: false,
    },
    deliveryDate: {
      value: new Date(),
      error: false,
    },
    receipt: {
      value: '',
      error: false,
    },
    nfDate: {
      value: new Date(),
      error: false,
    },
    nqa: {
      value: '',
      error: false,
    },
    sampleQuantity: {
      value: '',
      error: false,
    },
    defectQuantity: {
      value: '',
      error: false,
    },
    defectRate: {
      value: '',
      error: false,
    },
    requestNumber: {
      value: '',
      error: false,
    },
    opNumber: {
      value: '',
      error: false,
    },
  });

  // useEffect(() => {
  //   if (clientData) {
  //     setClientForm(clientData);
  //   }
  // }, [clientData]);

  const handleChange = (value: any) => {
    setMPForm(value);
    onMPChange(mpForm);
  };

  return (
    <>
      <Card>
        <h2 className="m-3">MP/Insumo</h2>
        <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: '100%' }} className="mt-3">
            <TextField
              value={mpForm.mpCode.value}
              onChange={e => handleChange({ ...mpForm, name: { value: e.target.value, error: mpForm.mpCode.error } })}
              label="Código MP/Insumo"
              name="mp-code"
              className="ms-3 m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={mpForm.mpDescription.value}
              onChange={e => handleChange({ ...mpForm, mpDescription: { value: e.target.value, error: mpForm.mpDescription.error } })}
              label="Descrição da MP/Insumo"
              name="mp-description"
              className="m-2"
              sx={{ width: '60% !important' }}
            />
            <FormControl className="m-2 select-mp">
              <InputLabel>Identificado no:</InputLabel>
              <Select
                value={mpForm.identifiedStep.value}
                onChange={event =>
                  handleChange({ ...mpForm, identifiedStep: { value: event.target.value, error: mpForm.identifiedStep.error } })
                }
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
              value={mpForm.productionShift.value}
              onChange={e => handleChange({ ...mpForm, productionShift: { value: e.target.value, error: mpForm.productionShift.error } })}
              label="Turno"
              name="production-shift"
              className="ms-3 m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={mpForm.productionLine.value}
              onChange={e => handleChange({ ...mpForm, productionLine: { value: e.target.value, error: mpForm.productionLine.error } })}
              label="Linha"
              name="production-line"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={mpForm.operator.value}
              onChange={e => handleChange({ ...mpForm, operator: { value: e.target.value, error: mpForm.operator.error } })}
              label="Operador"
              name="operator"
              className="m-2"
              sx={{ width: '40% !important' }}
            />
            <TextField
              value={mpForm.inspector.value}
              onChange={e => handleChange({ ...mpForm, inspector: { value: e.target.value, error: mpForm.inspector.error } })}
              label="Inspetor"
              name="inspector"
              className="m-2"
              sx={{ width: '40% !important' }}
            />
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <TextField
              value={mpForm.lot.value}
              onChange={e => handleChange({ ...mpForm, lot: { value: e.target.value, error: mpForm.lot.error } })}
              label="Lote"
              name="lot"
              className="ms-3 m-2"
              sx={{ width: '20% !important' }}
            />
            <TextField label="Quantidade do Lote" name="lot-quantity" className="m-2" sx={{ width: '20% !important' }} />
            <FormControl className="m-2 select-mp select-mp-inspection">
              <InputLabel>Regime de inspeção</InputLabel>
              <Select
                value={mpForm.inspectionType.value}
                onChange={event =>
                  handleChange({ ...mpForm, inspectionType: { value: event.target.value, error: mpForm.inspectionType.error } })
                }
                label="Regime de inspeção"
                name="inspection-type"
              >
                <MenuItem value="1">Amostragem</MenuItem>
              </Select>
            </FormControl>
            <TextField
              value={mpForm.nqa.value}
              onChange={e => handleChange({ ...mpForm, nqa: { value: e.target.value, error: mpForm.nqa.error } })}
              label="NQA"
              name="nqa"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={mpForm.sampleQuantity.value}
              onChange={e => handleChange({ ...mpForm, sampleQuantity: { value: e.target.value, error: mpForm.sampleQuantity.error } })}
              label="Número de amostras"
              name="number-samples"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={mpForm.defectQuantity.value}
              onChange={e => handleChange({ ...mpForm, defectQuantity: { value: e.target.value, error: mpForm.defectQuantity.error } })}
              label="Número de defeitos"
              name="number-defects"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={mpForm.defectRate.value}
              onChange={e => handleChange({ ...mpForm, defectRate: { value: e.target.value, error: mpForm.defectRate.error } })}
              label="% Rejeição"
              name="rejection-rate"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <FormControl className="ms-3 m-2">
              <DatePicker
                // locale='pt-BR'
                selected={mpForm.deliveryDate.value}
                onChange={date => handleChange({ ...mpForm, deliveryDate: { value: date, error: mpForm.deliveryDate.error } })}
                className="date-picker date-picker-rnc-client"
                id="date-picker-rnc-client"
              />
              <label htmlFor="date-picker-rnc-client" className="date-label">
                Data de entrega
              </label>
            </FormControl>
            <TextField
              value={mpForm.receipt.value}
              onChange={e => handleChange({ ...mpForm, receipt: { value: e.target.value, error: mpForm.receipt.error } })}
              label="Nota fiscal"
              name="receipt"
              className="m-2"
              sx={{ width: '25% !important' }}
            />
            <FormControl className="m-2">
              <DatePicker
                // locale='pt-BR'
                selected={mpForm.nfDate.value}
                onChange={date => handleChange({ ...mpForm, nfDate: { value: date, error: mpForm.deliveryDate.error } })}
                className="date-picker date-picker-rnc-client"
                id="date-picker-rnc-client-nf"
              />
              <label htmlFor="date-picker-rnc-client-nf" className="date-label date-label-nf">
                Data NF
              </label>
            </FormControl>
            <TextField
              value={mpForm.requestNumber.value}
              onChange={e => handleChange({ ...mpForm, requestNumber: { value: e.target.value, error: mpForm.requestNumber.error } })}
              label="Número do pedido"
              name="request-number"
              className="m-2"
              sx={{ width: '25% !important' }}
            />
            <TextField
              value={mpForm.opNumber.value}
              onChange={e => handleChange({ ...mpForm, opNumber: { value: e.target.value, error: mpForm.opNumber.error } })}
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
