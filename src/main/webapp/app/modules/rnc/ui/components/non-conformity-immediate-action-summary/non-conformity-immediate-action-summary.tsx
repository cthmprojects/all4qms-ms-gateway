import { Card, CardContent, CardHeader, Stack, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { NonConformityImmediateAction } from 'app/modules/rnc/models';
import React, { useEffect, useState } from 'react';

type NonConformityImmediateActionSummaryProps = {
  immediateAction: NonConformityImmediateAction | null;
};

const NonConformityImmediateActionSummary = ({ immediateAction }: NonConformityImmediateActionSummaryProps) => {
  const [responsibleName, setResponsibleName] = useState<string>('');

  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.all4qmsmsgateway.users.entities);

  useEffect(() => {
    dispatch(getUsers({}));
  }, []);

  useEffect(() => {
    if (!immediateAction || users.length <= 0) {
      return;
    }

    const responsibleId: number = immediateAction.idResponsavelAcaoImediata;
    const responsible = filterUser(responsibleId);

    setResponsibleName(responsible?.nome ?? '');
  }, [immediateAction, users]);

  const filterUser = (id: number) => {
    const filteredUsers = users.filter(user => user.id === id);
    return filteredUsers.length > 0 ? filteredUsers[0] : null;
  };

  const formatTimestamp = (timestamp: Date | null): string => {
    if (!timestamp) {
      return '';
    }

    const date: Date = new Date(timestamp);
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();

    const yearStr: string = year.toString().padStart(4, '0');
    const monthStr: string = month.toString().padStart(2, '0');
    const dayStr: string = day.toString().padStart(2, '0');

    return `${dayStr}/${monthStr}/${yearStr}`;
  };

  return (
    <Card>
      <CardHeader title="Ação imediata / Disposição para conter a NC" />
      <CardContent>
        <Stack spacing={2}>
          <TextField
            disabled
            label="Descrição da ação"
            placeholder="Descrição da ação"
            value={immediateAction?.descricaoAcaoImediata ?? ''}
          />

          <Stack direction="row" spacing={2}>
            <TextField disabled label="Prazo" placeholder="Prazo" value={formatTimestamp(immediateAction?.prazoAcaoImediata)} />

            <TextField disabled label="Responsável" placeholder="Responsável" value={responsibleName} />

            <TextField disabled label="Status" placeholder="Status" value={immediateAction?.statusAcaoImediata ?? ''} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformityImmediateActionSummary;
