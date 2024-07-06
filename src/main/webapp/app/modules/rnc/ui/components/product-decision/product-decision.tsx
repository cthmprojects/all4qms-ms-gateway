import {
  Card,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Decision } from 'app/modules/rnc/models/decision';
import { initial } from 'lodash';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

type ProductDecisionProps = {
  initialData?: Decision;
  onChanged: (decision: Decision) => void;
  readonly?: boolean;
  title: string;
  users: Array<string>;
};

const ProductDecision = ({ initialData, onChanged, readonly, title, users }: ProductDecisionProps) => {
  const [decision, setDecision] = useState<Decision>({
    approved: 0,
    current: 0,
    date: new Date(),
    description: '',
    rejected: 0,
    reproved: 0,
    responsibles: '',
    rncId: 0,
    type: 'retrabalho',
  });
  const [decisionType, setDecisionType] = useState<string>('');
  const [responsibles, setResponsibles] = useState<Array<string>>([]);

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setDecisionType(initialData.type);
    setResponsibles(initialData.responsibles.split(';'));
    setDecision({ ...initialData });
  }, [initialData]);

  useEffect(() => {
    onChanged(decision);
  }, [decision]);

  useEffect(() => {
    setDecision({ ...decision, responsibles: responsibles.join(';') });
  }, [responsibles]);

  return (
    <div className="fake-card mt-3">
      <Typography variant="h5" component="div">
        {title}
      </Typography>
      <br />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="mt-2 mb-2">
        <FormControl className="mb-2 rnc-form-field me-2" sx={{ display: 'flex', maxWidth: '40%' }} disabled={readonly}>
          <InputLabel>Decisão</InputLabel>
          <Select
            label="Decisão"
            name="decision"
            value={decisionType}
            onChange={event => {
              const type: string = event.target.value;
              setDecision({ ...decision, type: type });
              setDecisionType(type);
            }}
          >
            <MenuItem value="retrabalho">Retrabalho</MenuItem>
            <MenuItem value="seleção">Seleção</MenuItem>
          </Select>
        </FormControl>
        <TextField
          sx={{ height: '60px', maxWidth: '50% !important' }}
          label="Descrição da decisão"
          name="number"
          id="rnc-text-field"
          onChange={event => setDecision({ ...decision, description: event.target.value })}
          value={decision.description}
          className="rnc-form-field me-2 mb-2"
          disabled={readonly}
        />

        <FormControl className="mb-2 rnc-form-field me-2">
          <DatePicker
            selected={decision.date}
            onChange={date => setDecision({ ...decision, date: date })}
            className="date-picker"
            dateFormat={'dd/MM/yyyy'}
            id="date-picker-general-register"
            disabled={readonly}
          />
          <label htmlFor="" className="rnc-date-label">
            Data
          </label>
        </FormControl>
      </div>
      <br />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '196px' }} className="mt-2 mb-2">
        <Card
          className="p-3"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '30%',
            maxHeight: '194px !important',
            minHeight: '194px !important',
            overflowY: 'scroll',
          }}
        >
          <FormControl className="w-100 m-2" disabled={readonly}>
            <InputLabel>Responsáveis</InputLabel>
            <Select
              multiple
              value={responsibles}
              onChange={event => {
                const { value } = event.target;
                if (typeof value === 'string') {
                  setResponsibles(value.split(','));
                } else {
                  setResponsibles(value);
                }
              }}
              input={<OutlinedInput label="Responsáveis" />}
              renderValue={selected => selected.join(', ')}
            >
              {users.map((user, idx) => (
                <MenuItem value={user} key={`user-${idx}`}>
                  <Checkbox checked={responsibles.indexOf(user) > -1} />
                  <ListItemText primary={user} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Card>
        <div
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '60%', height: '100%' }}
          className="ms-3"
        >
          <Card className="p-2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextField
              label={`Quantidade ${decisionType === 'retrabalho' ? 'retrabalhada' : 'selecionada'}`}
              className="m-2"
              sx={{ width: '20% !important' }}
              type="number"
              onChange={event => setDecision({ ...decision, current: parseInt(event.target.value) })}
              value={decision.current}
              disabled={readonly}
            />
            <TextField
              label="Quantidade aprovada"
              className="m-2"
              sx={{ width: '20% !important' }}
              type="number"
              onChange={event => setDecision({ ...decision, approved: parseInt(event.target.value) })}
              value={decision.approved}
              disabled={readonly}
            />
            <TextField
              label="Quantidade reprovada"
              className="m-2"
              sx={{ width: '20% !important' }}
              type="number"
              onChange={event => setDecision({ ...decision, reproved: parseInt(event.target.value) })}
              value={decision.reproved}
              disabled={readonly}
            />
            <TextField
              label="% Rejeição"
              className="m-2"
              sx={{ width: '20% !important' }}
              type="number"
              onChange={event => setDecision({ ...decision, rejected: parseInt(event.target.value) })}
              value={decision.rejected}
              disabled={readonly}
            />
          </Card>
        </div>
      </div>
      <br />
    </div>
  );
};

export default ProductDecision;
