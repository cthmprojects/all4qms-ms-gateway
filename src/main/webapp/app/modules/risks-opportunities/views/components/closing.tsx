import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ClosingAction from './closing-action';

type ClosingProps = {
  readonly?: boolean;
};

const Closing = ({ readonly }: ClosingProps) => {
  const [implementedAt, setImplementedAt] = useState<Date>(new Date());
  const [verifiers, setVerifiers] = useState<Array<string>>(['Usuário 1', 'Usuário 2']);
  const [verifier, setVerifier] = useState<string>('');

  useEffect(() => {
    if (verifiers.length <= 0) {
      return;
    }

    setVerifier(verifiers[0]);
  }, [verifiers]);

  return (
    <Stack spacing={2}>
      <ClosingAction action="Implementação do plano" description="Descrição da implementação" readonly={readonly} />

      <ClosingAction action="Verificação da eficácia" description="Descrição da eficácia" readonly={readonly} />
    </Stack>
  );
};

export default Closing;
