import React from 'react';
import { Box, Breadcrumbs, Button, Stack, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InstitutionalMission, InstitutionalPolicy, InstitutionalValues, InstitutionalVision } from '../components';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { EixosSwot } from '../../models/swot';
import SwotEixoItem from '../components/swot-eixo-item';
import { saveLoteSwot } from '../../reducers/swot.reducer';
import { toast } from 'react-toastify';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { listAgroupedSwots } from '../../strategic-planning.service';

const query = new QueryClient();

const Swot = () => {
  const { idSwot } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [strenths, setStrenths] = useState<Array<EixosSwot>>([]);
  const [weaknesses, setWeaknesses] = useState<Array<EixosSwot>>([]);
  const [opportunities, setOpportunities] = useState<Array<EixosSwot>>([]);
  const [threats, setThreats] = useState<Array<EixosSwot>>([]);

  // const swots: Array<EixosSwot> = useAppSelector(state => state.all4qmsmsgatewayauditplan.swot.entities);
  const swot: EixosSwot = useAppSelector(state => state.all4qmsmsgatewayauditplan.swot.entitie);

  const {
    data: agrupedSwots,
    mutate: getSwots,
    isPending,
  } = useMutation(
    {
      mutationFn: () => listAgroupedSwots(),
    },
    query
  );

  useEffect(() => {
    getSwots();
  }, []);

  useEffect(() => {
    const { ameacas, forcas, fraquezas, oportunidades } = agrupedSwots || {};

    if (ameacas) setThreats(ameacas);
    if (forcas) setStrenths(forcas);
    if (fraquezas) setWeaknesses(fraquezas);
    if (oportunidades) setOpportunities(oportunidades);
  }, [agrupedSwots]);

  useEffect(() => {
    // dispatch);
    if (!swot) return;

    switch (swot.eixo) {
      case 'FORCAS':
        setStrenths([swot]);
        break;
      case 'FRAQUEZAS':
        setWeaknesses([swot]);
        break;
      case 'OPORTUNIDADES':
        setOpportunities([swot]);
        break;
      case 'AMEACAS':
        setThreats([swot]);
        break;
    }
  }, [swot]);

  const onBackClicked = (event: React.MouseEvent<HTMLButtonElement>): void => {
    navigate('/strategic-planning');
  };

  const onSaveClicked = (event: React.MouseEvent<HTMLButtonElement>): void => {
    dispatch(saveLoteSwot([...strenths, ...weaknesses, ...opportunities, ...threats])).then(res => {
      const res_ = (res.payload as EixosSwot[]) || [];
      if (res_?.length > 0) {
        toast.success('SWOTs salvos com sucesso!.');
        onBackClicked(event);
      } else toast.error('Tente novamente mais tarde documento.');
    });
  };

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Link to={'/strategic-planning'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Planejamento Estratégico
          </Link>
          <Typography className="link">SWOT</Typography>
        </Breadcrumbs>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <h2 className="title">SWOT</h2>
          </Box>
          <Stack direction="column" spacing={2}>
            {(strenths.length > 0 || !idSwot) && (
              <SwotEixoItem
                title={'Strengths / Pontos Fortes'}
                setListSwotEixo={setStrenths}
                listSwotEixo={strenths}
                eixo="FORCAS"
                whenDeleted={getSwots}
              />
            )}
            {(weaknesses.length > 0 || !idSwot) && (
              <SwotEixoItem
                title={'Weaknesses / Fraquezas'}
                setListSwotEixo={setWeaknesses}
                listSwotEixo={weaknesses}
                eixo="FRAQUEZAS"
                whenDeleted={getSwots}
              />
            )}
            {(opportunities.length > 0 || !idSwot) && (
              <SwotEixoItem
                title={'Opportunities / Oportunidades'}
                setListSwotEixo={setOpportunities}
                listSwotEixo={opportunities}
                eixo="OPORTUNIDADES"
                whenDeleted={getSwots}
              />
            )}
            {(threats.length > 0 || !idSwot) && (
              <SwotEixoItem
                title={'Threats / Ameaças'}
                setListSwotEixo={setThreats}
                listSwotEixo={threats}
                eixo="AMEACAS"
                whenDeleted={getSwots}
              />
            )}
          </Stack>

          <Stack justifyContent="flex-end" gap="20px" flexDirection="row" sx={{ marginTop: '20px' }}>
            <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={onBackClicked}>
              Voltar
            </Button>
            <Button
              type="submit"
              onClick={onSaveClicked}
              variant="contained"
              color="primary"
              style={{ background: '#e6b200', color: '#4e4d4d' }}
            >
              Salvar
            </Button>
          </Stack>
        </Box>
      </div>
    </div>
  );
};

export default Swot;
