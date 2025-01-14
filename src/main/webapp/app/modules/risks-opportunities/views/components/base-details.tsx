import { Box, Button, Fab, Stack } from '@mui/material';
import { useAppSelector } from 'app/config/store';
import { useEffect } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { mapRiskOpportunity } from '../../mappers';
import {
  ActionPlanEfficacy,
  ActionPlanImplementation,
  AnalysisDetails,
  Configuration,
  ControlActionSummary,
  Enums,
  Ishikawa,
  RawApproval,
  RawCauseEffectInvestigation,
  RawCompleteAnalysis,
  RawInvestigation,
  RawIshikawaInvestigation,
  RawMap,
  RawPlanAction,
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
import { deleteAnalise, saveRiskOpportunity } from '../../service';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useConfirmDialog } from 'app/shared/hooks/useConfirmDialog';

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
    ishikawa: Ishikawa | null,
    reasons: Reason | null,
    details: AnalysisDetails,
    interestedParts: { id?: number; nomeParteInteressada: string },
    rawRiskOpportunity: RawRiskOpportunity,
    acoesPlano: RawPlanAction[],
    analise?: RawRiskOpportunityAnalysis
  ) => void;
  newOnSave?: (payload: Parameters<typeof saveRiskOpportunity>[0]) => void;
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
  newOnSave,
}: BaseDetailsProps) => {
  let isAdmin = useAppSelector(state => state.authentication.accountQms);

  const generalFormMethods = useForm({
    defaultValues: {
      activity: '',
      date: null,
      interestedParts: { nomeParteInteressada: '' },
      description: '',
      firstAuxiliaryDescription: '',
      secondAuxiliaryDescription: '',
      sender: isAdmin,
      type: !isOpportunity ? 'Risco' : 'Oportunidade',
      flow: '',
      process: null,
      id: '' as unknown as number,
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

  const defaultAnaliseFormPayload = {
    acoesPlano: [{}],
    analise: {
      dataAnalise: new Date(),
    },
    aprovacao: {},
    ishikawa: {},
    plano: {},
    porques: {},
  } as RawCompleteAnalysis;

  const analysisFormMethods = useForm({
    defaultValues: {
      analysis: [] as RawCompleteAnalysis[],
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { append, fields, remove } = useFieldArray({ control: analysisFormMethods.control, name: 'analysis', keyName: 'key' });

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
    generalFormMethods.setValue('date', riskOpportunity?.dataRegistro ? new Date(riskOpportunity.dataRegistro) : null);
    generalFormMethods.setValue('description', riskOpportunity.descricao1);
    generalFormMethods.setValue('firstAuxiliaryDescription', riskOpportunity.descricao2);
    generalFormMethods.setValue('flow', riskOpportunity.nomeFluxo);
    riskOpportunity.partesInteressadas.id &&
      generalFormMethods.setValue('interestedParts', riskOpportunity.partesInteressadas, { shouldDirty: true });
    generalFormMethods.setValue('secondAuxiliaryDescription', riskOpportunity.descricao3);
    generalFormMethods.setValue('type', riskOpportunity.tipoRO === 'R' ? 'Risco' : 'Oportunidade');
    generalFormMethods.setValue('id', riskOpportunity.id);

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

    const aprovacao: RawApproval = await getApprovalById(approvalId);
    const investigation: RawInvestigation = await getInvestigationById(investigationId);
    const acoesPlano = (await getPlanById(planId)).acoes;
    const ishikawa: RawIshikawaInvestigation = investigation.idCausaEfeito ? await getIshikawaById(investigation.idCausaEfeito) : null;
    const porques: RawCauseEffectInvestigation = investigation.idPorques ? await getReasonsById(investigation.idPorques) : null;

    const analise = {
      ...analysis,
      criadoPor: isAdmin.id,
    };

    append({ aprovacao, acoesPlano, ishikawa, porques, analise } as RawCompleteAnalysis);
  };

  useEffect(() => {
    (async () => {
      analysisFormMethods.setValue('analysis', []);

      if (!analysisFormMethods || !riskOpportunity?.id) {
        append(defaultAnaliseFormPayload);
        return;
      }

      const allAnalysis: Array<RawRiskOpportunityAnalysis> = riskOpportunity.analiseROS;

      allAnalysis.forEach(fetchAnalysis);

      if (!allAnalysis || allAnalysis.length <= 0) {
        return;
      }
    })();
  }, [riskOpportunity]);

  const save = async (): Promise<void> => {
    if (!newOnSave) {
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
    const rawRiskOpportunity: RawRiskOpportunity = mapRiskOpportunity(payload as any);

    if (!isOpportunity) {
      rawRiskOpportunity.descricaoControle = controlAction.description;
      rawRiskOpportunity.idLinhaConfigControle1 = controlAction?.probability?.id;
      rawRiskOpportunity.idLinhaConfigControle2 = controlAction?.severity?.id;
    }

    newOnSave({
      riscoOportunidade: rawRiskOpportunity,
      analises: analysisFormMethods.getValues().analysis,
      partesInteressadas: payload.interestedParts,
    });
  };

  const back = (): void => {
    onBack();
  };

  const trashCanButtonHandler = (item: RawCompleteAnalysis, index: number) => {
    showDialog({
      title: 'Excluir Análise?',
      content: 'Você precisa confirmar para excluir permanentemente essa análise.',
      onConfirm: async () => {
        item?.analise?.id && (await deleteAnalise(item.analise));
        remove(index);
      },
    });
    return;
  };

  const { showDialog, ConfirmDialog } = useConfirmDialog();

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

      {ConfirmDialog}

      <FormProvider {...analysisFormMethods}>
        {fields.map((item, index) => (
          <Box display="flex" alignItems="center" gap="10px">
            <Box width="100%">
              <Analysis
                enums={enums}
                firstConfigurations={firstConfigurations}
                map={map}
                readonly={readonly}
                secondConfigurations={secondConfigurations}
                users={users}
                isOpportunity={isOpportunity}
                pathPrefix={`analysis.${index}.`}
                key={item.key}
              />
            </Box>
            {!readonly && fields.length > 1 && (
              <Box width={fields.length > 1 ? '60xp' : '0px'}>
                <Fab size="small" onClick={() => trashCanButtonHandler(item, index)}>
                  <DeleteIcon />
                </Fab>
              </Box>
            )}
          </Box>
        ))}
        {!readonly && (
          <Box display="flex" justifyContent="center">
            <Fab size="small" onClick={() => append(defaultAnaliseFormPayload)}>
              <AddIcon />
            </Fab>
          </Box>
        )}
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
