import { Button, Stack } from '@mui/material';
import { useAppSelector } from 'app/config/store';
import { AprovacaoNC, Plan } from 'app/modules/rnc/models';
import { useEffect } from 'react';
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
  RawCauseEffectInvestigation,
  RawInvestigation,
  RawIshikawaInvestigation,
  RawMap,
  RawPlanAction,
  RawPlanWithActions,
  RawRiskOpportunity,
  RawRiskOpportunityAnalysis,
  Reason,
  SummarizedProcess,
  SummarizedUser,
} from '../../models';
import {
  getApprovalById,
  getInvestigationById,
  getIshikawaById,
  getPlanById,
  getReasonsById,
} from '../../reducers/risks-opportunities.reducer';
import Analysis from './analysis';
import ControlAction from './control-action';
import GeneralInformation from './general-information';
import { EixosSwot } from '../../../strategic-planning/models/swot';

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
  swotData?: EixosSwot;
  onBack: () => void;
  onSave?: (
    senderId: number,
    efficacy: ActionPlanEfficacy,
    implementation: ActionPlanImplementation,
    actionPlanSummary: ActionPlanSummary,
    ishikawa: Ishikawa | null,
    reasons: Reason | null,
    details: AnalysisDetails,
    interestedParts: { id?: number; nomeParteInteressada: string },
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
  swotData,
  onBack,
  onSave,
}: BaseDetailsProps) => {
  let isAdmin = useAppSelector(state => state.authentication.accountQms);

  const generalFormMethods = useForm({
    defaultValues: {
      activity: '',
      date: null,
      description: swotData?.descricao || '',
      interestedParts: { nomeParteInteressada: '' },
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

  useEffect(() => {
    isAdmin.id && generalFormMethods.setValue('sender', isAdmin);
  }, [isAdmin.id]);

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
      responsibleId: '' as unknown as number,
      verifyAction: false,
      actionVerificationDate: null,
      actionVerifierId: '' as unknown as number,
      implementationDate: null,
      implementationResponsibleId: '' as unknown as number,
      implemented: false,
      implementationDescription: '',
      efficacyVerificationDate: null,
      efficacyResponsibleId: '' as unknown as number,
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
    riskOpportunity.partesInteressadas.id &&
      generalFormMethods.setValue('interestedParts', riskOpportunity.partesInteressadas, { shouldDirty: true });
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
  }, [controlActionFormMethods, riskOpportunity, firstConfigurations, secondConfigurations]);

  const fetchAnalysis = async (analysis: RawRiskOpportunityAnalysis): Promise<void> => {
    const approvalId: number = analysis.idAprovacaoNC;
    const investigationId: number = analysis.idInvestigacao;
    const planId: number = analysis.idPlano;
    const approval: AprovacaoNC = await getApprovalById(approvalId);
    const investigation: RawInvestigation = await getInvestigationById(investigationId);
    const planWithActions: RawPlanWithActions = await getPlanById(planId);
    const ishikawa: RawIshikawaInvestigation = investigation.idCausaEfeito ? await getIshikawaById(investigation.idCausaEfeito) : null;
    const reasons: RawCauseEffectInvestigation = investigation.idPorques ? await getReasonsById(investigation.idPorques) : null;

    const useIshikawa: boolean =
      !ishikawa &&
      !ishikawa.descCausaEfeito &&
      !ishikawa.maoDeObra &&
      !ishikawa.maquina &&
      !ishikawa.materiaPrima &&
      !ishikawa.medicao &&
      !ishikawa.meioAmbiente &&
      !ishikawa.metodo;

    analysisFormMethods.setValue('useIshikawa', useIshikawa);
    analysisFormMethods.setValue('ishikawaCause', ishikawa?.descCausaEfeito);
    analysisFormMethods.setValue('environment', ishikawa?.meioAmbiente);
    analysisFormMethods.setValue('manpower', ishikawa?.maoDeObra);
    analysisFormMethods.setValue('machine', ishikawa?.maquina);
    analysisFormMethods.setValue('measurement', ishikawa?.medicao);
    analysisFormMethods.setValue('method', ishikawa?.metodo);
    analysisFormMethods.setValue('rawMaterial', ishikawa?.materiaPrima);
    analysisFormMethods.setValue('useReasons', !useIshikawa);
    analysisFormMethods.setValue('reasonCause', reasons?.descCausa);
    analysisFormMethods.setValue('reasonEffect', reasons?.descProblema);
    analysisFormMethods.setValue('reason1', reasons?.pq1);
    analysisFormMethods.setValue('reason2', reasons?.pq2);
    analysisFormMethods.setValue('reason3', reasons?.pq3);
    analysisFormMethods.setValue('reason4', reasons?.pq4);
    analysisFormMethods.setValue('reason5', reasons?.pq5);

    const action: RawPlanAction | null = planWithActions.acoes.length > 0 ? planWithActions.acoes[0] : null;

    analysisFormMethods.setValue('actionDescription', action?.descricaoAcao);
    analysisFormMethods.setValue('actionDate', new Date(action?.prazoAcao));
    analysisFormMethods.setValue('responsibleId', action?.idResponsavelAcao);
    analysisFormMethods.setValue('verifyAction', false);
    analysisFormMethods.setValue('actionVerificationDate', new Date(action?.dataVerificao));
    analysisFormMethods.setValue('actionVerifierId', action?.idResponsavelVerificaoAcao);

    analysisFormMethods.setValue('implementationDate', new Date(approval.dataImplementacao));
    analysisFormMethods.setValue('implementationResponsibleId', approval.responsavelImplementacao);
    analysisFormMethods.setValue('implemented', approval.possuiImplementacao);
    analysisFormMethods.setValue('implementationDescription', approval.descImplementacao);
    analysisFormMethods.setValue('efficacyVerificationDate', new Date(approval.dataEficacia));
    analysisFormMethods.setValue('efficacyResponsibleId', approval.responsavelEficacia);
    analysisFormMethods.setValue('efficacyVerified', approval.possuiEficacia);
    analysisFormMethods.setValue('efficacyDescription', approval.descEficacia);
  };

  useEffect(() => {
    if (!analysisFormMethods || !riskOpportunity) {
      return;
    }

    const allAnalysis: Array<RawRiskOpportunityAnalysis> = riskOpportunity.analiseROS;

    if (!allAnalysis || allAnalysis.length <= 0) {
      return;
    }

    const analysis: RawRiskOpportunityAnalysis = [...allAnalysis].reverse()[0];
    const probability: Configuration = filterConfiguration(analysis.linhaConfigAnalise1?.id ?? 0, firstConfigurations);
    const severity: Configuration = filterConfiguration(analysis.linhaConfigAnalise2?.id ?? 0, secondConfigurations);

    analysisFormMethods.setValue('description', analysis.descricaoDecisao);
    analysisFormMethods.setValue('meaning', analysis.decisao);
    analysisFormMethods.setValue('probability', probability);
    analysisFormMethods.setValue('severity', severity);

    fetchAnalysis(analysis);
  }, [analysisFormMethods, riskOpportunity, firstConfigurations, secondConfigurations]);

  const save = async (): Promise<void> => {
    if (!onSave) {
      return;
    }

    const rawFormValue = generalFormMethods.getValues();
    const senderId: number = rawFormValue.sender.id;

    const payload = {
      ...rawFormValue,
      senderId: senderId,
      processId: rawFormValue?.process?.id,
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
          isOpportunity={isOpportunity}
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
