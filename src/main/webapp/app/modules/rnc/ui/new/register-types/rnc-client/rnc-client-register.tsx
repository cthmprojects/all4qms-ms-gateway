import React, { useState, useEffect } from 'react';
import { Button, Card, Divider, FormControl, IconButton, TextField } from '@mui/material';
import './rnc-client-register.css';
import { EditOutlined, UploadFileOutlined } from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import { validateFields } from './fields-validate';
import { toast } from 'react-toastify';

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

  const handleChange = () => {
    if (validateFields(clientForm, setClientForm)) {
      onClientChange({
        name: clientForm.name.value,
        productCode: clientForm.productCode.value,
        productCode2: clientForm.productCode2.value,
        productDescription: clientForm.productDescription.value,
        lotQuantity: clientForm.lotQuantity.value,
        rejectedQuantity: clientForm.rejectedQuantity.value,
        defectRate: clientForm.defectRate.value,
        lot: clientForm.lot.value,
        deliveryDate: clientForm.deliveryDate.value,
        receipt: clientForm.receipt.value,
        nfDate: clientForm.nfDate.value,
        requestNumber: clientForm.requestNumber.value,
        opNumber: clientForm.opNumber.value,
      });
      toast.success('Origem salva com sucesso!');
    }
  };

  return (
    <>
      <Card>
        <h2 className="m-3">Cliente</h2>
        <Divider variant="middle" sx={{ marginRight: '0px !important', marginLeft: '0px !important' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: '100%' }} className="mt-3">
            <TextField
              label="Nome"
              name="name"
              className="ms-3 m-2"
              sx={{ width: '70% !important' }}
              value={clientForm.name.value}
              error={clientForm.name.error}
              onChange={e => setClientForm({ ...clientForm, name: { value: e.target.value, error: clientForm.name.error } })}
            />
            <TextField
              error={clientForm.productCode.error}
              value={clientForm.productCode.value}
              onChange={e => setClientForm({ ...clientForm, productCode: { value: e.target.value, error: clientForm.productCode.error } })}
              label="Código do produto"
              name="product-code"
              className="m-2"
              sx={{ width: '30% !important' }}
            />
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <TextField
              error={clientForm.productCode2.error}
              value={clientForm.productCode2.value}
              onChange={e =>
                setClientForm({ ...clientForm, productCode2: { value: e.target.value, error: clientForm.productCode2.error } })
              }
              label="Nome do fornecedor"
              name="product-code-2"
              className="ms-3 m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              error={clientForm.productDescription.error}
              value={clientForm.productDescription.value}
              onChange={e =>
                setClientForm({ ...clientForm, productDescription: { value: e.target.value, error: clientForm.productDescription.error } })
              }
              label="Descrição do produto"
              name="product-description"
              className="m-2"
              sx={{ width: '30% !important' }}
            />
            <TextField
              error={clientForm.lotQuantity.error}
              value={clientForm.lotQuantity.value}
              onChange={e => setClientForm({ ...clientForm, lotQuantity: { value: e.target.value, error: clientForm.lotQuantity.error } })}
              label="Quantidade do lote"
              name="lot-quantity"
              type="number"
              className="m-2"
              sx={{ width: '20% !important' }}
            />
            <TextField
              error={clientForm.rejectedQuantity.error}
              value={clientForm.rejectedQuantity.value}
              onChange={e =>
                setClientForm({ ...clientForm, rejectedQuantity: { value: e.target.value, error: clientForm.rejectedQuantity.error } })
              }
              label="Quantidade rejeitada"
              name="rejected-quantity"
              type="number"
              className="m-2"
              sx={{ width: '20% !important' }}
            />
            <TextField
              error={clientForm.defectRate.error}
              value={clientForm.defectRate.value}
              onChange={e => setClientForm({ ...clientForm, defectRate: { value: e.target.value, error: clientForm.defectRate.error } })}
              label="% defeito"
              name="defect-rate"
              className="m-2"
              type="number"
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
                onChange={date => setClientForm({ ...clientForm, deliveryDate: { value: date, error: clientForm.deliveryDate.error } })}
                className="date-picker date-picker-rnc-client"
                id="date-picker-rnc-client"
                dateFormat={'dd/MM/yyyy'}
              />
              <label htmlFor="date-picker-rnc-client" className="date-label">
                Data de entrega
              </label>
            </FormControl>
            <TextField
              value={clientForm.receipt.value}
              error={clientForm.receipt.error}
              onChange={e => setClientForm({ ...clientForm, receipt: { value: e.target.value, error: clientForm.receipt.error } })}
              label="Nota fiscal"
              name="receipt"
              className="m-2"
              sx={{ width: '20% !important' }}
            />
            <FormControl className="m-2">
              <DatePicker
                // locale='pt-BR'
                selected={clientForm.nfDate.value}
                onChange={date => setClientForm({ ...clientForm, nfDate: { value: date, error: clientForm.nfDate.error } })}
                className="date-picker date-picker-rnc-client"
                id="date-picker-rnc-client-nf"
                dateFormat={'dd/MM/yyyy'}
              />
              <label htmlFor="date-picker-rnc-client-nf" className="date-label date-label-nf">
                Data NF
              </label>
            </FormControl>
            <TextField
              value={clientForm.requestNumber.value}
              error={clientForm.requestNumber.error}
              onChange={e =>
                setClientForm({ ...clientForm, requestNumber: { value: e.target.value, error: clientForm.requestNumber.error } })
              }
              label="Número do pedido"
              name="request-number"
              className="m-2"
              type="number"
              sx={{ width: '20% !important' }}
            />
            <TextField
              value={clientForm.opNumber.value}
              error={clientForm.opNumber.error}
              onChange={e => setClientForm({ ...clientForm, opNumber: { value: e.target.value, error: clientForm.opNumber.error } })}
              label="Número OP"
              name="op-number"
              type="number"
              className="m-2"
              sx={{ width: '20% !important' }}
            />
          </div>
          <div className="m-2" style={{ display: 'flex', width: '100%', justifyContent: 'end' }}>
            <Button
              className="me-3 mb-3"
              variant="contained"
              color="primary"
              style={{ background: '#e6b200', color: '#4e4d4d' }}
              onClick={() => handleChange()}
            >
              Salvar
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ClientRegister;
