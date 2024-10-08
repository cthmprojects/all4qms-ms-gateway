import { Box, Breadcrumbs, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CompleteNc } from '../../models';
import { findCompleteNonConformity } from '../../reducers/complete-non-conformity.reducer';
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

    dispatch(findCompleteNonConformity(nonConformityId));
  }, [nonConformityId]);

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
              <NonConformitySummary nonConformity={nonConformity?.naoConformidade} />
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <NonConformityOriginSummary origin={nonConformity?.origem} />
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Stack spacing={2}>
                <NonConformityDescriptionSummary descriptions={nonConformity?.descricaoNC} />
              </Stack>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <NonConformityCoverageSummary coverage={nonConformity?.abrangencia} />
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              {nonConformity?.acaoImediata.map((a, index) => (
                <NonConformityImmediateActionSummary key={index} immediateAction={a} />
              ))}
            </Box>

            {nonConformity?.decisao && (
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <NonConformityDecisionSummary decision={nonConformity?.decisao} />
              </Box>
            )}

            {(nonConformity?.ishikawa || nonConformity?.porques) && (
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <NonConformityCauseInvestigationSummary ishikawa={nonConformity?.ishikawa} reasons={nonConformity?.porques} />
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
