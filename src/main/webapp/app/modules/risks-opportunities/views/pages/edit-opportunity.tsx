import { Breadcrumbs, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BaseDetails } from '../components';

const EditOpportunity = () => {
  const { id } = useParams();

  useEffect(() => {
    console.log('[edit opportunity]', `id=${id}`);
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
          <Typography className="link">Oportunidades</Typography>
        </Breadcrumbs>

        <h2 className="title">Oportunidade</h2>

        <BaseDetails isOpportunity />
      </div>
    </div>
  );
};

export default EditOpportunity;
