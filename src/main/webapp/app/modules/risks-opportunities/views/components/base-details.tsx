import { Button, Stack } from '@mui/material';
import { useAppSelector } from 'app/config/store';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  mapCompleteAnalysisToActionPlanEfficacy,
  mapCompleteAnalysisToActionPlanImplementation,
  mapCompleteAnalysisToActionPlanSummary,
  mapCompleteAnalysisToIshikawa,
  mapCompleteAnalysisToReasons,
  mapCompleteToAnalysisDetails,
  mapInterestPartToRaw,
  mapLevelToConfiguration,
  mapRiskOpportunity,
} from '../../mappers';
import {
  ActionPlanEfficacy,
  ActionPlanImplementation,
  ActionPlanSummary,
  AnalysisDetails,
  CompleteAnalysis,
  ControlActionSummary,
  Ishikawa,
  RawRiskOpportunity,
  RawRiskOpportunityConfiguration,
  Reason,
  SummarizedProcess,
  SummarizedUser,
} from '../../models';
import {
  saveInterestedPartAsync,
  saveRiskOpportunityAnalysis,
  saveRiskOpportunityApprovalAsync,
  saveRiskOpportunityConfigAsync,
  saveRiskOpportunityInvestigation,
  saveRiskOpportunityPlanAsync,
} from '../../reducers/risks-opportunities.reducer';
import Analysis from './analysis';
import ControlAction from './control-action';
import GeneralInformation from './general-information';

type BaseDetailsProps = {
  isOpportunity?: boolean;
  processes: Array<SummarizedProcess>;
  readonly?: boolean;
  users: Array<SummarizedUser>;
  onBack: () => void;
  onSave?: (
    efficacy: ActionPlanEfficacy,
    implementation: ActionPlanImplementation,
    actionPlanSummary: ActionPlanSummary,
    ishikawa: Ishikawa | null,
    reasons: Reason | null,
    details: AnalysisDetails,
    rawRiskOpportunity: RawRiskOpportunity
  ) => void;
};

const BaseDetails = ({ isOpportunity, processes, readonly, users, onBack, onSave }: BaseDetailsProps) => {
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
      process: null,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const controlActionFormMethods = useForm({
    defaultValues: {
      description: '',
      probability: 'Baixo',
      severity: 'Baixo',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const analysisFormMethods = useForm({
    defaultValues: {
      description: '',
      meaning: '',
      probability: 'Baixo',
      severity: 'Baixo',
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

  useEffect(() => {
    generalFormMethods.register('interestedParts', { min: 1, required: true });
    generalFormMethods.register('date', { required: true });
  }, []);

  const parseLevel = (level: string): 'Baixo' | 'Médio' | 'Alto' => {
    if (level.toUpperCase() === 'BAIXO') {
      return 'Baixo';
    } else if (level.toUpperCase() === 'MÉDIO') {
      return 'Médio';
    } else {
      return 'Alto';
    }
  };

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
      probability: parseLevel(controlActionValues.probability),
      severity: parseLevel(controlActionValues.severity),
    };

    const analysisValues = analysisFormMethods.getValues();
    const completeAnalysis: CompleteAnalysis = {
      ...analysisValues,
      probability: parseLevel(analysisValues.probability),
      severity: parseLevel(analysisValues.severity),
    };

    const efficacy: ActionPlanEfficacy = mapCompleteAnalysisToActionPlanEfficacy(completeAnalysis);
    const implementation: ActionPlanImplementation = mapCompleteAnalysisToActionPlanImplementation(completeAnalysis);
    const actionPlanSummary: ActionPlanSummary = mapCompleteAnalysisToActionPlanSummary(completeAnalysis);
    const ishikawa: Ishikawa | null = mapCompleteAnalysisToIshikawa(completeAnalysis);
    const reasons: Reason | null = mapCompleteAnalysisToReasons(completeAnalysis);
    const details: AnalysisDetails = mapCompleteToAnalysisDetails(completeAnalysis);
    const rawRiskOpportunity: RawRiskOpportunity = mapRiskOpportunity(payload as any);

    const controlActionProbabilityConfiguration: RawRiskOpportunityConfiguration = mapLevelToConfiguration(
      controlAction.probability,
      senderId
    );
    const controlActionSeverityConfiguration: RawRiskOpportunityConfiguration = mapLevelToConfiguration(controlAction.severity, senderId);

    const controlActionProbabilityConfigurationId: number = await saveRiskOpportunityConfigAsync(controlActionProbabilityConfiguration);
    const controlActionSeverityConfigurationId: number = await saveRiskOpportunityConfigAsync(controlActionSeverityConfiguration);
    const riskOpportunityApprovalId: number = await saveRiskOpportunityApprovalAsync(implementation, efficacy);
    const riskOpportunityPlanId: number = await saveRiskOpportunityPlanAsync(actionPlanSummary);
    const riskOpportunityInvestigationId: number = await saveRiskOpportunityInvestigation(ishikawa, reasons);
    const riskOpportunityAnalysisId: number = await saveRiskOpportunityAnalysis(
      details,
      senderId,
      riskOpportunityApprovalId,
      riskOpportunityInvestigationId,
      riskOpportunityPlanId
    );
    const riskOpportunityInterestedPartsIds: Array<number> = [];
    for (let i = 0; i < payload.interestedParts.length; i++) {
      const interestedPart: string = payload.interestedParts[i];

      const interestPartId: number | null = await saveInterestedPartAsync(mapInterestPartToRaw(interestedPart, senderId));

      if (interestPartId) {
        riskOpportunityInterestedPartsIds.push(interestPartId);
      }
    }

    rawRiskOpportunity.descricaoControle = controlAction.description;
    rawRiskOpportunity.idLinhaConfigControle1 = controlActionProbabilityConfigurationId;
    rawRiskOpportunity.idLinhaConfigControle2 = controlActionSeverityConfigurationId;
    rawRiskOpportunity.idsAnaliseROS = [riskOpportunityAnalysisId];
    rawRiskOpportunity.idPartesInteressadas = riskOpportunityInterestedPartsIds.length > 0 ? riskOpportunityInterestedPartsIds[0] : 0;

    onSave(efficacy, implementation, actionPlanSummary, ishikawa, reasons, details, rawRiskOpportunity);
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
          <ControlAction />
        </FormProvider>
      )}

      <FormProvider {...analysisFormMethods}>
        <Analysis users={users} />
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
