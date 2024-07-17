import { Breadcrumbs, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BaseDetails } from '../components';

const ViewRisk = () => {
  const { id } = useParams();

  useEffect(() => {
    console.log('[view risk]', `id=${id}`);
  }, [id]);

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

        <BaseDetails readonly />
      </div>
    </div>
  );
};

export default ViewRisk;
