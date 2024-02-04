import { Breadcrumbs, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row } from 'reactstrap';
import DatePicker from 'react-datepicker';
import './register-implementation.css';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';

export const RegisterImplementation = ({ handleTela, handlePrazoImplementacao }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
  }, []);

  const [firstForm, setFirstForm] = useState({
    date: { value: new Date(), error: false },
    emitter: { value: '', error: false },
  });

  const [implement, setImplement] = useState(false);

  const handleChangeDate = (value: any) => {
    setFirstForm({ ...firstForm, date: { value: value, error: firstForm.date.error } });
    handlePrazoImplementacao(value);
  };
  const users = useAppSelector(state => state.userManagement.users);

  return (
    <div style={{ background: '#fff' }} className="ms-5 me-5 pb-5">
      <Row className="justify-content-center mt-5">
        <Breadcrumbs aria-label="breadcrumb" className="pt-3 ms-5">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Link to={'/rnc'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            RNC
          </Link>
          <Link to={'/rnc/general/implementacao'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
            Implementação
          </Link>
        </Breadcrumbs>
      </Row>
      <div className="container-style">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }} className="me-5">
            <h2 style={{ fontSize: '20px', color: '#000000DE' }}>Implementação do plano</h2>
            <div className="mt-3" style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
              <FormControlLabel label="Sim" control={<Checkbox onChange={() => setImplement(true)} checked={implement} />} />
              <FormControlLabel label="Não" control={<Checkbox onChange={() => setImplement(false)} checked={!implement} />} />

              <FormControl className=" mb-2 rnc-form-field mt-3">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={firstForm.date.value}
                  onChange={date => handleChangeDate(date)}
                  className="date-picker"
                />
                <label htmlFor="" className="rnc-date-label">
                  Data
                </label>
              </FormControl>
              <FormControl className="mb-2 rnc-form-field mt-3 ms-4">
                <InputLabel>Responsável</InputLabel>
                <Select label="Responsável" name="forwarded">
                  {users.map((user, i) => (
                    <MenuItem value={user.login} key={`user-${i}`}>
                      {user.login}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h2 style={{ fontSize: '20px', color: '#000000DE' }}>Descrição da implementação</h2>
          <textarea rows={5} cols={80} style={{ width: '100%', border: '1px solid #c1c1c1', borderRadius: '4px' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px' }} className="mt-5">
          <Button
            variant="contained"
            className="me-3"
            style={{ background: '#d9d9d9', color: '#4e4d4d' }}
            onClick={() => handleTela('geral')}
          >
            Voltar
          </Button>
          <Button
            className="ms-3"
            variant="contained"
            color="primary"
            style={{ background: '#e6b200', color: '#4e4d4d' }}
            onClick={() => navigate('/rnc')}
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterImplementation;
