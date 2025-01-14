import { Box, Fab, Stack, Typography } from '@mui/material';
import { SummarizedUser } from '../../models';
import { useFormContext, useFieldArray } from 'react-hook-form';
import ActionPlanForm from './action-plan-form';
import AddIcon from '@mui/icons-material/Add';

type ActionPlanProps = {
  users: Array<SummarizedUser>;
  readonly?: boolean;
  pathPrefix?: string;
};

const ActionPlan = ({ readonly, users, pathPrefix }: ActionPlanProps) => {
  const { control } = useFormContext();
  const { fields, prepend } = useFieldArray({ control, name: withPrefix('acoesPlano') as any });

  function withPrefix(prop: string) {
    return pathPrefix + prop;
  }

  const add = () => {
    prepend({
      statusAcao: 'PENDENTE',
      atualizadoEm: null,
      criadoEm: null,
      idAnexosExecucao: null,
      idPlano: null,
      planoId: null,
    });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Plano de ação</Typography>

      {!readonly && (
        <Box display="flex" justifyContent="end" position="relative">
          <Fab sx={{ position: 'absolute', top: '50px', marginRight: '10px' }} size="small" onClick={add}>
            <AddIcon />
          </Fab>
        </Box>
      )}

      <Stack paddingRight="100px" flexDirection="column" gap="32px">
        {fields.map((one, index) => (
          <ActionPlanForm key={one.id} readonly={readonly} users={users} prefix={withPrefix(`acoesPlano.${index}`)} />
        ))}
      </Stack>
    </Stack>
  );
};

export default ActionPlan;
