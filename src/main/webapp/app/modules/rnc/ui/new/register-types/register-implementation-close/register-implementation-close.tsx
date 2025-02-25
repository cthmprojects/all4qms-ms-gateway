import { Breadcrumbs, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import { saveMinimalRiskOpportunity } from 'app/modules/risks-opportunities/reducers/risks-opportunities.reducer';
import { Rnc } from 'app/modules/rnc/models';
import { getApprovalNC, updateApprovalNC } from 'app/modules/rnc/reducers/approval.reducer';
import { getById, update } from 'app/modules/rnc/reducers/rnc.reducer';
import { IUser } from 'app/shared/model/user.model';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row } from 'reactstrap';

export const RegisterImplementationClose = ({ handleTela, save, handlePrazoFechamento }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const account = useAppSelector(state => state.authentication.accountQms) as IUser;
  const rnc: Rnc = useAppSelector(state => state.all4qmsmsgateway.rnc.entity);

  useEffect(() => {
    dispatch(getUsers({}));

    if (id) {
      dispatch(getById(parseInt(id)));
    }
  }, []);

  const [firstForm, setFirstForm] = useState({
    date: { value: new Date(), error: false },
    emitter: { value: '', error: false },
    changeRisk: { value: false, error: false },
    description: { value: '', error: false },
    riskOpportunity: { value: '', error: false },
  });

  const handleChangeDate = (value: any) => {
    setFirstForm({ ...firstForm, date: { value: value, error: firstForm.date.error } });
    handlePrazoFechamento(value);
  };

  const saveCompletion = () => {
    if (completion) {
      const closingDate: Date = firstForm.date.value;
      const changeRisk: boolean = firstForm.changeRisk.value ?? false;
      const description: string = firstForm.description.value;
      const responsible: number | null = users.find(user => user.id === firstForm.emitter.value)?.id;

      dispatch(
        updateApprovalNC({
          ...completion,
          dataFechamento: closingDate,
          responsavelFechamento: responsible,
          alteracaoRisco: changeRisk,
          descFechamento: description,
        })
      );
      toast.success('Fechamento salvo com sucesso!');
    }
  };

  const updateStatus = () => {
    if (_rnc) {
      const closingDate: Date = firstForm.date.value;
      const changeRisk: boolean = firstForm.changeRisk.value ?? false;
      const description: string = firstForm.description.value;
      const responsible: number | null = users.find(user => user.id === firstForm.emitter.value)?.id;
      const riskOpportunity: string = firstForm.riskOpportunity.value;

      const shouldCreateRiskOpportunity: boolean = changeRisk && riskOpportunity.length > 0;

      if (shouldCreateRiskOpportunity) {
        dispatch(
          saveMinimalRiskOpportunity({
            atualizadoEm: null,
            atualizadoPor: null,
            criadoEm: null,
            criadoPor: null,
            dataRegistro: closingDate,
            descricao1: description,
            descricao2: description,
            descricao3: description,
            descricaoControle: description,
            id: null,
            idEmissor: responsible,
            idLinhaConfigControle1: null,
            idLinhaConfigControle2: null,
            idPartesInteressadas: null,
            idProcesso: rnc.processoNC,
            idsAnaliseROS: [],
            nomeAtividade: '',
            nomeFluxo: '',
            tipoRO: riskOpportunity === 'risk' ? 'R' : 'O',
            analiseROS: null,
            linhaConfigControle1: null,
            linhaConfigControle2: null,
            partesInteressadas: null,
          })
        );

        const message: string = riskOpportunity === 'risk' ? 'Novo risco salvo' : 'Nova oportunidade salva';
        toast.success(`${message} com sucesso!`);
      }

      dispatch(
        updateApprovalNC({
          ...completion,
          dataFechamento: closingDate,
          responsavelFechamento: responsible,
          alteracaoRisco: changeRisk,
          descFechamento: description,
        })
      );
      dispatch(update({ ..._rnc, statusAtual: 'CONCLUIDO' })).then(() => {
        navigate('/rnc');
      });
      toast.success('Fechamento salvo com sucesso!');
    }
  };

  const _rnc: Rnc = useAppSelector(state => state.all4qmsmsgateway.rnc.entity);
  const users = useAppSelector(state => state.all4qmsmsgateway.users.entities);
  const completion = useAppSelector(state => state.all4qmsmsgateway.approval.entity);

  useEffect(() => {
    if (_rnc?.aprovacaoNC) {
      dispatch(getApprovalNC(_rnc.aprovacaoNC));
    }
  }, [_rnc]);

  useEffect(() => {
    if (completion) {
      const idResponsavelFechamento = users.find(user => user.id === completion.responsavelFechamento)?.id;
      const definitiveId = idResponsavelFechamento || account?.id;

      setFirstForm({
        date: { value: completion.dataFechamento ? new Date(completion.dataFechamento) : new Date(), error: false },
        emitter: {
          value: definitiveId || '',
          error: false,
        },
        changeRisk: { value: completion.alteracaoRisco, error: false },
        description: { value: completion.descFechamento, error: false },
        riskOpportunity: { value: '', error: false },
      });
    }
  }, [completion, users, account]);

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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '170px' }} className="me-2">
            <h2 style={{ fontSize: '20px', color: '#000000DE' }}>Fechamento</h2>
            <FormControl className="mb-2 rnc-form-field mt-3">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={firstForm.date.value}
                onChange={date => handleChangeDate(date)}
                className="date-picker"
                value={firstForm.date.value}
              />
              <label htmlFor="" className="rnc-date-label">
                Data
              </label>
            </FormControl>
          </div>
          <FormControl className="mt-5 mb-2 rnc-form-field">
            <InputLabel>Responsável</InputLabel>
            <Select
              label="Responsável"
              name="forwarded"
              onChange={(e: SelectChangeEvent<string>) => {
                setFirstForm({ ...firstForm, emitter: { value: e.target.value, error: false } });
              }}
              value={firstForm.emitter.value}
            >
              {users.map((user, i) => (
                <MenuItem value={user.id} key={`user-${i}`}>
                  {user.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="me-5">
            <h2 style={{ fontSize: '20px', color: '#000000DE' }}>Alterar Risco/Oportunidade</h2>
            <div className="mt-3" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <FormControlLabel
                label="Sim"
                control={
                  <Checkbox
                    onChange={() => setFirstForm({ ...firstForm, changeRisk: { value: true, error: false } })}
                    checked={firstForm.changeRisk.value}
                  />
                }
              />
              <FormControlLabel
                label="Não"
                control={
                  <Checkbox
                    onChange={() => setFirstForm({ ...firstForm, changeRisk: { value: false, error: false } })}
                    checked={!firstForm.changeRisk.value}
                  />
                }
              />
            </div>
          </div>
          <FormControl className="mb-2 rnc-form-field me-2 mt-5" style={{ maxWidth: '25%' }}>
            <InputLabel>Risco / Oportunidade alterada</InputLabel>
            <Select
              label="Risco / Oportunidade alterada"
              name="processOrigin"
              onChange={event => {
                const value: string = event.target.value as string;
                setFirstForm({ ...firstForm, riskOpportunity: { value: value, error: false } });
              }}
            >
              <MenuItem value="risk">Risco</MenuItem>
              <MenuItem value="opportunity">Oportunidade</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="mt-4">
          <h2 style={{ fontSize: '20px', color: '#000000DE' }}>Descrição do Fechamento</h2>
          <textarea
            rows={5}
            cols={80}
            style={{ width: '100%', border: '1px solid #c1c1c1', borderRadius: '4px' }}
            value={firstForm.description.value}
            onChange={e => setFirstForm({ ...firstForm, description: { value: e.target.value, error: false } })}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px' }} className="mt-5">
          <Button variant="contained" className="me-3" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={() => navigate('/rnc')}>
            Voltar
          </Button>
          <Button onClick={() => saveCompletion()}>Salvar</Button>
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

export default RegisterImplementationClose;
