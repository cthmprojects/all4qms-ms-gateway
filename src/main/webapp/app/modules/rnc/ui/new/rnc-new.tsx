/* eslint-disable default-case */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable radix */
/* eslint-disable object-shorthand */
import { Breadcrumbs, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/entities/usuario/reducers/usuario.reducer';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Storage } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Row } from 'reactstrap';
import { Enums, Rnc } from '../../models';
import { listEnums } from '../../reducers/enums.reducer';
import { list, save, saveAudit, saveClient, saveDescription, saveProduct, update, getById } from '../../reducers/rnc.reducer';
import { getById as getDescriptionById } from '../../reducers/description.reducer';
import DescriptionRnc from './register-types/description/description';
import ExternalAuditRegister from './register-types/external-audit/external-audit-register';
import InternalAuditRegister from './register-types/internal-audit/internal-audit-register';
import MPRegister from './register-types/mp-register/mp-register';
import OthersRegister from './register-types/others-register/others-register';
import ProductRegister from './register-types/product-register/product-register';
import RepetitionRnc from './register-types/repetition/repetition-rnc';
import ClientRegister from './register-types/rnc-client/rnc-client-register';
import { validateFields } from './rnc-new-validates';
import './rnc-new.css';

export const RNCNew = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    dispatch(list({}));
    dispatch(listEnums());

    if (id) {
      dispatch(getById(parseInt(id)));
    }
  }, []);

  const navigate = useNavigate();
  const [firstForm, setFirstForm] = useState({
    number: {
      value: '1',
      error: false,
    },
    emitter: {
      value: Storage.session.get('firstName'),
      error: false,
    },
    processOrigin: {
      value: '',
      error: false,
    },
    forwarded: {
      value: '',
      error: false,
    },
    processTarget: {
      value: '',
      error: false,
    },
    date: {
      value: new Date(),
      error: false,
    },
    type: {
      value: '',
      error: false,
    },
    origin: {
      value: '',
      error: false,
    },
  });

  const [typeBreadcrumbLabel, setTypeBreadcrumbLabel] = useState('');
  const [originBreadcrumbLabel, setOriginBreadcrumbLabel] = useState('');
  const [descriptionEvidences, setDescriptionEvidences] = useState([]);

  const onDescriptionEvidencesChanged = (values: Array<File>) => {
    setDescriptionEvidences(values);
  };

  const handleTypeChange = event => {
    const { value } = event.target;
    // eslint-disable-next-line default-case
    switch (value) {
      case 'NC':
        setTypeBreadcrumbLabel('Registro de Não Conformidade');
        break;
      case 'OM':
        setTypeBreadcrumbLabel('Oportunidade de Melhoria');
        break;
      default:
        setOriginBreadcrumbLabel(value);
    }
  };

  const handleOriginChange = event => {
    const { value } = event.target;
    switch (value) {
      case 'AUDITORIA_EXTERNA':
        setOriginBreadcrumbLabel('Auditoria Externa');
        break;
      case 'AUDITORIA_INTERNA':
        setOriginBreadcrumbLabel('Auditoria Interna');
        break;
      case 'CLIENTE':
        setOriginBreadcrumbLabel('Cliente');
        break;
      case 'MATERIA_PRIMA_INSUMO':
        setOriginBreadcrumbLabel('Matéria Prima');
        break;
      case 'PRODUTO_ACABADO':
        setOriginBreadcrumbLabel('Produto Acabado');
        break;
      case 'PROCEDIMENTO_OUTROS':
        setOriginBreadcrumbLabel('Outros');
        break;
      default:
        setOriginBreadcrumbLabel(value);
    }
  };

  const [secondForm, setSecondForm] = useState(false);
  const [formError, setFormError] = useState(false);

  // provisorio
  const [tela, setTela] = useState('cadastro');

  /*
   NC Description
   */
  const [description, setDescription] = useState<string>('');
  const [evidences, setEvidences] = useState<Array<string>>(['']);
  const [requirement, setRequirements] = useState<string>('');

  const onDescriptionChanged = (value: string) => {
    setDescription(value);
  };

  const onEvidencesChanged = (values: Array<string>) => {
    setEvidences(values);
  };

  const onRequirementChanged = (value: string) => {
    setRequirements(value);
  };

  /*
   NC Repetition
   */
  const [repetition, setRepetition] = useState<boolean>();
  const [selectedRncIds, setSelectedRncIds] = useState<Array<number>>([]);

  const onRepetitionChanged = (value: boolean) => {
    setRepetition(value);
  };

  const onSelectedRncIdsChanged = (values: Array<number>) => {
    setSelectedRncIds(values);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (rnc) {
      const receptorNC = filterUser(firstForm.forwarded.value);
      const dtNC = new Date();
      const idEmissorNC = parseInt(Storage.session.get('ID_USUARIO'));
      const idReceptorNC = receptorNC ? parseInt(receptorNC.id) : null;
      const idUsuarioAtual = parseInt(Storage.session.get('ID_USUARIO'));
      const origemNC = firstForm.origin.value;
      const processoEmissor = parseInt(firstForm.processOrigin.value);
      const processoNC = parseInt(firstForm.processTarget.value);
      const statusAtual = 'PREENCHIMENTO';
      const tipoNC = firstForm.type.value;

      dispatch(
        update({
          id: rnc.id,
          statusAtual: statusAtual,
          idUsuarioAtual: idUsuarioAtual,
          dtNC: dtNC,
          tipoNC: tipoNC,
          origemNC: origemNC,
          possuiReincidencia: true,
          idEmissorNC: idEmissorNC,
          processoNC: processoNC,
          idReceptorNC: idReceptorNC,
          processoEmissor: processoEmissor,
        })
      );

      setSecondForm(true);
      return;
    }
    if (validateFields(firstForm, setFirstForm, setFormError)) {
      toast.success('RNC salva com sucesso!');

      const receptorNC = filterUser(firstForm.forwarded.value);
      const dtNC = new Date();
      const idEmissorNC = parseInt(Storage.session.get('ID_USUARIO'));
      const idReceptorNC = receptorNC ? parseInt(receptorNC.id) : null;
      const idUsuarioAtual = parseInt(Storage.session.get('ID_USUARIO'));
      const origemNC = firstForm.origin.value;
      const processoEmissor = parseInt(firstForm.processOrigin.value);
      const processoNC = parseInt(firstForm.processTarget.value);
      const statusAtual = 'PREENCHIMENTO';
      const tipoNC = firstForm.type.value;

      dispatch(
        save({
          statusAtual: statusAtual,
          idUsuarioAtual: idUsuarioAtual,
          dtNC: dtNC,
          tipoNC: tipoNC,
          origemNC: origemNC,
          possuiReincidencia: true,
          idEmissorNC: idEmissorNC,
          processoNC: processoNC,
          idReceptorNC: idReceptorNC,
          processoEmissor: processoEmissor,
        })
      );

      setSecondForm(true);
    }
    return;
  };

  const setExternalAuditRegister = data => {
    dispatch(
      saveAudit({
        norm: data.norma,
        occurrence: data.numberNC,
        process: data.numberReport,
        requirement: data.normaRequiremeents,
        rncId: rnc?.id,
        sequence: 1,
      })
    );
  };

  const setClientRegister = data => {
    dispatch(
      saveClient({
        batch: data.lot,
        batchAmount: data.lotQuantity,
        code: data.productCode,
        defects: data.defectRate,
        description: data.productDescription,
        name: data.name,
        opNumber: data.opNumber,
        order: data.requestNumber,
        rejected: data.rejectedQuantity,
        samples: data.batchAmount,
        supplier: data.productCode2,
        traceability: {
          date: data.nfDate,
          deliveredAt: data.deliveryDate,
          identifier: data.receipt,
          rncId: rnc.id,
        },
      })
    );
  };

  const setInternalAuditRegister = data => {
    dispatch(
      saveAudit({
        norm: data.norma,
        occurrence: data.numberNC,
        process: data.numberReport,
        requirement: data.normaRequiremeents,
        rncId: rnc?.id,
        sequence: 1,
      })
    );
  };

  const setMPRegister = data => {
    console.log('[mp] data', data);
  };

  const setProductRegister = data => {
    dispatch(
      saveProduct({
        batch: data.lot,
        batchAmount: data.lotQuantity,
        code: data.productCode,
        defects: data.defectRate,
        description: data.productDescription,
        name: data.name,
        opNumber: data.opNumber,
        order: data.requestNumber,
        rejected: data.rejectedQuantity,
        samples: data.batchAmount,
        supplier: data.productCode2,
        traceability: {
          date: data.nfDate,
          deliveredAt: data.deliveryDate,
          identifier: data.receipt,
          rncId: rnc.id,
        },
      })
    );
  };

  const setOthersRegister = data => {
    console.log('[others] data', data);
  };

  const renderComponents = () => {
    switch (firstForm.origin.value) {
      case 'AUDITORIA_EXTERNA':
        return <ExternalAuditRegister setExternalAuditRegister={setExternalAuditRegister} />;
      case 'AUDITORIA_INTERNA':
        return <InternalAuditRegister setInternalAuditRegister={setInternalAuditRegister} />;
      case 'CLIENTE':
        return <ClientRegister onClientChange={setClientRegister} />;
      case 'MATERIA_PRIMA_INSUMO':
        return <MPRegister onMPChange={setMPRegister} />;
      case 'PRODUTO_ACABADO':
        return <ProductRegister onProductRegisterChange={setProductRegister} />;
      case 'PROCEDIMENTO_OUTROS':
        return <OthersRegister onOthersRegisterChange={setOthersRegister} />;
    }
  };

  const onSaveRncDescription = () => {
    for (let i = 0; i < evidences.length; i++) {
      const evidence = evidences[i];

      dispatch(
        saveDescription({ details: description, evidence: evidence, requirement: requirement, rncId: rnc.id, anexos: descriptionEvidences })
      );
      dispatch(update({ ...rnc, statusAtual: 'DETALHAMENTO' }));
    }
  };

  const filterUser = (login: string) => {
    if (!users || users.length <= 0) {
      return null;
    }

    return users.find(user => user.login === login);
  };

  const users = useAppSelector(state => state.all4qmsmsgateway.users.entities);
  const rncs: Array<Rnc> = useAppSelector(state => state.all4qmsmsgateway.rnc.entities);
  const rnc: Rnc = useAppSelector(state => state.all4qmsmsgateway.rnc.entity);
  const enums = useAppSelector<Enums | null>(state => state.all4qmsmsgateway.enums.enums);

  useEffect(() => {
    if (rnc) {
      setFirstForm({
        number: { value: String(rnc.id), error: false },
        emitter: { value: users.find(user => user.id === rnc.idEmissorNC)?.nome || '', error: false },
        date: { value: new Date(rnc.dtNC), error: false },
        processOrigin: { value: rnc.processoEmissor?.toString() || '', error: false },
        forwarded: { value: users.find(user => user.id === rnc.idUsuarioAtual)?.nome || '', error: false },
        processTarget: { value: rnc.processoNC?.toString() || '', error: false },
        type: { value: rnc.tipoNC || '', error: false },
        origin: { value: rnc.origemNC || '', error: false },
      });

      if (rnc.statusAtual === 'DETALHAMENTO') {
        setSecondForm(true);

        // getDescriptionById(rnc.id);
        // TODO: fetch description and other data
        // Update the state with the data
      }
    }
  }, [users, rnc]);

  if (tela === 'cadastro') {
    return (
      <>
        <div style={{ background: '#fff' }} className="ms-5 me-5 pb-5">
          <Row className="justify-content-center mt-5">
            <Breadcrumbs aria-label="breadcrumb" className="pt-3 ms-5">
              <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
                Home
              </Link>
              <Link to={'/rnc'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
                RNC-OM
              </Link>
              <Typography style={{ color: '#606060' }}>Novo registro</Typography>
              {typeBreadcrumbLabel && <Typography style={{ color: '#606060' }}>{typeBreadcrumbLabel}</Typography>}
              {originBreadcrumbLabel && <Typography style={{ color: '#606060' }}>{originBreadcrumbLabel}</Typography>}
            </Breadcrumbs>
            <h2 id="all4QmsMsGatewayApp.usuario.home.createOrEditLabel" data-cy="UsuarioCreateUpdateHeading" className="ms-5 mt-5">
              Novo registro
            </h2>
          </Row>
          <div className="container-style">
            <form onSubmit={handleSubmit}>
              <div
                style={{ display: 'flex', flexFlow: 'row wrap', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}
              >
                <TextField
                  sx={{ height: '60px' }}
                  label="Nº"
                  name="number"
                  id="rnc-text-field"
                  disabled
                  value={firstForm.number.value}
                  className="rnc-form-field me-2 mb-2"
                />

                <TextField
                  sx={{ height: '60px' }}
                  label="Emitido por:"
                  name="emitter"
                  id="rnc-text-field"
                  value={firstForm.emitter.value}
                  disabled
                  className="rnc-form-field me-2 mb-2"
                />

                <FormControl className="mb-2 rnc-form-field me-2">
                  <InputLabel>Processo ou empresa</InputLabel>
                  <Select
                    label="Processo ou empresa"
                    name="processOrigin"
                    disabled={secondForm}
                    value={firstForm.processOrigin.value}
                    // error={}
                    error={firstForm.processOrigin.error}
                    onChange={event =>
                      setFirstForm({ ...firstForm, processOrigin: { value: event.target.value, error: firstForm.processOrigin.error } })
                    }
                  >
                    <MenuItem value="1">Produção</MenuItem>
                    <MenuItem value="2">Engenharia de teste</MenuItem>
                    <MenuItem value="3">Estoque</MenuItem>
                    <MenuItem value="4">Expedição</MenuItem>
                    <MenuItem value="5">PCP</MenuItem>
                  </Select>
                </FormControl>

                <FormControl className="mb-2 rnc-form-field me-2">
                  <InputLabel>Encaminhado para:</InputLabel>
                  <Select
                    label="Encaminhado para:"
                    name="forwarded"
                    disabled={secondForm}
                    value={firstForm.forwarded.value}
                    error={firstForm.forwarded.error}
                    onChange={event =>
                      setFirstForm({ ...firstForm, forwarded: { value: event.target.value, error: firstForm.forwarded.error } })
                    }
                  >
                    {users.map((user, i) => (
                      <MenuItem value={user.nome} key={`user-${i}`}>
                        {user.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className="mb-2 rnc-form-field me-2">
                  <InputLabel>Processo ou empresa</InputLabel>
                  <Select
                    label="Processo ou empresa"
                    name="processTarget"
                    disabled={secondForm}
                    value={firstForm.processTarget.value}
                    error={firstForm.processTarget.error}
                    onChange={event =>
                      setFirstForm({ ...firstForm, processTarget: { value: event.target.value, error: firstForm.processTarget.error } })
                    }
                  >
                    <MenuItem value="1">Produção</MenuItem>
                    <MenuItem value="2">Engenharia de teste</MenuItem>
                    <MenuItem value="3">Estoque</MenuItem>
                    <MenuItem value="4">Expedição</MenuItem>
                    <MenuItem value="5">PCP</MenuItem>
                  </Select>
                </FormControl>

                <FormControl className="mb-2 rnc-form-field me-2">
                  <DatePicker
                    selected={firstForm.date.value}
                    disabled={secondForm}
                    onChange={date => setFirstForm({ ...firstForm, date: { value: date, error: firstForm.date.error } })}
                    className="date-picker"
                    dateFormat={'dd/MM/yyyy'}
                  />
                  <label htmlFor="" className="rnc-date-label">
                    Data
                  </label>
                </FormControl>

                <FormControl className="mb-2 rnc-form-field me-2">
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    label="Selecione o tipo"
                    name="type"
                    disabled={secondForm}
                    error={firstForm.type.error}
                    value={firstForm.type.value}
                    onChange={event => {
                      setFirstForm(prevState => ({
                        ...prevState,
                        type: { value: event.target.value, error: prevState.type.error },
                      }));
                      handleTypeChange(event);
                    }}
                  >
                    {enums?.nonConformityTypes.map((type, index) => (
                      <MenuItem key={index} value={type.name}>
                        {type.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className="mb-2 rnc-form-field me-2">
                  <InputLabel>Origem</InputLabel>
                  <Select
                    label="Selecione a origem"
                    name="origin"
                    disabled={secondForm}
                    value={firstForm.origin.value}
                    error={firstForm.origin.error}
                    onChange={event => {
                      setFirstForm(prevState => ({
                        ...prevState,
                        origin: { value: event.target.value, error: prevState.origin.error },
                      }));
                      handleOriginChange(event);
                    }}
                  >
                    {enums?.originTypes.map((type, index) => (
                      <MenuItem key={index} value={type.name}>
                        {type.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {secondForm ? null : (
                <div className="mt-2 me-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    className="me-3"
                    style={{ background: '#d9d9d9', color: '#4e4d4d' }}
                    onClick={() => navigate('/rnc')}
                  >
                    Voltar
                  </Button>
                  <Button type="submit" variant="contained" color="primary" style={{ background: '#e6b200', color: '#4e4d4d' }}>
                    {rnc ? 'Atualizar' : 'Salvar'}
                  </Button>
                </div>
              )}
            </form>
          </div>

          {secondForm ? (
            <>
              <Row className="ms-3 me-3 mt-3">{renderComponents()}</Row>
              <Row className="ms-3 me-3 mt-3">
                <DescriptionRnc
                  description={description}
                  evidences={evidences}
                  onDescriptionChanged={onDescriptionChanged}
                  onEvidencesChanged={onEvidencesChanged}
                  onRequirementChanged={onRequirementChanged}
                  onDescriptionsEvidencesChanged={onDescriptionEvidencesChanged}
                  requirement={requirement}
                />
              </Row>
              <Row className="ms-3 me-3 mt-3" fullWidth>
                <RepetitionRnc
                  onRepetitionChanged={onRepetitionChanged}
                  onSelectedRncIdsChanged={onSelectedRncIdsChanged}
                  repetition={repetition}
                  rncs={rncs}
                  selectedRncIds={selectedRncIds}
                />
              </Row>
              <Row className="m-3">
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    className="me-3"
                    style={{ background: '#d9d9d9', color: '#4e4d4d' }}
                    onClick={() => navigate('/rnc')}
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ background: '#e6b200', color: '#4e4d4d' }}
                    onClick={onSaveRncDescription}
                  >
                    Salvar
                  </Button>
                </div>
              </Row>
            </>
          ) : null}
        </div>
      </>
    );
  }
};

export default RNCNew;
