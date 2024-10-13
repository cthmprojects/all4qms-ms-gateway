import { Box, Breadcrumbs, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CompleteNc, Enums, NonConformityDescriptionSummary as NcDescriptionSummary, NonConformityDescription } from '../../models';
import { findCompleteNonConformity } from '../../reducers/complete-non-conformity.reducer';
import { listEnums } from '../../reducers/enums.reducer';
import {
  NonConformityActionPlanSummary,
  NonConformityCauseInvestigationSummary,
  NonConformityCoverageSummary,
  NonConformityDecisionSummary,
  NonConformityDescriptionSummary,
  NonConformityImmediateActionSummary,
  NonConformityOriginSummary,
  NonConformityStageSummary,
  NonConformitySummary,
} from '../components';

const RncDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const enums = useAppSelector<Enums | null>(state => state.all4qmsmsgateway.enums.enums);
  const nonConformity: CompleteNc = useAppSelector(state => state.all4qmsmsgateway.completeNonConformities.entity);

  const nonConformityId = useMemo(() => {
    if (!id || id.length <= 0) {
      return 0;
    }

    return parseInt(id);
  }, [id]);

  useEffect(() => {
    if (nonConformityId <= 0) {
      return;
    }

    dispatch(listEnums());
    dispatch(findCompleteNonConformity(nonConformityId));
  }, [nonConformityId]);

  const description = useMemo<string>(() => {
    if (!nonConformity) {
      return '';
    }

    const ncDescriptions: Array<NonConformityDescription> = nonConformity.descricaoNC;

    if (!ncDescriptions || ncDescriptions.length <= 0) {
      return '';
    }

    const ncDescription: NonConformityDescription = ncDescriptions[0];

    if (!ncDescription || !ncDescription.descricaoNaoConformidade) {
      return '';
    }

    const summary: NcDescriptionSummary = ncDescription.descricaoNaoConformidade;

    if (!summary) {
      return '';
    }

    return summary.detalhesNaoConformidade;
  }, [nonConformity]);

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Link to={'/rnc'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            RNC-OM
          </Link>
          <Typography className="link">RNC {`${id}`}</Typography>
        </Breadcrumbs>
        <h1 className="title">Detalhes {`${nonConformity?.naoConformidade?.id}`}</h1>
        <Box sx={{ width: '100%' }}>
          <Stack spacing={2}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <NonConformitySummary enums={enums} nonConformity={nonConformity?.naoConformidade} />
            </Box>

            {nonConformity?.origem &&
              (nonConformity.origem.auditoria ||
                nonConformity.origem.cliente ||
                nonConformity.origem.mpprod ||
                nonConformity.origem.outros) && (
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <NonConformityOriginSummary enums={enums} origin={nonConformity?.origem} />
                </Box>
              )}

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Stack spacing={2}>
                <NonConformityDescriptionSummary descriptions={nonConformity?.descricaoNC} />
              </Stack>
            </Box>

            {nonConformity?.abrangencia && (
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <NonConformityCoverageSummary coverage={nonConformity?.abrangencia} />
              </Box>
            )}

            {nonConformity?.acaoImediata.map((a, index) => (
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <NonConformityImmediateActionSummary key={index} immediateAction={a} />
              </Box>
            ))}

            {nonConformity?.decisao.map((d, index) => (
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <NonConformityDecisionSummary decision={d} />
              </Box>
            ))}

            {(nonConformity?.ishikawa || (nonConformity?.porques && nonConformity?.porques.length > 0)) && (
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <NonConformityCauseInvestigationSummary
                  description={description}
                  ishikawa={nonConformity?.ishikawa}
                  reasons={nonConformity?.porques}
                />
              </Box>
            )}

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Stack spacing={2}>
                {nonConformity?.acaoPlano.map((a, index) => (
                  <NonConformityActionPlanSummary key={index} actionPlan={a} />
                ))}
              </Stack>
            </Box>

            {nonConformity?.aprovacao && (
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <NonConformityStageSummary
                  available={nonConformity?.aprovacao?.possuiImplementacao}
                  date={nonConformity?.aprovacao?.dataImplementacao}
                  dateLabel="Data Implementação"
                  description={nonConformity?.aprovacao?.descImplementacao}
                  descriptionLabel="Descrição da Implementação"
                  responsible={nonConformity?.aprovacao?.responsavelImplementacao?.toString()}
                  responsibleLabel="Resp. Verificação"
                  showAvailability={true}
                  title="Implementação do Plano"
                />
              </Box>
            )}

            {nonConformity?.aprovacao && (
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <NonConformityStageSummary
                  available={nonConformity?.aprovacao?.possuiEficacia}
                  date={nonConformity?.aprovacao?.dataEficacia}
                  dateLabel="Data Verificação"
                  description={nonConformity?.aprovacao?.descEficacia}
                  descriptionLabel="Descrição da Eficácia"
                  responsible={nonConformity?.aprovacao?.responsavelEficacia?.toString()}
                  responsibleLabel="Resp. Verificação"
                  showAvailability={true}
                  title="Verificação da Eficácia"
                />
              </Box>
            )}

            {nonConformity?.aprovacao && (
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <NonConformityStageSummary
                  available={false}
                  date={nonConformity?.aprovacao?.dataFechamento}
                  dateLabel="Data do Fechamento"
                  description={nonConformity?.aprovacao?.descFechamento}
                  descriptionLabel="Descrição do Fechamento"
                  responsible={nonConformity?.aprovacao?.responsavelFechamento?.toString()}
                  responsibleLabel="Resp. Verificação"
                  showAvailability={false}
                  title="Fechamento"
                />
              </Box>
            )}
          </Stack>
        </Box>
      </div>
    </div>
  );
};

export default RncDetails;
