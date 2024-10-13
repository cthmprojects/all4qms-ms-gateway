import { Card, CardContent, CardHeader, Stack, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { Enums, NonConformity } from 'app/modules/rnc/models';
import { getProcesses } from 'app/modules/rnc/reducers/process.reducer';
import { useCallback, useEffect, useState } from 'react';

type NonConformitySummaryProps = {
  enums: Enums | null;
  nonConformity: NonConformity | null;
};

const NonConformitySummary = ({ enums, nonConformity }: NonConformitySummaryProps) => {
  const [emitterName, setEmitterName] = useState<string>('');
  const [emitterProcessName, setEmitterProcessName] = useState<string>('');
  const [receiverName, setReceiverName] = useState<string>('');
  const [receiverProcessName, setReceiverProcessName] = useState<string>('');

  const dispatch = useAppDispatch();
  const processes = useAppSelector(state => state.all4qmsmsgateway.process.entities);
  const users = useAppSelector(state => state.all4qmsmsgateway.users.entities);

  useEffect(() => {
    if (!nonConformity) {
      return;
    }

    dispatch(getUsers({}));
    dispatch(getProcesses());
  }, [nonConformity]);

  useEffect(() => {
    if (!nonConformity || processes.length <= 0) {
      return;
    }

    const emitterProcessId: number = nonConformity.processoEmissor;
    const emitterProcess = filterProcess(emitterProcessId);

    const receiverProcessId: number = nonConformity.idReceptorNC;
    const receiverProcess = filterProcess(receiverProcessId);

    setEmitterProcessName(emitterProcess?.nome ?? '');
    setReceiverProcessName(receiverProcess?.nome ?? '');
  }, [nonConformity, processes]);

  useEffect(() => {
    if (!nonConformity || users.length <= 0) {
      return;
    }

    const emitterId: number = nonConformity.idEmissorNC;
    const emitter = filterUser(emitterId);

    const receiverId: number = nonConformity.idReceptorNC;
    const receiver = filterUser(receiverId);

    setEmitterName(emitter?.nome ?? '');
    setReceiverName(receiver?.nome ?? '');
  }, [nonConformity, users]);

  const formatOrigin = useCallback(
    (origin: string): string => {
      if (!enums || !enums.originTypes || enums.originTypes.length <= 0) {
        return '';
      }

      return enums.originTypes.find(o => o.name === origin)?.value ?? '';
    },
    [enums]
  );

  const filterProcess = (id: number) => {
    const filteredProcesses = processes.filter(process => process.id === id);
    return filteredProcesses.length > 0 ? filteredProcesses[0] : null;
  };

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
    const hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    const seconds: number = date.getSeconds();

    const yearStr: string = year.toString().padStart(4, '0');
    const monthStr: string = month.toString().padStart(2, '0');
    const dayStr: string = day.toString().padStart(2, '0');
    const hoursStr: string = hours.toString().padStart(2, '0');
    const minutesStr: string = minutes.toString().padStart(2, '0');
    const secondsStr: string = seconds.toString().padStart(2, '0');

    return `${yearStr}/${monthStr}/${dayStr} ${hoursStr}:${minutesStr}:${secondsStr}`;
  };

  return (
    <Card>
      <CardHeader title="Visualização" />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField disabled label="Nº" placeholder="Nº" value={nonConformity?.numNC ?? ''} />
            <TextField disabled label="Emitido por" placeholder="Emitido por" value={emitterName} />
            <TextField disabled label="Processo ou Empresa" placeholder="Processo ou Empresa" value={emitterProcessName} />
            <TextField disabled label="Encaminhado para" placeholder="Encaminhado para" value={receiverName} />
            <TextField disabled label="Processo ou Empresa" placeholder="Processo ou Empresa" value={receiverProcessName} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField disabled label="Data" placeholder="Data" value={formatTimestamp(nonConformity?.dtNC)} />
            <TextField disabled label="Tipo" placeholder="Tipo" value={nonConformity?.tipoNC ?? ''} />
            <TextField disabled label="Origem" placeholder="Origem" value={formatOrigin(nonConformity?.origemNC)} />
            <TextField disabled label="Qtd porquês" placeholder="Qtd porquês" value={nonConformity?.qtdPorques ?? ''} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NonConformitySummary;
