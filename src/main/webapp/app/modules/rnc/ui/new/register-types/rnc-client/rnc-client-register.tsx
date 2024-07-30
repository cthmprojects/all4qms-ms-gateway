import { Card, Divider, FormControl, TextField } from '@mui/material';
import { RncClient } from 'app/modules/rnc/models';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import './rnc-client-register.css';

// TODO: Receber os dados do cliente e preencher os campos
// TODO: Validação de error dos campos

type ClientProps = {
  initialData?: RncClient | null;
  onChanged: (client: RncClient) => void;
};

export const ClientRegister = ({ initialData, onChanged }: ClientProps) => {
  const [client, setClient] = useState<RncClient>({
    batch: '',
    batchAmount: 0,
    code: '',
    defects: 0,
    description: '',
    name: '',
    opNumber: '',
    order: '',
    productName: '',
    rejected: 0,
    requestNumber: 0,
    samples: 0,
    supplier: '',
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

    setClient({
      batch: initialData.batch,
      batchAmount: initialData.batchAmount,
      code: initialData.code,
      defects: initialData.defects,
      description: initialData.description,
      name: initialData.name,
      opNumber: initialData.opNumber,
      order: initialData.order,
      productName: initialData.productName,
      rejected: initialData.rejected,
      requestNumber: initialData.requestNumber,
      samples: initialData.samples,
      supplier: initialData.supplier,
      traceability: {
        deliveredAt: new Date(initialData.traceability.deliveredAt),
        identifier: initialData.traceability.identifier,
        date: new Date(initialData.traceability.date),
        rncId: initialData.traceability.rncId,
      },
    });
  }, [initialData]);

  useEffect(() => {
    onChanged(client);
  }, [client]);

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
              value={client.name}
              onChange={e => setClient({ ...client, name: e.target.value })}
            />
            <TextField
              value={client.code}
              onChange={e => setClient({ ...client, code: e.target.value })}
              label="Código do produto"
              name="product-code"
              className="m-2"
              sx={{ width: '30% !important' }}
            />
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <TextField
              value={client.supplier}
              onChange={e => setClient({ ...client, supplier: e.target.value })}
              label="Nome do fornecedor"
              name="product-code-2"
              className="ms-3 m-2"
              sx={{ width: '10% !important' }}
            />
            <TextField
              value={client.description}
              onChange={e => setClient({ ...client, description: e.target.value })}
              label="Descrição do produto"
              name="product-description"
              className="m-2"
              sx={{ width: '30% !important' }}
            />
            <TextField
              value={client.batchAmount}
              onChange={e => setClient({ ...client, batchAmount: parseInt(e.target.value) })}
              label="Quantidade do lote"
              name="lot-quantity"
              type="number"
              className="m-2"
              sx={{ width: '20% !important' }}
            />
            <TextField
              value={client.rejected}
              onChange={e => setClient({ ...client, rejected: parseInt(e.target.value) })}
              label="Quantidade rejeitada"
              name="rejected-quantity"
              type="number"
              className="m-2"
              sx={{ width: '20% !important' }}
            />
            <TextField
              value={client.defects}
              onChange={e => setClient({ ...client, defects: parseInt(e.target.value) })}
              label="% defeito"
              name="defect-rate"
              className="m-2"
              type="number"
              sx={{ width: '10% !important' }}
            />
            {/* <div style={{ width: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <IconButton>
                <UploadFileOutlined></UploadFileOutlined>
              </IconButton>
              <IconButton>
                <EditOutlined></EditOutlined>
              </IconButton>
            </div> */}
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <TextField label="Lote" name="lot" className="ms-3 m-2" sx={{ width: '20% !important' }} />
            <FormControl className="m-2">
              <DatePicker
                // locale='pt-BR'
                selected={client.traceability.deliveredAt}
                onChange={date => setClient({ ...client, traceability: { ...client.traceability, deliveredAt: date } })}
                className="date-picker date-picker-rnc-client"
                id="date-picker-rnc-client"
                dateFormat={'dd/MM/yyyy'}
              />
              <label htmlFor="date-picker-rnc-client" className="date-label">
                Data de entrega
              </label>
            </FormControl>
            <TextField
              value={client.traceability.identifier}
              onChange={e => setClient({ ...client, traceability: { ...client.traceability, identifier: e.target.value } })}
              label="Nota fiscal"
              name="receipt"
              className="m-2"
              sx={{ width: '20% !important' }}
            />
            <FormControl className="m-2">
              <DatePicker
                // locale='pt-BR'
                selected={client.traceability.date}
                onChange={date => setClient({ ...client, traceability: { ...client.traceability, date: date } })}
                className="date-picker date-picker-rnc-client"
                id="date-picker-rnc-client-nf"
                dateFormat={'dd/MM/yyyy'}
              />
              <label htmlFor="date-picker-rnc-client-nf" className="date-label date-label-nf">
                Data NF
              </label>
            </FormControl>
            <TextField
              value={client.requestNumber}
              onChange={e => setClient({ ...client, requestNumber: parseInt(e.target.value) })}
              label="Número do pedido"
              name="request-number"
              className="m-2"
              type="number"
              sx={{ width: '20% !important' }}
            />
            <TextField
              value={client.opNumber}
              onChange={e => setClient({ ...client, opNumber: e.target.value })}
              label="Número OP"
              name="op-number"
              type="number"
              className="m-2"
              sx={{ width: '20% !important' }}
            />
          </div>
          {/* <div className="m-2" style={{ display: 'flex', width: '100%', justifyContent: 'end' }}>
            <Button
              className="me-3 mb-3"
              variant="contained"
              color="primary"
              style={{ background: '#e6b200', color: '#4e4d4d' }}
              onClick={() => handleChange()}
            >
              Salvar
            </Button>
          </div> */}
        </div>
      </Card>
    </>
  );
};

export default ClientRegister;
