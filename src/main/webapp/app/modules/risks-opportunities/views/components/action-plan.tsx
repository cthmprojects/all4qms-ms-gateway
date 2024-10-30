import { Autocomplete, Box, Checkbox, Fab, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { SummarizedUser } from '../../models';
import { onAutocompleteChanged, onCheckboxChanged, onDateChanged } from '../../utils';
import { Controller, useFormContext, useWatch, useFieldArray } from 'react-hook-form';
import ActionPlanForm from './action-plan-form';
import AddIcon from '@mui/icons-material/Add';

type ActionPlanProps = {
  users: Array<SummarizedUser>;
  readonly?: boolean;
};

const ActionPlan = ({ readonly, users }: ActionPlanProps) => {
  const { control } = useFormContext();
  const { fields, prepend } = useFieldArray({ control, name: 'actions' as any });

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

      <Box display="flex" justifyContent="end" position="relative">
        <Fab sx={{ position: 'absolute', top: '50px', marginRight: '10px' }} onClick={add}>
          <AddIcon />
        </Fab>
      </Box>

      <Stack paddingRight="100px" flexDirection="column" gap="32px">
        {fields.map((one, index) => (
          <ActionPlanForm key={one.id} readonly={readonly} users={users} prefix={`actions.${index}`} />
        ))}
      </Stack>
    </Stack>
  );
};

export default ActionPlan;
