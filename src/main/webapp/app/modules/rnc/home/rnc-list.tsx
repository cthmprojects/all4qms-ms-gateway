import { Breadcrumbs, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'reactstrap';
import './rnc.css';
// import { DesktopDatePicker } from '@mui/x-date-pickers';
// import dayjs, { Dayjs } from 'dayjs';

const RncList = () => {
  // const [startDate, setStartDate] = useState<Dayjs | null >(
  //   dayjs()
  // );

  // const handleChangeStartDate = (newDate: Dayjs | null) => {
  //   setStartDate(newDate);
  // }

  return (
    <div style={{ padding: '30px 50px' }}>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '5px' }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="primary" to={'/'}>
            MUI
          </Link>
          <Typography>RNC/OM</Typography>
        </Breadcrumbs>

        <h1>Lista RNC</h1>
        <div>
          <Button variant="contained">NOVO REGISTRO</Button>
          {/* <DesktopDatePicker
            label="Date desktop"
            format='MM/DD/YYYY'
            value={startDate}
            onChange={handleChangeStartDate}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default RncList;
