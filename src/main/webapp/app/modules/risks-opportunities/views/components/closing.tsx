import { Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ClosingAction from './closing-action';
import { SummarizedUser } from '../../models';

type ClosingProps = {
  users: Array<SummarizedUser>;
  readonly?: boolean;
};

const Closing = ({ readonly, users }: ClosingProps) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Fechamento</Typography>

      <ClosingAction
        action="Implementação do plano"
        description="Descrição da implementação"
        isImplementation={true}
        readonly={readonly}
        users={users}
      />

      <ClosingAction action="Verificação da eficácia" description="Descrição da eficácia" readonly={readonly} users={users} />
    </Stack>
  );
};

export default Closing;
