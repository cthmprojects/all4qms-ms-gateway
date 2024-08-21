import { Box, Breadcrumbs, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { IndicatorDetails } from '../components';

const AddIndicator = () => {
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

            <IndicatorDetails
              processes={[
                { id: 1, name: 'Produção' },
                { id: 2, name: 'Chão de fábrica' },
              ]}
              trends={['MAIOR', 'MENOR', 'ESTABILIZAR']}
              units={['PERCENTUAL', 'MONETARIO', 'UNITARIO', 'DECIMAL']}
            />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default AddIndicator;
