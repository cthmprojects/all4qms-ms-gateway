import { Box, Breadcrumbs, Button, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { InstitutionalPlan } from '../../models';
import { getAllInstitutionalPlans, saveInstitutionalPlan, updateInstitutionalPlan } from '../../reducers/institutional-plan.reducer';
import { InstitutionalMission, InstitutionalPolicy, InstitutionalValues, InstitutionalVision } from '../components';

const Institutional = () => {
  const [mission, setMission] = useState<string>('');
  const [policy, setPolicy] = useState<string>('');
  const [values, setValues] = useState<Array<string>>([]);
  const [vision, setVision] = useState<string>('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const institutionalPlans: Array<InstitutionalPlan> = useAppSelector(state => state.all4qmsmsgatewayauditplan.institutionalPlans.entities);

  useEffect(() => {
    dispatch(getAllInstitutionalPlans());
  }, []);

  useEffect(() => {
    if (institutionalPlans.length <= 0) {
      return;
    }

    const institutionalPlan: InstitutionalPlan = institutionalPlans[0];

    setMission(institutionalPlan.mission);
    setPolicy(institutionalPlan.policy);
    setValues(institutionalPlan.values);
    setVision(institutionalPlan.vision);
  }, [institutionalPlans]);

  const onBackClicked = (event: React.MouseEvent<HTMLButtonElement>): void => {
    navigate('/strategic-planning');
  };

  const onSaveClicked = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (institutionalPlans.length > 0) {
      const institutionalPlan: InstitutionalPlan = institutionalPlans[0];
      const id: number = institutionalPlan.id;

      dispatch(
        updateInstitutionalPlan({
          id: id,
          mission: mission,
          policy: policy,
          values: values,
          vision: vision,
        })
      );
      toast.success('Institucional atualizado com sucesso!');
    } else {
      dispatch(
        saveInstitutionalPlan({
          mission: mission,
          policy: policy,
          values: values,
          vision: vision,
        })
      );
      toast.success('Institucional salvo com sucesso!');
    }
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
          <Typography className="link">Institucional</Typography>
        </Breadcrumbs>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <h2 className="title">Institucional</h2>
          </Box>
          <Stack direction="column" spacing={2}>
            <InstitutionalVision onChanged={newValue => setVision(newValue)} value={vision} />

            <InstitutionalMission onChanged={newValue => setMission(newValue)} value={mission} />

            <InstitutionalValues onChanged={newValues => setValues(newValues)} values={values} />

            <InstitutionalPolicy onChanged={newValue => setPolicy(newValue)} value={policy} />
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

export default Institutional;
