import {
  Breadcrumbs,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import React, { useState } from 'react';
import { Card, Row } from 'reactstrap';
import { Select } from 'app/shared/components-form/select/select';
import './rnc.css';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from '@mui/icons-material';

const RncList = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const columns = [
    'Número',
    'Emissão',
    'Emissor',
    'Descrição',
    'Responsável',
    'Prazo',
    'Ações',
    'Verificação',
    'Eficácia',
    'Fechamento',
    'Status',
    'Ações',
  ];

  const rows = [
    [0, 'Teste', 'Admin', 'For Test', 'Admin', '30/09/2023', '', 'Test', '', '', 'Done'],
    [0, 'Teste', 'Vitão', 'For Test', 'Admin', '30/09/2023', '', 'Vitão', '', '', 'Done'],
  ];

  const renderTable = () => {
    if (columns.length > 0 && rows.length > 0) {
      return (
        <>
          <TableContainer component={Paper} style={{ marginTop: '30px', boxShadow: 'none' }}>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  {columns.map(col => (
                    <TableCell align="left">{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow>
                    {row.map(item => (
                      <TableCell>{item}</TableCell>
                    ))}
                    <TableCell>
                      <IconButton color="primary" aria-label="add to shopping cart">
                        <EditIcon sx={{ color: '#e6b200' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Row className="justify-content-center mt-5">
            <Pagination count={10} style={{ width: '370px' }} />
          </Row>
        </>
      );
    } else {
      return (
        <Row className="justify-content-center mt-5">
          <span style={{ color: '#7d7d7d' }}>Nenhum item encontrado.</span>
        </Row>
      );
    }
  };

  return (
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">RNC</Typography>
        </Breadcrumbs>
        <h1 className="title">Lista RNC</h1>
        <div style={{ paddingBottom: '30px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
          <Button
            variant="contained"
            className="primary-button me-2"
            style={{ marginRight: '10px', width: '200px', height: '58px', marginTop: '6px' }}
            onClick={() => navigate('/rnc/new')}
          >
            NOVO REGISTRO
          </Button>
          <FormControl className="mt-2 me-2">
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} className="date-picker" />
          </FormControl>
          <FormControl className="me-2 mt-2">
            <DatePicker selected={endDate} onChange={date => setEndDate(date)} className="date-picker" />
          </FormControl>
          <Select label="Status" options={['Finalizado', 'Outro']}></Select>
          <Select label="Processo" options={['Produção', 'Outro']}></Select>
          <Select label="Tipo" options={['NC', 'OM']} className="me-2"></Select>
          <FormControl id="search-filter">
            <InputLabel htmlFor="outlined-adornment-search">Pesquisa</InputLabel>
            <OutlinedInput
              id="outlined-adornment-search"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" edge="end">
                    <Search />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <Divider sx={{ borderColor: '#7d7d7d' }}></Divider>
        {renderTable()}
      </div>
    </div>
  );
};

export default RncList;
