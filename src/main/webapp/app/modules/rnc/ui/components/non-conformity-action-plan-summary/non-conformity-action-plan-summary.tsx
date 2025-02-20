import { Card, CardContent, CardHeader, Stack, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { NonConformityActionPlan } from 'app/modules/rnc/models';
import React, { useEffect } from 'react';

type NonConformityActionPlanSummaryProps = {
  actionPlan: NonConformityActionPlan | null;
};

const NonConformityActionPlanSummary = ({ actionPlan }: NonConformityActionPlanSummaryProps) => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.all4qmsmsgateway.users.entities);

  useEffect(() => {
    dispatch(getUsers({}));
  }, []);

  const filterUser = (id: number | null) => {
    if (!id) {
      return '';
    }

    const filteredUsers = users.filter(user => user.id === id);
    return filteredUsers.length > 0 ? filteredUsers[0] : null;
  };

  const getUserName = (id: number): string => {
    const user = filterUser(id);

    return user?.nome ?? '';
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
      <CardHeader title="Plano de Ação Corretiva" />
      <CardContent>
        <Stack spacing={2}>
          {actionPlan.acoes.map((a, index) => (
            <Stack spacing={2} key={index}>
              <TextField disabled label="Descrição da Ação" placeholder="Descrição da Ação" value={a?.descricaoAcao ?? ''} />

              <Stack direction="row" spacing={2}>
                <TextField disabled label="Prazo" placeholder="Prazo" value={formatTimestamp(a?.prazoAcao)} />
                <TextField disabled label="Responsável" placeholder="Responsável" value={getUserName(a?.idResponsavelAcao)} />
                <TextField disabled label="Status" placeholder="Status" value={a?.statusAcao ?? ''} />
                <TextField disabled label="Verificação" placeholder="Verificação" value={formatTimestamp(a?.dataVerificao)} />
                <TextField
                  disabled
                  label="Responsável verificação"
                  placeholder="Responsável verificação"
                  value={getUserName(a?.idResponsavelVerificaoAcao)}
                />
              </Stack>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformityActionPlanSummary;
