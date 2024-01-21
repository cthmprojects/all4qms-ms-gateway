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
  Menu,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import React, { useEffect, useState } from 'react';
import { Card, Row } from 'reactstrap';
import './rnc.css';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import rncStore, { RNC } from '../rnc-store';
import { Storage } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

const RncList = ({ RNCs }) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [value, setValue] = useState(0);
  const [userId, setUserId] = useState(Storage.session.get('ID_USUARIO'));
  const [userLogin, setUserLogin] = useState(Storage.session.get('LOGIN'));
  const [userRole, setUserRole] = useState(Storage.local.get('ROLE'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openOptions = Boolean(anchorEl);
  const handleClickOptions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  const rncs = rncStore(state => state.rncs);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (rncs?.length > 0) {
      localStorage.setItem('rnc', rncs.length.toString());
    } else {
      localStorage.setItem('rnc', '0');
    }
  }, []);

  const columns = ['Número', 'Emissão', 'Emissor', 'Descrição', 'Responsável', 'Verificação', 'Eficácia', 'Fechamento', 'Status', 'Ações'];

  const rows = [
    [0, 'Teste', 'Admin', 'For Test', 'Admin', '30/09/2023', '', 'Test', '', '', 'Done'],
    [0, 'Teste', 'Vitão', 'For Test', 'Admin', '30/09/2023', '', 'Vitão', '', '', 'Done'],
  ];

  const formatDateToString = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
  };

  const goToPage = (route: string) => {
    handleCloseOptions();
    navigate(route);
  };

  const renderTable = () => {
    if (RNCs?.length > 0) {
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
                {RNCs?.map(rnc => (
                  <TableRow key={rnc.id}>
                    <TableCell>{rnc.id}</TableCell>
                    <TableCell>{formatDateToString(rnc.date)}</TableCell>
                    <TableCell>{rnc.emitter}</TableCell>
                    <TableCell> - </TableCell>
                    <TableCell>{rnc.forwarded}</TableCell>
                    <TableCell> - </TableCell>
                    <TableCell> - </TableCell>
                    <TableCell> - </TableCell>
                    <TableCell> - </TableCell>
                    <TableCell>
                      <IconButton color="primary" aria-label="add to shopping cart" onClick={handleClickOptions}>
                        <FontAwesomeIcon icon="ellipsis-vertical" color="#e6b200" />
                      </IconButton>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openOptions}
                        onClose={handleCloseOptions}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                      >
                        <MenuItem disabled={userLogin !== rnc.forwarded} onClick={() => goToPage('/rnc/general')}>
                          Registrar NC
                        </MenuItem>
                        <MenuItem disabled={userRole !== 'SGQ'} onClick={() => goToPage('/rnc/general/implementacao')}>
                          Plano de ação
                        </MenuItem>
                        <MenuItem disabled={userRole !== 'SGQ'} onClick={() => goToPage('/rnc/general/validacao')}>
                          Validação Plano de ação
                        </MenuItem>
                        <MenuItem disabled={userRole !== 'SGQ'} onClick={() => goToPage('/rnc/general/fechamento')}>
                          Eficácia Plano de Ação
                        </MenuItem>
                        <MenuItem onClick={handleCloseOptions} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          Remover NC
                          <FontAwesomeIcon icon="trash" className="ms-2" color="#ff0000" />
                        </MenuItem>
                      </Menu>
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
            <Pagination count={Math.floor(RNCs.length / 20) + (RNCs.length % 20 > 0 ? 1 : 0)} style={{ width: '370px' }} />
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
            className="primary-button me-2 rnc-list-form-field"
            style={{ marginRight: '10px', height: '58px' }}
            onClick={() => navigate('/rnc/new')}
          >
            NOVO REGISTRO
          </Button>
          <FormControl className="me-2">
            <DatePicker
              // locale='pt-BR'
              selected={startDate}
              onChange={date => setStartDate(date)}
              dateFormat={'dd/MM/yyyy'}
              className="rnc-list-date-picker mt-4"
            />
            <label htmlFor="" className="rnc-list-date-label">
              Ínicio
            </label>
          </FormControl>
          <FormControl className="me-2">
            <DatePicker
              // locale='pt-BR'
              selected={endDate}
              onChange={date => setEndDate(date)}
              dateFormat={'dd/MM/yyyy'}
              className="rnc-list-date-picker mt-4"
            />
            <label htmlFor="" className="rnc-list-date-label">
              Fim
            </label>
          </FormControl>
          <FormControl className="rnc-list-form-field me-2">
            <InputLabel>Status</InputLabel>
            <Select label="Selecione" name="">
              <MenuItem value="1">Finalizado</MenuItem>
              <MenuItem value="2">Outro</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="rnc-list-form-field me-2">
            <InputLabel>Processo</InputLabel>
            <Select label="Selecione" name="">
              <MenuItem value="1">Produção</MenuItem>
              <MenuItem value="2">Outro</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="rnc-list-form-field me-2">
            <InputLabel>Tipo</InputLabel>
            <Select label="Selecione" name="">
              <MenuItem value="1">NC</MenuItem>
              <MenuItem value="2">OM</MenuItem>
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
              <Tab label="Todos" {...a11yProps(0)} />
              <Tab label="Auditoria" {...a11yProps(1)} />
              <Tab label="Reclamação" {...a11yProps(2)} />
              <Tab label="Material" {...a11yProps(3)} />
              <Tab label="Produto" {...a11yProps(4)} />
              <Tab label="Procedimento" {...a11yProps(5)} />
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
          <CustomTabPanel value={value} index={4}>
            {renderTable()}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            {renderTable()}
          </CustomTabPanel>
        </Box>
      </div>
    </div>
  );
};

export default RncList;
