import { Stack, Typography } from '@mui/material';
import ClosingAction from './closing-action';
import { SummarizedUser } from '../../models';

type ClosingProps = {
  users: Array<SummarizedUser>;
  readonly?: boolean;
  pathPrefix?: string;
};

const Closing = ({ readonly, users, pathPrefix }: ClosingProps) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Fechamento</Typography>

      <ClosingAction
        action="Implementação do plano"
        description="Descrição da implementação"
        isImplementation={true}
        readonly={readonly}
        users={users}
        pathPrefix={pathPrefix}
      />

      <ClosingAction
        action="Verificação da eficácia"
        description="Descrição da eficácia"
        readonly={readonly}
        users={users}
        pathPrefix={pathPrefix}
      />
    </Stack>
  );
};

export default Closing;
