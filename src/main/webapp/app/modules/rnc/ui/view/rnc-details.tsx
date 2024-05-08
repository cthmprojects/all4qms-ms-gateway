import { Box, Breadcrumbs, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CompleteNc } from '../../models';
import { findCompleteNonConformity } from '../../reducers/complete-non-conformity.reducer';
import { NonConformityActionPlanSummary, NonConformityDescriptionSummary, NonConformitySummary } from '../components';

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
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <NonConformitySummary nonConformity={nonConformity?.naoConformidade} />
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Stack spacing={2}>
              {nonConformity?.descricaoNC.map((d, index) => (
                <NonConformityDescriptionSummary key={index} description={d} />
              ))}
            </Stack>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Stack spacing={2}>
              {nonConformity?.acaoPlano.map((a, index) => (
                <NonConformityActionPlanSummary key={index} actionPlan={a} />
              ))}
            </Stack>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default RncDetails;
