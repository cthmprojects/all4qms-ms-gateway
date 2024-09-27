import React from 'react';
import { Box, Breadcrumbs, Button, Stack, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { InstitutionalMission, InstitutionalPolicy, InstitutionalValues, InstitutionalVision } from '../components';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { EixosSwot } from '../../models/swot';
import SwotEixoItem from '../components/swot-eixo-item';

const Swot = () => {
  const [strenths, setStrenths] = useState<Array<EixosSwot>>([]);
  const [weaknesses, setWeaknesses] = useState<Array<EixosSwot>>([]);
  const [opportunities, setOpportunities] = useState<Array<EixosSwot>>([]);
  const [threats, setThreats] = useState<Array<EixosSwot>>([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // dispatch);
  }, []);

  const onBackClicked = (event: React.MouseEvent<HTMLButtonElement>): void => {
    navigate('/strategic-planning');
  };

  const onSaveClicked = (event: React.MouseEvent<HTMLButtonElement>): void => {
    // dispatch(
    // );
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
            <SwotEixoItem title={'Strengths / Pontos Fortes'} setListSwotEixo={setStrenths} listSwotEixo={strenths} />
            <SwotEixoItem title={'Weaknesses / Fraquezas'} setListSwotEixo={setWeaknesses} listSwotEixo={weaknesses} />
            <SwotEixoItem title={'Opportunities / Oportunidades'} setListSwotEixo={setOpportunities} listSwotEixo={opportunities} />
            <SwotEixoItem title={'Threats / Ameaças'} setListSwotEixo={setThreats} listSwotEixo={threats} />
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
