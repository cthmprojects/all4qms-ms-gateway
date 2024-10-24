import { Add, Delete } from '@mui/icons-material';
import { Fab, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { ActionPlan, Option } from 'app/modules/rnc/models';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

type PlannedActionProps = {
  actionPlan: ActionPlan;
  onChanged: (actionPlan: ActionPlan) => void;
  onRemoved: () => void;
  statuses: Array<Option>;
  users: Array<any>;
};

const PlannedAction = ({ actionPlan, onChanged, onRemoved, statuses, users }: PlannedActionProps) => {
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [verification, setVerification] = useState<Date>(new Date());
  const [description, setDescription] = useState<string>('');
  const [responsible, setResponsible] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [verifier, setVerifier] = useState<string>('');

  const onDescription = value => {
    setDescription(value);
    onChanged({ ...actionPlan, descricaoAcao: value });
  };

  const onResponsible = value => {
    setResponsible(value);
    onChanged({ ...actionPlan, idResponsavelAcao: parseInt(value) });
  };

  const onStatus = value => {
    setStatus(value);
    onChanged({ ...actionPlan, statusAcao: value });
  };

  const onVerifier = value => {
    setVerifier(value);
    onChanged({ ...actionPlan, idResponsavelVerificaoAcao: parseInt(value) });
  };

  useEffect(() => {
    setDeadline(actionPlan.prazoAcao);
    setDescription(actionPlan.descricaoAcao);
    setResponsible(actionPlan.idResponsavelAcao.toString());
    setStatus(actionPlan.statusAcao);
    setVerifier(actionPlan.idResponsavelVerificaoAcao.toString());
    setVerification(actionPlan.dataVerificao);
  }, [actionPlan]);

  return (
    <>
      <TextField
        label="Descrição da ação"
        id="rnc-text-field"
        className="w-100 desc-width m-2"
        onChange={e => onDescription(e.target.value)}
        value={description}
      />
      <div style={{ display: 'flex', alignItems: 'center' }} className="mt-2 mb-2">
        <FormControl className="m-2 mt-0 rnc-form-field">
          <DatePicker
            // locale='pt-BR'
            label="Prazo"
            selected={deadline}
            onChange={date => setDeadline(date)}
            value={deadline}
            className="date-picker"
            dateFormat={'dd/MM/yyyy'}
            id="date-picker-rnc-plano-acao-prazo"
          />
        </FormControl>
        <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
          <InputLabel>Responsável</InputLabel>
          <Select label="Encaminhado para:" name="forwarded" onChange={e => onResponsible(e.target.value as string)} value={responsible}>
            {users.map((user, i) => (
              <MenuItem value={user.id} key={`user-${i}`}>
                {user.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
          <InputLabel>Status</InputLabel>
          <Select label="Encaminhado para:" name="forwarded" onChange={e => onStatus(e.target.value as string)} value={status}>
            {statuses.map(e => {
              return <MenuItem value={e.value}>{e.name}</MenuItem>;
            })}
          </Select>
        </FormControl>

        <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
          <DatePicker
            // locale='pt-BR'
            label="Verificação"
            selected={verification}
            onChange={date => setVerification(date)}
            value={verification}
            className="date-picker"
            dateFormat={'dd/MM/yyyy'}
            id="date-picker-rnc-plano-acao-prazo"
          />
        </FormControl>

        <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
          <InputLabel>Resp. verificação</InputLabel>
          <Select label="Encaminhado para:" name="forwarded" onChange={e => onVerifier(e.target.value as string)} value={verifier}>
            {users.map((user, i) => (
              <MenuItem value={user.id} key={`user-${i}`}>
                {user.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton aria-label="Remover" onClick={_ => onRemoved()}>
          <Delete fontSize="medium" />
        </IconButton>
      </div>
    </>
  );
};

type PlannedActionsProps = {
  actionPlans: Array<ActionPlan>;
  onUpdated: (actionPlans: Array<ActionPlan>) => void;
  statuses: Array<Option>;
  users: Array<{ id: number; login: string }>;
};

const PlannedActions = ({ actionPlans, onUpdated, statuses, users }: PlannedActionsProps) => {
  useEffect(() => {}, [actionPlans]);
  const onAdded = (_: React.MouseEvent<HTMLButtonElement>): void => {
    const newActionPlans: Array<ActionPlan> = [...actionPlans];
    newActionPlans.push({
      dataConclusaoAcao: new Date(),
      dataVerificao: new Date(),
      descricaoAcao: '',
      idAnexosExecucao: 0,
      idPlano: 0,
      idResponsavelAcao: 0,
      idResponsavelVerificaoAcao: 0,
      planoId: 0,
      prazoAcao: new Date(),
      statusAcao: statuses[0].value,
    });
    onUpdated(newActionPlans);
  };

  const onChanged = (actionPlan: ActionPlan, index: number): void => {
    const newActionPlans: Array<ActionPlan> = [];

    for (let i = 0; i < actionPlans.length; i++) {
      if (index !== i) {
        newActionPlans.push(actionPlans[i]);
      } else {
        newActionPlans.push(actionPlan);
      }
    }

    onUpdated(newActionPlans);
  };

  const onRemoved = (index: number): void => {
    const newActionPlans: Array<ActionPlan> = [];

    for (let i = 0; i < actionPlans.length; i++) {
      if (index !== i) {
        newActionPlans.push(actionPlans[i]);
      }
    }

    onUpdated(newActionPlans);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          Plano de Ação Corretiva
        </Typography>
        <Fab aria-label="add" size="medium" className="btn-add-fab me-2 ms-2" onClick={onAdded}>
          <Add />
        </Fab>
      </div>
      {actionPlans.map((actionPlan, index) => (
        <PlannedAction
          actionPlan={actionPlan}
          onChanged={actionPlan => onChanged(actionPlan, index)}
          onRemoved={() => onRemoved(index)}
          statuses={statuses}
          users={users}
        />
      ))}
    </>
  );
};

export default PlannedActions;
