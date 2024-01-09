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
  Select,
  Box,
  Tabs,
  Tab,
} from '@mui/material';

import DatePicker from 'react-datepicker';
import React, { useEffect, useState } from 'react';
import { Card, Row } from 'reactstrap';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from '@mui/icons-material';

import './infodoc.css';
import infodocStore, { INFODOC } from '../infodoc-store';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const InfodocList = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [value, setValue] = useState(0);

  const infodocs = infodocStore(state => state.infodocs);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (infodocs?.length > 0) {
      localStorage.setItem('infodoc', infodocs.length.toString());
    } else {
      localStorage.setItem('infodoc', '0');
    }
  }, []);

  const columns = ['Código', 'Título', 'Emissor', 'Revisão', 'Data', 'Área/Processo', 'Origem', 'Situação', 'Distribuição', 'Ações'];

  const formatDateToString = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
  };

  //////////////////////////////////
  const renderTable = () => {
    if (infodocs?.length > 0) {
      return (
        <>
          <TableContainer component={Paper} style={{ marginTop: '30px', boxShadow: 'none' }}>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  {columns.map(col => (
                    // eslint-disable-next-line react/jsx-key
                    <TableCell align="left">{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {infodocs?.map((infodoc: INFODOC) => (
                  <TableRow key={infodoc.codigo}>
                    <TableCell>{infodoc.codigo}</TableCell>
                    <TableCell>{infodoc.titulo}</TableCell>
                    <TableCell>{infodoc.emissor}</TableCell>
                    <TableCell>{infodoc.revisao}</TableCell>
                    <TableCell>{formatDateToString(infodoc.data)}</TableCell>
                    <TableCell>{infodoc.area_processo}</TableCell>
                    <TableCell>{infodoc.origem}</TableCell>
                    <TableCell>{infodoc.situacao}</TableCell>
                    <TableCell>{infodoc.distribuicao}</TableCell>
                    <TableCell>
                      <IconButton color="primary" aria-label="add to shopping cart">
                        <EditIcon sx={{ color: '#e6b200' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {/* {rows.map(row => (
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
                        ))} */}
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
    //////////////////////////////////////
    <div className="padding-container">
      <div className="container-style">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Typography className="link">Informações Documentais</Typography>
        </Breadcrumbs>
        <h1 className="title">Lista Informações Documentais</h1>
        <div style={{ paddingBottom: '30px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
          <Button
            variant="contained"
            className="primary-button me-2 infodoc-list-form-field"
            style={{ marginRight: '10px', height: '58px' }}
            onClick={() => navigate('')}
          >
            NOVO DOCUMENTO
          </Button>
          <FormControl className="me-2">
            <DatePicker
              // locale='pt-BR'
              selected={startDate}
              onChange={date => setStartDate(date)}
              className="infodoc-list-date-picker mt-4"
            />
            <label htmlFor="" className="infodoc-list-date-label">
              Ínicio
            </label>
          </FormControl>
          <FormControl className="me-2">
            <DatePicker
              // locale='pt-BR'
              selected={endDate}
              onChange={date => setEndDate(date)}
              className="infodoc-list-date-picker mt-4"
            />
            <label htmlFor="" className="infodoc-list-date-label">
              Fim
            </label>
          </FormControl>
          <FormControl className="infodoc-list-form-field me-2">
            <InputLabel>Área / Processo</InputLabel>
            <Select label="Selecione" name="">
              <MenuItem value="1">Produção</MenuItem>
              <MenuItem value="2">Qualidade</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="infodoc-list-form-field me-2">
            <InputLabel>Origem</InputLabel>
            <Select label="Selecione" name="">
              <MenuItem value="1">Interna</MenuItem>
              <MenuItem value="2">Externa</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="infodoc-list-form-field me-2">
            <InputLabel>Situação</InputLabel>
            <Select label="Selecione" name="">
              <MenuItem value="1">Homologada</MenuItem>
              <MenuItem value="2">Obsoleto</MenuItem>
              <MenuItem value="3">Edição</MenuItem>
            </Select>
          </FormControl>
          <FormControl id="search-filter">
            <InputLabel htmlFor="outlined-adornment-search" className="mui-label-transform">
              Pesquisar
            </InputLabel>
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
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Formulários" {...a11yProps(0)} />
              <Tab label="Processo" {...a11yProps(1)} />
              <Tab label="Instrução" {...a11yProps(2)} />
              <Tab label="Distribuição" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            {renderTable()}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {renderTable()}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            {renderTable()}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            {renderTable()}
          </CustomTabPanel>
        </Box>
      </div>
    </div>
  );
};

export default InfodocList;
