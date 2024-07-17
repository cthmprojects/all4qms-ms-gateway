import { Breadcrumbs, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { BaseDetails } from '../components';

const AddRisk = () => {
  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Link to={'/risks-opportunities'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Riscos & Oportunidades
          </Link>
          <Typography className="link">Riscos</Typography>
        </Breadcrumbs>

        <h2 className="title">Risco</h2>

        <BaseDetails />
      </div>
    </div>
  );
};

export default AddRisk;
