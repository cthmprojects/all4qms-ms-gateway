import { Box, Breadcrumbs, Button, Stack, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { IndicatorDetails, IndicatorMeasurements } from '../components';

const Measurements = () => {
  const { id } = useParams();

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
          <Typography className="link">Medições</Typography>
        </Breadcrumbs>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <h2 className="title">Indicadores</h2>

            <Stack spacing={2}>
              <IndicatorDetails
                initialValue={{
                  code: 'Código 1',
                  description: 'Descrição 1',
                  name: 'Nome 1',
                  processId: 1,
                  trend: 'MAIOR',
                  unit: 'DECIMAL',
                  id: 1,
                }}
                processes={[
                  { id: 1, name: 'Produção' },
                  { id: 2, name: 'Chão de fábrica' },
                ]}
                readonly
                trends={['MAIOR', 'MENOR', 'ESTABILIZAR']}
                units={['PERCENTUAL', 'MONETARIO', 'UNITARIO', 'DECIMAL']}
              />

              <IndicatorMeasurements
                frequencies={['MENSAL', 'BIMESTRAL', 'TRIMESTRAL', 'QUADRIMESTRAL', 'SEMESTRAL', 'ANUAL']}
                initialValues={[
                  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                ]}
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

export default Measurements;
