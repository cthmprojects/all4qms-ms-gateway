import { Button, Stack } from '@mui/material';
import { useAppSelector } from 'app/config/store';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  mapCompleteAnalysisToActionPlanEfficacy,
  mapCompleteAnalysisToActionPlanImplementation,
  mapCompleteAnalysisToActionPlanSummary,
  mapCompleteAnalysisToIshikawa,
  mapCompleteAnalysisToReasons,
  mapCompleteToAnalysisDetails,
  mapRiskOpportunity,
} from '../../mappers';
import {
  ActionPlanEfficacy,
  ActionPlanImplementation,
  ActionPlanSummary,
  AnalysisDetails,
  CompleteAnalysis,
  Configuration,
  ControlActionSummary,
  Enums,
  Ishikawa,
  RawMap,
  RawRiskOpportunity,
  Reason,
  SummarizedProcess,
  SummarizedUser,
} from '../../models';
import Analysis from './analysis';
import ControlAction from './control-action';
import GeneralInformation from './general-information';

type BaseDetailsProps = {
  enums: Enums;
  firstConfigurations: Array<Configuration>;
  isOpportunity?: boolean;
  map: RawMap | null;
  processes: Array<SummarizedProcess>;
  readonly?: boolean;
  riskOpportunity?: RawRiskOpportunity;
  secondConfigurations: Array<Configuration>;
  users: Array<SummarizedUser>;
  onBack: () => void;
  onSave?: (
    senderId: number,
    efficacy: ActionPlanEfficacy,
    implementation: ActionPlanImplementation,
    actionPlanSummary: ActionPlanSummary,
    ishikawa: Ishikawa | null,
    reasons: Reason | null,
    details: AnalysisDetails,
    interestedParts: Array<string>,
    rawRiskOpportunity: RawRiskOpportunity
  ) => void;
};

const BaseDetails = ({
  enums,
  firstConfigurations,
  isOpportunity,
  map,
  processes,
  readonly,
  riskOpportunity,
  secondConfigurations,
  users,
  onBack,
  onSave,
}: BaseDetailsProps) => {
  let isAdmin = useAppSelector(state => state.authentication.account);

  const generalFormMethods = useForm({
    defaultValues: {
      activity: '',
      date: null,
      interestedParts: [],
      description: '',
      firstAuxiliaryDescription: '',
      secondAuxiliaryDescription: '',
      sender: isAdmin,
      type: !isOpportunity ? 'Risco' : 'Oportunidade',
      flow: '',
      process: null,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const controlActionFormMethods = useForm({
    defaultValues: {
      description: '',
      probability: null,
      severity: null,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const analysisFormMethods = useForm({
    defaultValues: {
      description: '',
      meaning: '',
      probability: null,
      severity: null,
      useIshikawa: false,
      ishikawaCause: '',
      environment: '',
      manpower: '',
      machine: '',
      measurement: '',
      method: '',
      rawMaterial: '',
      useReasons: true,
      reasonCause: '',
      reasonEffect: '',
      reason1: '',
      reason2: '',
      reason3: '',
      reason4: '',
      reason5: '',
      actionDescription: '',
      actionDate: new Date(),
      responsibleId: null,
      verifyAction: false,
      actionVerificationDate: new Date(),
      actionVerifierId: null,
      implementationDate: new Date(),
      implementationResponsibleId: null,
      implemented: false,
      implementationDescription: '',
      efficacyVerificationDate: new Date(),
      efficacyResponsibleId: null,
      efficacyVerified: false,
      efficacyDescription: '',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  generalFormMethods.formState.isValid;

  const filterConfiguration = (id: number, configurations: Array<Configuration>): Configuration | null => {
    if (id <= 0 || !configurations || configurations.length <= 0) {
      return null;
    }

    const filteredConfigurations: Array<Configuration> = configurations.filter(c => c.id === id);
    return filteredConfigurations.length > 0 ? filteredConfigurations[0] : null;
  };

  useEffect(() => {
    generalFormMethods.register('interestedParts', { min: 1, required: true });
    generalFormMethods.register('date', { required: true });
  }, []);

  useEffect(() => {
    if (!generalFormMethods || !riskOpportunity) {
      return;
    }

    generalFormMethods.setValue('activity', riskOpportunity.nomeAtividade);
    generalFormMethods.setValue('date', new Date(riskOpportunity.dataRegistro));
    generalFormMethods.setValue('description', riskOpportunity.descricao1);
    generalFormMethods.setValue('firstAuxiliaryDescription', riskOpportunity.descricao2);
    generalFormMethods.setValue('flow', riskOpportunity.nomeFluxo);
    generalFormMethods.setValue(
      'interestedParts',
      riskOpportunity.partesInteressadas ? [riskOpportunity.partesInteressadas.nomeParteInteressada] : []
    );
    generalFormMethods.setValue('secondAuxiliaryDescription', riskOpportunity.descricao3);
    generalFormMethods.setValue('type', riskOpportunity.tipoRO === 'R' ? 'Risco' : 'Oportunidade');

    const filteredUsers: Array<SummarizedUser> = users.filter(u => u.id === riskOpportunity.idEmissor);
    const user: SummarizedProcess | null = filteredUsers.length > 0 ? filteredUsers[0] : null;
    generalFormMethods.setValue('sender', user);

    const filteredProcesses: Array<SummarizedProcess> = processes.filter(p => p.id === riskOpportunity.idProcesso);
    const process: SummarizedProcess | null = filteredProcesses.length > 0 ? filteredProcesses[0] : null;
    generalFormMethods.setValue('process', process);
  }, [generalFormMethods, processes, users, riskOpportunity]);

  useEffect(() => {
    generalFormMethods.register('interestedParts', { min: 1, required: true });
    generalFormMethods.register('date', { required: true });
  }, []);

  useEffect(() => {
    if (!controlActionFormMethods || !riskOpportunity) {
      return;
    }

    controlActionFormMethods.setValue('description', riskOpportunity.descricaoControle);
    const probability: Configuration = filterConfiguration(riskOpportunity.linhaConfigControle1?.id ?? 0, firstConfigurations);
    const severity: Configuration = filterConfiguration(riskOpportunity.linhaConfigControle2?.id ?? 0, secondConfigurations);

    controlActionFormMethods.setValue('probability', probability);
    controlActionFormMethods.setValue('severity', severity);
  }, [controlActionFormMethods, riskOpportunity]);

  useEffect(() => {
    if (!analysisFormMethods || !riskOpportunity) {
      return;
    }
  }, [analysisFormMethods, riskOpportunity]);

  const save = async (): Promise<void> => {
    if (!onSave) {
      return;
    }

    const rawFormValue = generalFormMethods.getValues();
    const senderId: number = rawFormValue.sender.id;

    const payload = {
      ...rawFormValue,
      senderId: senderId,
    };

    const controlActionValues = controlActionFormMethods.getValues();
    const controlAction: ControlActionSummary = {
      ...controlActionValues,
    };

    const analysisValues = analysisFormMethods.getValues();
    const completeAnalysis: CompleteAnalysis = {
      ...analysisValues,
    };

    const efficacy: ActionPlanEfficacy = mapCompleteAnalysisToActionPlanEfficacy(completeAnalysis);
    const implementation: ActionPlanImplementation = mapCompleteAnalysisToActionPlanImplementation(completeAnalysis);
    const actionPlanSummary: ActionPlanSummary = mapCompleteAnalysisToActionPlanSummary(completeAnalysis);
    const ishikawa: Ishikawa | null = mapCompleteAnalysisToIshikawa(completeAnalysis);
    const reasons: Reason | null = mapCompleteAnalysisToReasons(completeAnalysis);
    const details: AnalysisDetails = mapCompleteToAnalysisDetails(completeAnalysis);
    const rawRiskOpportunity: RawRiskOpportunity = mapRiskOpportunity(payload as any);

    if (!isOpportunity) {
      rawRiskOpportunity.descricaoControle = controlAction.description;
      rawRiskOpportunity.idLinhaConfigControle1 = controlAction.probability.id;
      rawRiskOpportunity.idLinhaConfigControle2 = controlAction.severity.id;
    }

    onSave(senderId, efficacy, implementation, actionPlanSummary, ishikawa, reasons, details, payload.interestedParts, rawRiskOpportunity);
  };

  const back = (): void => {
    onBack();
  };

  return (
    <Stack spacing={2}>
      <FormProvider {...generalFormMethods}>
        <GeneralInformation isOpportunity={isOpportunity} readonly={readonly} summarizedProcesses={processes} />
      </FormProvider>

      {!isOpportunity && (
        <FormProvider {...controlActionFormMethods}>
          <ControlAction allProbabilities={firstConfigurations} allSeverities={secondConfigurations} readonly={readonly} />
        </FormProvider>
      )}

      <FormProvider {...analysisFormMethods}>
        <Analysis
          enums={enums}
          firstConfigurations={firstConfigurations}
          map={map}
          readonly={readonly}
          secondConfigurations={secondConfigurations}
          users={users}
        />
      </FormProvider>

      <Stack justifyContent="flex-end" gap="20px" flexDirection="row">
        <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={back}>
          Voltar
        </Button>
        {!readonly && (
          <Button type="submit" onClick={save} variant="contained" color="primary" style={{ background: '#e6b200', color: '#4e4d4d' }}>
            Salvar
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default BaseDetails;
