import React, { useState, useEffect } from 'react';
import { Card, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import './product-register.css';
import { EditOutlined, UploadFileOutlined } from '@mui/icons-material';
import DatePicker from 'react-datepicker';

// TODO: Receber os dados do cliente e preencher os campos
// TODO: Validação de error dos campos
export const ProductRegister = ({ onProductRegisterChange }) => {
  const [productForm, setProductForm] = useState({
    productCode: {
      value: '',
      error: false,
    },
    productDescription: {
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
    setProductForm(value);
    onProductRegisterChange(productForm);
  };

  return (
    <>
      <Card>
        <h2 className="m-3">Produto</h2>
        <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: '100%' }} className="mt-3">
            <TextField
              value={productForm.productCode.value}
              onChange={e => handleChange({ ...productForm, name: { value: e.target.value, error: productForm.productCode.error } })}
              label="Código MP/Insumo"
              name="mp-code"
              className="ms-3 m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={productForm.productDescription.value}
              onChange={e =>
                handleChange({ ...productForm, productDescription: { value: e.target.value, error: productForm.productDescription.error } })
              }
              label="Descrição da MP/Insumo"
              name="mp-description"
              className="m-2"
              sx={{ width: '60% !important' }}
            />
            <FormControl className="m-2 select-mp">
              <InputLabel>Identificado no:</InputLabel>
              <Select
                value={productForm.identifiedStep.value}
                onChange={event =>
                  handleChange({ ...productForm, identifiedStep: { value: event.target.value, error: productForm.identifiedStep.error } })
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
              value={productForm.productionShift.value}
              onChange={e =>
                handleChange({ ...productForm, productionShift: { value: e.target.value, error: productForm.productionShift.error } })
              }
              label="Turno"
              name="production-shift"
              className="ms-3 m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={productForm.productionLine.value}
              onChange={e =>
                handleChange({ ...productForm, productionLine: { value: e.target.value, error: productForm.productionLine.error } })
              }
              label="Linha"
              name="production-line"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={productForm.operator.value}
              onChange={e => handleChange({ ...productForm, operator: { value: e.target.value, error: productForm.operator.error } })}
              label="Operador"
              name="operator"
              className="m-2"
              sx={{ width: '40% !important' }}
            />
            <TextField
              value={productForm.inspector.value}
              onChange={e => handleChange({ ...productForm, inspector: { value: e.target.value, error: productForm.inspector.error } })}
              label="Inspetor"
              name="inspector"
              className="m-2"
              sx={{ width: '40% !important' }}
            />
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <TextField
              value={productForm.lot.value}
              onChange={e => handleChange({ ...productForm, lot: { value: e.target.value, error: productForm.lot.error } })}
              label="Lote"
              name="lot"
              className="ms-3 m-2"
              sx={{ width: '20% !important' }}
            />
            <TextField label="Quantidade do Lote" name="lot-quantity" className="m-2" sx={{ width: '20% !important' }} />
            <FormControl className="m-2 select-mp select-mp-inspection">
              <InputLabel>Regime de inspeção</InputLabel>
              <Select
                value={productForm.inspectionType.value}
                onChange={event =>
                  handleChange({ ...productForm, inspectionType: { value: event.target.value, error: productForm.inspectionType.error } })
                }
                label="Regime de inspeção"
                name="inspection-type"
              >
                <MenuItem value="1">Amostragem</MenuItem>
              </Select>
            </FormControl>
            <TextField
              value={productForm.nqa.value}
              onChange={e => handleChange({ ...productForm, nqa: { value: e.target.value, error: productForm.nqa.error } })}
              label="NQA"
              name="nqa"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={productForm.sampleQuantity.value}
              onChange={e =>
                handleChange({ ...productForm, sampleQuantity: { value: e.target.value, error: productForm.sampleQuantity.error } })
              }
              label="Número de amostras"
              name="number-samples"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={productForm.defectQuantity.value}
              onChange={e =>
                handleChange({ ...productForm, defectQuantity: { value: e.target.value, error: productForm.defectQuantity.error } })
              }
              label="Número de defeitos"
              name="number-defects"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={productForm.defectRate.value}
              onChange={e => handleChange({ ...productForm, defectRate: { value: e.target.value, error: productForm.defectRate.error } })}
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
                selected={productForm.deliveryDate.value}
                onChange={date => handleChange({ ...productForm, deliveryDate: { value: date, error: productForm.deliveryDate.error } })}
                className="date-picker date-picker-rnc-client"
                id="date-picker-rnc-client"
                dateFormat={'dd/MM/yyyy'}
              />
              <label htmlFor="date-picker-rnc-client" className="date-label">
                Data de entrega
              </label>
            </FormControl>
            <TextField
              value={productForm.receipt.value}
              onChange={e => handleChange({ ...productForm, receipt: { value: e.target.value, error: productForm.receipt.error } })}
              label="Nota fiscal"
              name="receipt"
              className="m-2"
              sx={{ width: '25% !important' }}
            />
            <FormControl className="m-2">
              <DatePicker
                // locale='pt-BR'
                selected={productForm.nfDate.value}
                onChange={date => handleChange({ ...productForm, nfDate: { value: date, error: productForm.deliveryDate.error } })}
                className="date-picker date-picker-rnc-client"
                id="date-picker-rnc-client-nf"
                dateFormat={'dd/MM/yyyy'}
              />
              <label htmlFor="date-picker-rnc-client-nf" className="date-label date-label-nf">
                Data NF
              </label>
            </FormControl>
            <TextField
              value={productForm.requestNumber.value}
              onChange={e =>
                handleChange({ ...productForm, requestNumber: { value: e.target.value, error: productForm.requestNumber.error } })
              }
              label="Número do pedido"
              name="request-number"
              className="m-2"
              sx={{ width: '25% !important' }}
            />
            <TextField
              value={productForm.opNumber.value}
              onChange={e => handleChange({ ...productForm, opNumber: { value: e.target.value, error: productForm.opNumber.error } })}
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

export default ProductRegister;
