import { Button, Stack } from '@mui/material';
import { useAppSelector } from 'app/config/store';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { mapRiskOpportunity } from '../../mappers';
import { SummarizedProcess, SummarizedUser } from '../../models';
import Analysis from './analysis';
import ControlAction from './control-action';
import GeneralInformation from './general-information';

type BaseDetailsProps = {
  isOpportunity?: boolean;
  processes: Array<SummarizedProcess>;
  readonly?: boolean;
  users: Array<SummarizedUser>;
};

const BaseDetails = ({ isOpportunity, readonly }: BaseDetailsProps) => {
  let isAdmin = useAppSelector(state => state.authentication.account);
  const generalFormMethods = useForm({
    defaultValues: {
      activity: null,
      date: null,
      interestedParts: [],
      description: '',
      firstAuxiliaryDescription: '',
      secondAuxiliaryDescription: '',
      sender: isAdmin,
      type: !isOpportunity ? 'Risco' : 'Oportunidade',
      flow: '',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  // TODO: Caso precise de formulário no componente de analysis
  const analysisFormMethods = useForm({
    defaultValues: {},
    mode: 'all',
    reValidateMode: 'onChange',
  });

  generalFormMethods.formState.isValid;

  useEffect(() => {
    generalFormMethods.register('interestedParts', { min: 1, required: true });
    generalFormMethods.register('date', { required: true });
  }, []);

  const save = () => {
    const rawFormValue = generalFormMethods.getValues();
    const payload = {
      ...rawFormValue,
      senderId: rawFormValue.sender.id,
    };
    console.log(mapRiskOpportunity(payload as any));
  };

  return (
    <Stack spacing={2}>
      <FormProvider {...generalFormMethods}>
        <GeneralInformation isOpportunity={isOpportunity} readonly={readonly} />
      </FormProvider>

      {!isOpportunity && <ControlAction />}

      <Analysis />

      <Stack justifyContent="flex-end" gap="20px" flexDirection="row">
        <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={null}>
          Voltar
        </Button>
        <Button type="submit" onClick={save} variant="contained" color="primary" style={{ background: '#e6b200', color: '#4e4d4d' }}>
          Salvar
        </Button>
      </Stack>
    </Stack>
  );
};

export default BaseDetails;
