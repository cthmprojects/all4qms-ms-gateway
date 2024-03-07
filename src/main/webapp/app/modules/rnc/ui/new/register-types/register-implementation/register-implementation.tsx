import {
  Breadcrumbs,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row } from 'reactstrap';
import DatePicker from 'react-datepicker';
import './register-implementation.css';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { saveApprovalNC, updateApprovalNC, getApprovalNC } from 'app/modules/rnc/reducers/approval.reducer';
import { getById, update } from 'app/modules/rnc/reducers/rnc.reducer';
import { Rnc } from 'app/modules/rnc/models';

export const RegisterImplementation = ({ handleTela, handlePrazoImplementacao }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
    implemented: { value: false, error: false },
    description: { value: '', error: false },
  });

  const handleChangeDate = (value: any) => {
    setFirstForm({ ...firstForm, date: { value: value, error: firstForm.date.error } });
    handlePrazoImplementacao(value);
  };

  const saveImplementation = () => {
    if (implementation) {
      dispatch(
        updateApprovalNC({
          ...implementation,
          possuiImplementacao: firstForm.implemented.value,
          dataImplementacao: firstForm.date.value,
          responsavelImplementacao: users.find(user => user.login === firstForm.emitter.value)?.id,
          descImplementacao: firstForm.description.value,
        })
      );
    } else {
      const new_implementation = {
        possuiImplementacao: firstForm.implemented.value,
        dataImplementacao: firstForm.date.value,
        responsavelImplementacao: users.find(user => user.login === firstForm.emitter.value)?.id,
        descImplementacao: firstForm.description.value,
      };
      dispatch(saveApprovalNC(new_implementation));
    }
  };

  const updateStatus = () => {
    if (_rnc) {
      dispatch(update({ ..._rnc, statusAtual: 'EXECUCAO' }));
      setTimeout(() => {
        navigate('/rnc');
      }, 1000);
    }
  };

  const _rnc: Rnc = useAppSelector(state => state.all4qmsmsgateway.rnc.entity);
  const users = useAppSelector(state => state.userManagement.users);
  const implementation = useAppSelector(state => state.all4qmsmsgateway.approval.entity);

  useEffect(() => {
    if (_rnc?.aprovacaoNC) {
      dispatch(getApprovalNC(_rnc.aprovacaoNC));
    }
  }, [_rnc]);

  useEffect(() => {
    console.log('IMPLEMENTACAO> ', implementation);

    setFirstForm({
      date: { value: implementation?.dataImplementacao ? new Date(implementation.dataImplementacao) : new Date(), error: false },
      emitter: {
        value: implementation?.responsavelImplementacao
          ? users.find(user => user.id === implementation.responsavelImplementacao)?.login
          : '',
        error: false,
      },
      implemented: { value: implementation?.possuiImplementacao ? implementation.possuiImplementacao : false, error: false },
      description: { value: implementation?.descImplementacao ? implementation.descImplementacao : '1', error: false },
    });
  }, [implementation]);

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
              <FormControlLabel
                label="Sim"
                control={
                  <Checkbox
                    onChange={() => setFirstForm({ ...firstForm, implemented: { value: true, error: false } })}
                    checked={firstForm.implemented.value}
                  />
                }
              />
              <FormControlLabel
                label="Não"
                control={
                  <Checkbox
                    onChange={() => setFirstForm({ ...firstForm, implemented: { value: false, error: false } })}
                    checked={!firstForm.implemented.value}
                  />
                }
              />

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
                <Select
                  label="Responsável"
                  name="forwarded"
                  onChange={(e: SelectChangeEvent<string>) =>
                    setFirstForm({ ...firstForm, emitter: { value: e.target.value, error: false } })
                  }
                >
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
          <textarea
            onChange={e => setFirstForm({ ...firstForm, description: { value: e.target.value, error: false } })}
            rows={5}
            cols={80}
            style={{ width: '100%', border: '1px solid #c1c1c1', borderRadius: '4px' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px' }} className="mt-5">
          <Button variant="contained" className="me-3" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={() => navigate('/rnc')}>
            Voltar
          </Button>
          <Button onClick={() => saveImplementation()}>Salvar</Button>
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

export default RegisterImplementation;
