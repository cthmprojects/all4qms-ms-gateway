import { Add, Delete } from '@mui/icons-material';
import {
  Card,
  CardContent,
  Fab,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { useAppSelector } from 'app/config/store';
import { Action, Enums } from 'app/modules/rnc/models';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

type ImmediateActionProps = {
  action?: Action;
  onAdded?: (action: Action) => void;
  onRemoved?: (action: Action) => void;
  readonly?: boolean;
  users: Array<string>;
};

const ImmediateAction = ({ action, onAdded, onRemoved, readonly, users }: ImmediateActionProps) => {
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [description, setDescription] = useState<string>('');
  const [responsible, setResponsible] = useState<string>('');
  const [status, setStatus] = useState<string>('RETRABALHO');

  useEffect(() => {
    if (readonly && action) {
      setDeadline(action.deadline);
      setDescription(action.description);
      setResponsible(action.responsible);
      setStatus(action.status);
    }
  }, [action, readonly]);

  const canAddAction = (): boolean => {
    let value: boolean = true;

    if (!description || description.length === 0) {
      value = false;
    }

    if (!responsible || responsible.length === 0) {
      value = false;
    }

    if (!deadline) {
      value = false;
    }

    return value;
  };

  const clearFields = (): void => {
    setDeadline(new Date());
    setDescription('');
    setResponsible('');
    setStatus('');
  };

  const onActionAdded = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const action: Action = {
      deadline: deadline,
      description: description,
      responsible: responsible,
      status: status,
    };

    onAdded(action);
    clearFields();
  };

  const onActionRemoved = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (!action) {
      return;
    }

    onRemoved(action);
  };

  const onDescriptionChanged = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setDescription(value);
  };

  const onDeadlineChanged = (event: any): void => {
    setDeadline(event);
  };

  const onResponsibleChanged = (event: SelectChangeEvent<any>, _: React.ReactNode): void => {
    const { value } = event.target;
    setResponsible(value);
  };

  const onStatusChanged = (event: SelectChangeEvent<any>, _: React.ReactNode): void => {
    const { value } = event.target;
    setStatus(value);
  };

  const enums = useAppSelector<Enums | null>(state => state.all4qmsmsgateway.enums.enums);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }} className="w-100">
        <div style={{ display: 'flex', flexDirection: 'column' }} className="mt-2 w-100">
          <textarea
            className="textarea-ishikawa"
            cols={30}
            disabled={readonly}
            name="ncArea"
            placeholder="Descrição da ação"
            onChange={onDescriptionChanged}
            rows={5}
            style={{ padding: '8px 12px' }}
            value={description}
          />
          <div style={{ display: 'flex', alignItems: 'center' }} className="mt-2 mb-2">
            <FormControl className="m-2 ms-0 mb-2">
              <DatePicker
                className="date-picker"
                dateFormat={'dd/MM/yyyy'}
                disabled={readonly}
                id="date-picker-rnc-acao-prazo"
                label="Prazo"
                onChange={onDeadlineChanged}
                selected={deadline}
              />
            </FormControl>
            <FormControl className="rnc-form-field m-2">
              <InputLabel>Responsável</InputLabel>
              <Select label="Responsável" name="forwarded" value={responsible} onChange={onResponsibleChanged} disabled={readonly}>
                {users.map((user, idx) => (
                  <MenuItem value={user} key={`user-${idx}`}>
                    {user}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <FormControl className="rnc-form-field m-2">
              <InputLabel>Status</InputLabel>
              <Select label="Status" name="forwarded" value={status} onChange={onStatusChanged} disabled={readonly}>
                {enums?.immediateActionTypes.map((type, idx) => (
                  <MenuItem value={type.name} key={`type-${idx}`}>
                    {type.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            {/* <TextField
              className="m-2 rnc-form-field"
              disabled={readonly}
              id="rnc-text-field"
              label="Status"
              onChange={onStatusChanged}
              sx={{ width: '20% !important' }}
              value={status}
            /> */}
          </div>
        </div>
        {!readonly && (
          <Fab color="primary" aria-label="add" size="medium" className="ms-3" disabled={!canAddAction()} onClick={onActionAdded}>
            <Add />
          </Fab>
        )}
        {readonly && (
          <IconButton aria-label="Remover" onClick={onActionRemoved}>
            <Delete fontSize="medium" />
          </IconButton>
        )}
      </div>
    </>
  );
};

type ImmediateActionsProps = {
  actions: Array<Action>;
  onAdded: (action: Action) => void;
  onRemoved: (action: Action) => void;
  users: Array<string>;
};

const ImmediateActions = ({ actions, onAdded, onRemoved, users }: ImmediateActionsProps) => {
  const onActionAdded = (action: Action): void => {
    onAdded(action);
  };

  const onActionRemoved = (action: Action): void => {
    onRemoved(action);
  };

  return (
    <Card sx={{ minWidth: 275 }} className="mt-3">
      <CardContent>
        <Typography variant="h5" component="div">
          Ação Imediata / Disposição para conter a NC
        </Typography>

        <ImmediateAction onAdded={onActionAdded} users={users} />

        {actions?.length > 0 &&
          actions.map((action, index) => (
            <ImmediateAction action={action} key={`immediate-action-${index}`} onRemoved={onActionRemoved} readonly users={users} />
          ))}
      </CardContent>
    </Card>
  );
};

export default ImmediateActions;
