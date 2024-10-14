import { AddOutlined } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Decision } from 'app/modules/rnc/models/decision';
import { useEffect, useMemo, useState } from 'react';
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

    setDecisionType(initialData.type.toLowerCase());
    setResponsibles(initialData.responsibles?.split(';') ?? []);
    setDecision({ ...initialData });
  }, [initialData]);

  useEffect(() => {
    setDecision({ ...decision, responsibles: responsibles.join(';') });
  }, [responsibles]);

  const calculateRate = (a: number, b: number): number => {
    const total: number = a + b;

    if (total === 0) {
      return 0;
    }

    return b / total;
  };

  const rejectionRate = useMemo<number>(() => {
    if (!decision) {
      return 0;
    }

    const approved: number = decision?.approved ?? 0;
    const reproved: number = decision?.reproved ?? 0;

    return calculateRate(approved, reproved);
  }, [decision]);

  useEffect(() => {
    onChanged({ ...initialData, rejected: rejectionRate });
  }, [rejectionRate]);

  return (
    <div className="fake-card mt-3">
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
          onChange={event => onChanged({ ...initialData, description: event.target.value })}
          value={initialData.description}
          className="rnc-form-field me-2 mb-2"
          disabled={readonly}
        />

        <FormControl className="mb-2 rnc-form-field me-2">
          <DatePicker
            selected={new Date(initialData.date)}
            onChange={date => setDecision({ ...initialData, date: date })}
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
              onChange={event => onChanged({ ...initialData, current: parseInt(event.target.value) })}
              value={initialData.current}
              disabled={readonly}
            />
            <TextField
              label="Quantidade aprovada"
              className="m-2"
              sx={{ width: '20% !important' }}
              type="number"
              onChange={event => onChanged({ ...initialData, approved: parseInt(event.target.value) })}
              value={initialData.approved}
              disabled={readonly}
            />
            <TextField
              label="Quantidade reprovada"
              className="m-2"
              sx={{ width: '20% !important' }}
              type="number"
              onChange={event => onChanged({ ...initialData, reproved: parseInt(event.target.value) })}
              value={initialData.reproved}
              disabled={readonly}
            />
            <TextField
              label="% Rejeição"
              className="m-2"
              sx={{ width: '20% !important' }}
              type="number"
              onChange={event => onChanged({ ...initialData, rejected: parseInt(event.target.value) })}
              value={(calculateRate(initialData.approved, initialData.reproved) * 100).toFixed(2)}
              disabled
            />
          </Card>
        </div>
      </div>
      <br />
    </div>
  );
};

type ProductDecisionsProps = {
  allowAdding: boolean;
  decisions: Array<Decision>;
  onChanged: (decisions: Array<Decision>) => void;
  readonly?: boolean;
  title: string;
  users: Array<string>;
};

const ProductDecisions = ({ allowAdding, decisions, onChanged, title, users, readonly }: ProductDecisionsProps) => {
  useEffect(() => {
    if (decisions.length > 0) {
      return;
    }

    onAdded();
  }, [decisions]);

  const onAdded = (): void => {
    onChanged([
      ...decisions,
      {
        approved: 0,
        current: 0,
        date: new Date(),
        description: '',
        rejected: 0,
        reproved: 0,
        responsibles: '',
        rncId: 0,
        type: 'retrabalho',
      },
    ]);
  };

  const onProductDecisionChanged = (decision: Decision, index: number): void => {
    const newDecisions = [...decisions];
    newDecisions[index] = decision;
    onChanged(newDecisions);
  };

  return (
    <Card className="mt-3 mb-2">
      <CardContent>
        <Stack direction="row" spacing={2}>
          <Typography variant="h5">{title}</Typography>

          {allowAdding && (
            <Button
              onClick={() => {
                onAdded();
              }}
            >
              <AddOutlined />
            </Button>
          )}
        </Stack>
        {decisions.map((decision, index) => (
          <ProductDecision
            onChanged={decision => onProductDecisionChanged(decision, index)}
            title={title}
            users={users}
            initialData={decision}
            key={index}
            readonly={readonly}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default ProductDecisions;
