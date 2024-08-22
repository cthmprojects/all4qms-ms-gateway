import { Add, Delete } from '@mui/icons-material';
import { Fab, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useAppDispatch } from 'app/config/store';
import { ActionPlan, Option } from 'app/modules/rnc/models';
import { deleteAction } from 'app/modules/rnc/reducers/plan.reducer';
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
  const dispatch = useAppDispatch();
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [verification, setVerification] = useState<Date>(null);
  const [description, setDescription] = useState<string>('');
  const [responsible, setResponsible] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [verifier, setVerifier] = useState<string>('');

  const onDescription = value => {
    setDescription(value);
    onChanged({
      ...actionPlan,
      descricaoAcao: value,
      prazoAcao: deadline,
      dataVerificao: verification,
      idResponsavelAcao: parseInt(responsible),
      statusAcao: status,
      idResponsavelVerificaoAcao: parseInt(verifier),
    });
  };

  const onResponsible = value => {
    setResponsible(value);
    onChanged({
      ...actionPlan,
      idResponsavelAcao: parseInt(value),
      prazoAcao: deadline,
      dataVerificao: verification,
      statusAcao: status,
      idResponsavelVerificaoAcao: parseInt(verifier),
      descricaoAcao: description,
    });
  };

  const onStatus = value => {
    setStatus(value);
    onChanged({
      ...actionPlan,
      statusAcao: value,
      prazoAcao: deadline,
      dataVerificao: verification,
      idResponsavelAcao: parseInt(responsible),
      idResponsavelVerificaoAcao: parseInt(verifier),
      descricaoAcao: description,
    });
  };

  const onVerifier = value => {
    setVerifier(value);
    onChanged({
      ...actionPlan,
      idResponsavelVerificaoAcao: parseInt(value),
      prazoAcao: deadline,
      dataVerificao: verification,
      statusAcao: status,
      idResponsavelAcao: parseInt(responsible),
      descricaoAcao: description,
    });
  };

  const setVerificationDate = (date: Date) => {
    setVerification(date);
    setStatus('VISTO');
    onChanged({
      ...actionPlan,
      idResponsavelVerificaoAcao: parseInt(verifier),
      prazoAcao: deadline,
      dataVerificao: date,
      statusAcao: 'VISTO',
      idResponsavelAcao: parseInt(responsible),
      descricaoAcao: description,
    });
  };

  const removeAction = () => {
    dispatch(deleteAction(actionPlan.id));
    onRemoved();
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
          <div
            style={{
              transform: 'translateY(-19px)',
            }}
          >
            <span
              style={{
                top: '12px',
                position: 'relative',
                margin: '0px',
                padding: '0px 3px',
                width: 'fit-content',
                zIndex: '99',
                transform: 'translate(9px, -1px)',
                background: '#fff',
                color: '#00000099',
              }}
            >
              Prazo
            </span>
            <DatePicker
              // locale='pt-BR'
              selected={deadline}
              onChange={date => setDeadline(date)}
              className="date-picker"
              dateFormat={'dd/MM/yyyy'}
              id="date-picker-rnc-plano-acao-prazo"
            />
          </div>
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
          <Select label="Encaminhado para:" name="forwarded" disabled value={status}>
            <MenuItem value={'PENDENTE'}>PENDENTE</MenuItem>
            <MenuItem value={'VISTO'}>VISTO</MenuItem>
          </Select>
        </FormControl>

        <FormControl className="m-2 mt-0 ms-0 rnc-form-field">
          <div
            style={{
              transform: 'translateY(-19px)',
            }}
          >
            <span
              style={{
                top: '12px',
                position: 'relative',
                margin: '0px',
                padding: '0px 3px',
                width: 'fit-content',
                zIndex: '99',
                transform: 'translate(9px, -1px)',
                background: '#fff',
                color: '#00000099',
              }}
            >
              Verificação
            </span>
            <DatePicker
              // locale='pt-BR'
              selected={verification}
              onChange={date => setVerificationDate(date)}
              className="date-picker"
              dateFormat={'dd/MM/yyyy'}
              id="date-picker-rnc-plano-acao-prazo"
            />
          </div>
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
        <IconButton aria-label="Remover" onClick={_ => removeAction()}>
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
      dataVerificao: null,
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
