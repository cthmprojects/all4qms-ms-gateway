import { Breadcrumbs, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row } from 'reactstrap';
import DatePicker from 'react-datepicker';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getById, update } from 'app/modules/rnc/reducers/rnc.reducer';
import { Rnc } from 'app/modules/rnc/models';

export const RegisterImplementationVerification = ({ handleTela, handlePrazoVerificacao }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));

    if (id) {
      dispatch(getById(parseInt(id)));
    }
  }, []);

  const [firstForm, setFirstForm] = useState({
    date: { value: new Date(), error: false },
    emitter: { value: '', error: false },
  });

  const [verify, setVerify] = useState(false);

  const handleChangeDate = (value: any) => {
    setFirstForm({ ...firstForm, date: { value: value, error: firstForm.date.error } });
    handlePrazoVerificacao(value);
  };

  const updateStatus = () => {
    if (_rnc) {
      dispatch(update({ ..._rnc, statusAtual: 'VERIFICACAO' }));
      setTimeout(() => {
        navigate('/rnc');
      }, 1000);
    }
  };
  const _rnc: Rnc = useAppSelector(state => state.all4qmsmsgateway.rnc.entity);

  const users = useAppSelector(state => state.userManagement.users);
  return (
    <div style={{ background: '#fff' }} className="ms-5 me-5 pb-5">
      <Row className="justify-content-center mt-5 me-5">
        <Breadcrumbs aria-label="breadcrumb" className="pt-3 ms-5">
          <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            Home
          </Link>
          <Link to={'/rnc'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
            RNC
          </Link>
          <Link to={'/rnc/general/implementacao/validacao'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
            Eficácia
          </Link>
        </Breadcrumbs>
      </Row>
      <div className="container-style">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="me-5">
            <h2 style={{ fontSize: '20px', color: '#000000DE' }}>Verificação de Eficácia</h2>
            <div className="mt-3" style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
              <FormControlLabel label="Sim" control={<Checkbox onChange={() => setVerify(true)} checked={verify} />} />
              <FormControlLabel label="Não" control={<Checkbox onChange={() => setVerify(false)} checked={!verify} />} />
            </div>
          </div>
          <FormControl className="mb-2 rnc-form-field me-5 mt-5">
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
          <FormControl className="mt-5 mb-2 rnc-form-field">
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
        <div className="mt-4">
          <h2 style={{ fontSize: '20px', color: '#000000DE' }}>Descrição da implementação</h2>
          <textarea rows={5} cols={80} style={{ width: '100%', border: '1px solid #c1c1c1', borderRadius: '4px' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px' }} className="mt-5">
          <Button
            variant="contained"
            className="me-3"
            style={{ background: '#d9d9d9', color: '#4e4d4d' }}
            onClick={() => handleTela('implementacao')}
          >
            Voltar
          </Button>
          <Button onClick={() => navigate('/rnc')}>Salvar</Button>
          <Button
            className="ms-3"
            variant="contained"
            color="primary"
            style={{ background: '#e6b200', color: '#4e4d4d' }}
            onClick={() => updateStatus()}
          >
            Avançar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterImplementationVerification;
