import { Box, Breadcrumbs, Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { SummarizedProcess } from '../../models';
import { IndicatorDetails, IndicatorGoals } from '../components';

const AddIndicator = () => {
  const onDetailsChanged = (
    code: string,
    description: string,
    name: string,
    process: SummarizedProcess,
    trend: string,
    unit: string
  ): void => {
    // save latest changes
  };

  const back = (): void => {};

  const save = (): void => {};

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">Indicadores</Typography>
          <Typography className="link">Cadastro</Typography>
        </Breadcrumbs>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <h2 className="title">Indicadores</h2>

            <Stack spacing={2}>
              <IndicatorDetails
                onChanged={onDetailsChanged}
                processes={[
                  { id: 1, name: 'Produção' },
                  { id: 2, name: 'Chão de fábrica' },
                ]}
                trends={['MAIOR', 'MENOR', 'ESTABILIZAR']}
                units={['PERCENTUAL', 'MONETARIO', 'UNITARIO', 'DECIMAL']}
              />

              <IndicatorGoals
                frequencies={['MENSAL', 'BIMESTRAL', 'TRIMESTRAL', 'QUADRIMESTRAL', 'SEMESTRAL', 'ANUAL']}
                unit="PERCENTUAL"
              />
            </Stack>
          </Box>
        </Box>
      </div>

      <Stack justifyContent="flex-end" gap="20px" flexDirection="row" sx={{ marginTop: '20px' }}>
        <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={back}>
          Voltar
        </Button>
        <Button type="submit" onClick={save} variant="contained" color="primary" style={{ background: '#e6b200', color: '#4e4d4d' }}>
          Salvar
        </Button>
      </Stack>
    </div>
  );
};

export default AddIndicator;
