import React, { useState, useEffect } from 'react';
import { Card, Divider, FormControl, IconButton, TextField } from '@mui/material';
import './rnc-client-register.css';
import { EditOutlined, UploadFileOutlined } from '@mui/icons-material';
import DatePicker from 'react-datepicker';

// TODO: Receber os dados do cliente e preencher os campos
// TODO: Validação de error dos campos
export const ClientRegister = ({ onClientChange }) => {
  const [clientForm, setClientForm] = useState({
    name: {
      value: '',
      error: false,
    },
    productCode: {
      value: '',
      error: false,
    },
    productCode2: {
      value: '',
      error: false,
    },
    productDescription: {
      value: '',
      error: false,
    },
    lotQuantity: {
      value: '',
      error: false,
    },
    rejectedQuantity: {
      value: '',
      error: false,
    },
    defectRate: {
      value: '',
      error: false,
    },
    lot: {
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
    setClientForm(value);
    onClientChange(clientForm);
  };

  return (
    <>
      <Card>
        <h2 className="m-3">Cliente</h2>
        <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: '100%' }} className="mt-3">
            <TextField
              value={clientForm.name.value}
              label="Nome"
              name="name"
              className="ms-3 m-2"
              sx={{ width: '70% !important' }}
              onChange={e => handleChange({ ...clientForm, name: { value: e.target.value, error: clientForm.name.error } })}
            />
            <TextField
              value={clientForm.productCode.value}
              onChange={e => handleChange({ ...clientForm, productCode: { value: e.target.value, error: clientForm.productCode.error } })}
              label="Código do produto"
              name="product-code"
              className="m-2"
              sx={{ width: '30% !important' }}
            />
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <TextField
              value={clientForm.productCode2.value}
              onChange={e => handleChange({ ...clientForm, productCode2: { value: e.target.value, error: clientForm.productCode2.error } })}
              label="Código do produto"
              name="product-code-2"
              className="ms-3 m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={clientForm.productDescription.value}
              onChange={e =>
                handleChange({ ...clientForm, productDescription: { value: e.target.value, error: clientForm.productDescription.error } })
              }
              label="Descrição do produto"
              name="product-description"
              className="m-2"
              sx={{ width: '30% !important' }}
            />
            <TextField
              value={clientForm.lotQuantity.value}
              onChange={e => handleChange({ ...clientForm, lotQuantity: { value: e.target.value, error: clientForm.lotQuantity.error } })}
              label="Quantidade do lote"
              name="lot-quantity"
              className="m-2"
              sx={{ width: '20% !important' }}
            />
            <TextField
              value={clientForm.rejectedQuantity.value}
              onChange={e =>
                handleChange({ ...clientForm, rejectedQuantity: { value: e.target.value, error: clientForm.rejectedQuantity.error } })
              }
              label="Quantidade rejeitada"
              name="rejected-quantity"
              className="m-2"
              sx={{ width: '20% !important' }}
            />
            <TextField
              value={clientForm.defectRate.value}
              onChange={e => handleChange({ ...clientForm, defectRate: { value: e.target.value, error: clientForm.defectRate.error } })}
              label="% defeito"
              name="defect-rate"
              className="m-2"
              sx={{ width: '10% !important' }}
            />
            <div style={{ width: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <IconButton>
                <UploadFileOutlined></UploadFileOutlined>
              </IconButton>
              <IconButton>
                <EditOutlined></EditOutlined>
              </IconButton>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <TextField label="Lote" name="lot" className="ms-3 m-2" sx={{ width: '20% !important' }} />
            <FormControl className="m-2">
              <DatePicker
                // locale='pt-BR'
                selected={clientForm.deliveryDate.value}
                onChange={date => handleChange({ ...clientForm, deliveryDate: { value: date, error: clientForm.deliveryDate.error } })}
                className="date-picker date-picker-rnc-client"
                id="date-picker-rnc-client"
              />
              <label htmlFor="date-picker-rnc-client" className="date-label">
                Data de entrega
              </label>
            </FormControl>
            <TextField
              value={clientForm.receipt.value}
              onChange={e => handleChange({ ...clientForm, receipt: { value: e.target.value, error: clientForm.receipt.error } })}
              label="Nota fiscal"
              name="receipt"
              className="m-2"
              sx={{ width: '20% !important' }}
            />
            <FormControl className="m-2">
              <DatePicker
                // locale='pt-BR'
                selected={clientForm.nfDate.value}
                onChange={date => handleChange({ ...clientForm, nfDate: { value: date, error: clientForm.nfDate.error } })}
                className="date-picker date-picker-rnc-client"
                id="date-picker-rnc-client-nf"
              />
              <label htmlFor="date-picker-rnc-client-nf" className="date-label date-label-nf">
                Data NF
              </label>
            </FormControl>
            <TextField
              value={clientForm.requestNumber.value}
              onChange={e =>
                handleChange({ ...clientForm, requestNumber: { value: e.target.value, error: clientForm.requestNumber.error } })
              }
              label="Número do pedido"
              name="request-number"
              className="m-2"
              sx={{ width: '20% !important' }}
            />
            <TextField
              value={clientForm.opNumber.value}
              onChange={e => handleChange({ ...clientForm, opNumber: { value: e.target.value, error: clientForm.opNumber.error } })}
              label="Número OP"
              name="op-number"
              className="m-2"
              sx={{ width: '20% !important' }}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default ClientRegister;
