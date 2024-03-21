import { Add, Delete } from '@mui/icons-material';
import { Fab, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { ActionPlan, Option } from 'app/modules/rnc/models';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

type PlannedActionProps = {
  actionPlan: ActionPlan;
  onChanged: (actionPlan: ActionPlan) => void;
  onRemoved: () => void;
  statuses: Array<Option>;
  users: Array<{ id: number; login: string }>;
};

const PlannedAction = ({ actionPlan, onChanged, onRemoved, statuses, users }: PlannedActionProps) => {
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [description, setDescription] = useState<string>('');
  const [responsible, setResponsible] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [verifier, setVerifier] = useState<string>('');

  useEffect(() => {
    onChanged({
      dataConclusaoAcao: new Date(),
      dataVerificao: new Date(),
      descricaoAcao: description,
      idAnexosExecucao: 0,
      idPlano: 0,
      idResponsavelAcao: parseInt(responsible),
      idResponsavelVerificaoAcao: parseInt(verifier),
      planoId: 0,
      prazoAcao: deadline,
      statusAcao: status,
    });
  }, [deadline, description, responsible, status, verifier]);

  useEffect(() => {
    setDeadline(actionPlan.prazoAcao);
    setDescription(actionPlan.descricaoAcao);
    setResponsible(actionPlan.idResponsavelAcao.toString());
    setStatus(actionPlan.statusAcao);
    setVerifier(actionPlan.idResponsavelVerificaoAcao.toString());
  }, [actionPlan]);

  return (
    <>
      <TextField
        label="Descrição da ação"
        id="rnc-text-field"
        className="w-100 desc-width m-2"
        onChange={e => setDescription(e.target.value)}
      />
      <div style={{ display: 'flex', alignItems: 'center' }} className="mt-2 mb-2">
        <FormControl className="m-2 mt-0 rnc-form-field">
          <DatePicker
            // locale='pt-BR'
            label="Prazo"
            selected={deadline}
            onChange={date => setDeadline(date)}
            className="date-picker"
            dateFormat={'dd/MM/yyyy'}
            id="date-picker-rnc-plano-acao-prazo"
          />
        </FormControl>
        <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
          <InputLabel>Responsável</InputLabel>
          <Select label="Encaminhado para:" name="forwarded" onChange={e => setResponsible(e.target.value as string)}>
            {users.map((user, i) => (
              <MenuItem value={user.id} key={`user-${i}`}>
                {user.login}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
          <InputLabel>Status</InputLabel>
          <Select label="Encaminhado para:" name="forwarded" onChange={e => setStatus(e.target.value as string)}>
            {statuses.map(e => {
              return <MenuItem value={e.value}>{e.name}</MenuItem>;
            })}
          </Select>
        </FormControl>

        <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
          <InputLabel>Verificação</InputLabel>
          <Select label="Encaminhado para:" name="forwarded">
            <MenuItem value="Verificacao 1">Verificação 1</MenuItem>
            <MenuItem value="Verificacao 2">Verificação 2</MenuItem>
            <MenuItem value="Verificacao 3">Verificação 3</MenuItem>
          </Select>
        </FormControl>

        <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
          <InputLabel>Resp. verificação</InputLabel>
          <Select label="Encaminhado para:" name="forwarded" onChange={e => setVerifier(e.target.value as string)}>
            {users.map((user, i) => (
              <MenuItem value={user.id} key={`user-${i}`}>
                {user.login}
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
      {actionPlans.map((actionPlan, index) => (
        <PlannedAction
          actionPlan={actionPlan}
          onChanged={actionPlan => onChanged(actionPlan, index)}
          onRemoved={() => onRemoved(index)}
          statuses={statuses}
          users={users}
        />
      ))}
      <div>
        <Fab color="primary" aria-label="add" size="medium" className="btn-add-fab me-2" onClick={onAdded}>
          <Add />
        </Fab>
      </div>
    </>
  );
};

export default PlannedActions;
