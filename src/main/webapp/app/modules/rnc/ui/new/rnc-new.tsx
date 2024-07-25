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
import { Enums, GeneralAudit, Process, RawMaterial, Rnc } from '../../models';
import { getDescription, getDescriptionByRNCId } from '../../reducers/description.reducer';
import { listEnums } from '../../reducers/enums.reducer';
import { getProcesses } from '../../reducers/process.reducer';
import {
  axiosGetProduct,
  axiosSaveAudit,
  axiosSaveProduct,
  axiosSaveRawMaterial,
  getById,
  list,
  save,
  saveClientComplaint,
  saveDescription,
  saveProductComplaint,
  update,
  updateDescription,
} from '../../reducers/rnc.reducer';
import DescriptionRnc from './register-types/description/description';
import ExternalAuditRegister from './register-types/external-audit/external-audit-register';
import InternalAuditRegister from './register-types/internal-audit/internal-audit-register';
import MPRegister from './register-types/mp-register/mp-register';
import OthersRegister from './register-types/others-register/others-register';
import ProductRegister from './register-types/product-register/product-register';
import ClientRegister from './register-types/rnc-client/rnc-client-register';
import { validateFields } from './rnc-new-validates';
import './rnc-new.css';
import axios from 'axios';

const sendNotification = async (title: string, user: any) => {
  let url = '/api/pendencias';
  await axios.post(url, {
    nome: title,
    status: false,
    tipo: 'ATIVIDADE',
    responsavel: user,
    link: '/rnc',
  });
};

export const RNCNew = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getUsers({ page: 0, size: 100, sort: 'ASC' }));
    dispatch(list({}));
    dispatch(listEnums());

    if (id) {
      dispatch(getById(parseInt(id)));
      dispatch(getDescriptionByRNCId(id));
    } else {
      setDescription('');
      setRequirements('');
      setEvidences(['']);
    }

    dispatch(getProcesses());
  }, []);

  const navigate = useNavigate();
  const [firstForm, setFirstForm] = useState({
    number: {
      value: '-',
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
  const [descriptionEvidences, setDescriptionEvidences] = useState<Array<File>>();
  const [stateRnc, setStateRnc] = useState<Rnc>();

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
  const [evidences, setEvidences] = useState<Array<string>>([]);
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

  /*
   NC Origin
   */
  const [externalAudit, setExternalAudit] = useState<GeneralAudit | null>(null);
  const [internalAudit, setInternalAudit] = useState<GeneralAudit | null>(null);
  const [others, setOthers] = useState<string | null>(null);
  const [rawMaterial, setRawMaterial] = useState<RawMaterial | null>(null);
  const [productComplaint, setProductComplaint] = useState<RawMaterial | null>(null);
  const [productComplaintFinal, setProductComplaintFinal] = useState<RawMaterial | null>(null);
  const [clientLink, setClientLink] = useState<number | null>(null);
  const [productLink, setProductLink] = useState<number | null>(null);

  const onRepetitionChanged = (value: boolean) => {
    setRepetition(value);
  };

  const onSelectedRncIdsChanged = (values: Array<number>) => {
    setSelectedRncIds(values);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (id) {
      const dtNC = new Date();
      const idUsuarioAtual = parseInt(Storage.session.get('ID_USUARIO'));
      const origemNC = firstForm.origin.value;
      const processoEmissor = parseInt(firstForm.processOrigin.value);
      const processoNC = parseInt(firstForm.processTarget.value);
      const statusAtual = 'PREENCHIMENTO';
      const tipoNC = firstForm.type.value;
      const idEmissorNC = users.find(user => user.user.login == Storage.session.get('LOGIN'))?.id;

      dispatch(
        update({
          id: parseInt(id),
          statusAtual: statusAtual,
          idUsuarioAtual: idUsuarioAtual,
          dtNC: dtNC,
          tipoNC: tipoNC,
          origemNC: origemNC,
          possuiReincidencia: true,
          idEmissorNC: idEmissorNC,
          processoNC: processoNC,
          idReceptorNC: users.find(user => user.nome == firstForm.forwarded.value)?.id,
          processoEmissor: processoEmissor,
          vinculoDocAnterior: null,
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
      const idReceptorNC = receptorNC ? parseInt(receptorNC.user.id) : null;
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
          idEmissorNC: users.find(user => user.user.login == Storage.session.get('LOGIN'))?.id,
          processoNC: processoNC,
          idReceptorNC: users.find(user => user.nome == firstForm.forwarded.value)?.id,
          processoEmissor: processoEmissor,
          vinculoDocAnterior: null,
        })
      );

      sendNotification(
        'Existe uma pendência no módulo RNC',
        users.find(user => user.nome == firstForm.forwarded.value)
      ).then(() => {});

      setSecondForm(true);
    }
    return;
  };

  const onExternalAuditChanged = (externalAudit: GeneralAudit): void => {
    setExternalAudit(externalAudit);
  };

  const saveExternalAudit = async () => {
    if (!externalAudit) {
      return null;
    }

    return await axiosSaveAudit({
      norm: internalAudit?.norm,
      occurrence: internalAudit?.ncNumber?.toString(),
      process: internalAudit?.reportNumber,
      requirement: internalAudit?.normRequirements,
      rncId: rnc?.id,
      sequence: 1,
    });
  };

  const setClientRegister = async data => {
    const payload = {
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
    };

    // const response = await axiosSaveClient(payload);
    // const id = response.data.id;
    // setClientLink(id);

    const rncId = rnc.id;
    dispatch(saveClientComplaint({ id: rncId, client: payload }));
    dispatch(getById(rncId));
  };

  const onInternalAuditChanged = (internalAudit: GeneralAudit): void => {
    setInternalAudit(internalAudit);
  };

  const saveInternalAudit = async () => {
    if (!internalAudit) {
      return null;
    }

    return await axiosSaveAudit({
      norm: internalAudit?.norm,
      occurrence: internalAudit?.ncNumber.toString(),
      process: internalAudit?.reportNumber,
      requirement: internalAudit?.normRequirements,
      rncId: rnc?.id,
      sequence: 1,
    });
  };

  const onRawMaterialChanged = (rawMaterial: RawMaterial): void => {
    setRawMaterial(rawMaterial);
  };

  const saveMaterial = async () => {
    if (!rawMaterial) {
      return null;
    }

    return await axiosSaveRawMaterial({
      ...rawMaterial,
      traceability: {
        date: rawMaterial.invoiceDate,
        deliveredAt: rawMaterial.deliveredAt,
        identifier: rawMaterial.invoice,
        rncId: rnc.id,
      },
    });
  };

  const onProductComplaintChanged = (productComplaint: RawMaterial): void => {
    setProductComplaint(productComplaint);
  };

  const setProductRegister = async () => {
    if (!productComplaint) {
      return null;
    }
    return await axiosSaveProduct(productComplaint, stateRnc.id);
  };

  const onOthersChanged = (others: string): void => {
    setOthers(others);
  };

  const saveOthers = (): void => {};

  const renderComponents = () => {
    switch (firstForm.origin.value) {
      case 'AUDITORIA_EXTERNA':
        return <ExternalAuditRegister onChanged={onExternalAuditChanged} />;
      case 'AUDITORIA_INTERNA':
        return <InternalAuditRegister onChanged={onInternalAuditChanged} />;
      case 'CLIENTE':
        return <ClientRegister onClientChange={setClientRegister} />;
      case 'MATERIA_PRIMA_INSUMO':
        return <MPRegister onChanged={onRawMaterialChanged} />;
      case 'PRODUTO_ACABADO':
        return <ProductRegister onProductRegisterChange={onProductComplaintChanged} initialData={productComplaintFinal} />;
      case 'PROCEDIMENTO_OUTROS':
        return <OthersRegister initialData={others} onChanged={onOthersChanged} />;
    }
  };

  const onSaveRncDescription = async () => {
    const internalAuditLink = (await saveInternalAudit())?.data;
    const externalAuditLink = (await saveExternalAudit())?.data;
    const auditLink = internalAuditLink?.id ?? externalAuditLink?.id;
    const rawMaterialLink = (await saveMaterial())?.data;
    const productComplaint = (await setProductRegister())?.data;

    saveOthers();

    for (let i = 0; i < evidences.length; i++) {
      const evidence = evidences[i];

      if (i < descriptions.length) {
        const descriptionId: number = descriptions[i].id;

        dispatch(
          updateDescription({
            details: description,
            evidence: evidence,
            id: descriptionId,
            requirement: requirement,
            rncId: stateRnc.id,
            anexos: descriptionEvidences,
          })
        );
      } else {
        dispatch(
          saveDescription({
            details: description,
            evidence: evidence,
            requirement: requirement,
            rncId: stateRnc.id,
            anexos: descriptionEvidences,
          })
        );

        if (id) {
          dispatch(getDescriptionByRNCId(id));
        }
      }
    }

    dispatch(
      update({
        ...stateRnc,
        statusAtual: 'DETALHAMENTO',
        ncOutros: others,
        possuiReincidencia: repetition,
        vinculoDocAnterior: null,
        vinculoAuditoria: auditLink,
        vinculoCliente: clientLink ?? rnc?.vinculoCliente,
        vinculoProduto: rawMaterialLink?.id ?? rnc?.vinculoProduto,
      })
    );
  };

  const goToNextStep = () => {
    saveInternalAudit();
    saveExternalAudit();

    for (let i = 0; i < evidences.length; i++) {
      const evidence = evidences[i];

      if (i < descriptions.length) {
        const descriptionId: number = descriptions[i].id;

        dispatch(
          updateDescription({
            details: description,
            evidence: evidence,
            id: descriptionId,
            requirement: requirement,
            rncId: stateRnc.id,
            anexos: descriptionEvidences,
          })
        );
      } else {
        dispatch(
          saveDescription({
            details: description,
            evidence: evidence,
            requirement: requirement,
            rncId: stateRnc.id,
            anexos: descriptionEvidences,
          })
        );

        if (id) {
          dispatch(getDescriptionByRNCId(id));
        }
      }

      dispatch(update({ ...stateRnc, statusAtual: 'LEVANTAMENTO', possuiReincidencia: repetition, vinculoDocAnterior: null })).then(() => {
        navigate('/rnc');
      });
    }
  };

  const filterUser = (login: string) => {
    if (!users || users.length <= 0) {
      return null;
    }

    return users.find(user => user.user.login === login);
  };

  const users = useAppSelector(state => state.all4qmsmsgateway.users.entities);

  const rncs: Array<Rnc> = useAppSelector(state => state.all4qmsmsgateway.rnc.entities);
  const rnc: Rnc = useAppSelector(state => state.all4qmsmsgateway.rnc.entity);
  const enums = useAppSelector<Enums | null>(state => state.all4qmsmsgateway.enums.enums);
  const processes = useAppSelector<Array<Process>>(state => state.all4qmsmsgateway.process.entities);
  const descriptions = useAppSelector(state => state.all4qmsmsgateway.description.entities);

  useEffect(() => {
    if (rnc) {
      setStateRnc(rnc);
      setFirstForm({
        number: { value: String(rnc.id), error: false },
        emitter: { value: users.find(user => user.id === rnc.idEmissorNC)?.nome || '', error: false },
        date: { value: new Date(rnc.dtNC), error: false },
        processOrigin: { value: String(rnc?.processoEmissor) || '', error: false },
        forwarded: { value: users.find(user => user.id === rnc.idReceptorNC)?.nome || '', error: false },
        processTarget: { value: String(rnc?.processoNC) || '', error: false },
        type: { value: rnc.tipoNC || '', error: false },
        origin: { value: rnc.origemNC || '', error: false },
      });

      setOthers(rnc.ncOutros);

      setRepetition(rnc.possuiReincidencia || false);
      setSelectedRncIds(rnc.vinculoDocAnterior || []);

      if (rnc.statusAtual === 'DETALHAMENTO') {
        setSecondForm(true);

        getDescription(rnc.id).then(response => {
          const savedDescriptions = response.data;

          if (savedDescriptions) {
            const allEvidences: Array<string> = [];

            for (let i = 0; i < savedDescriptions.length; i++) {
              const description = savedDescriptions[i];
              onDescriptionChanged(description.detalhesNaoConformidade || '');
              onRequirementChanged(description.requisitoDescumprido || '');
              allEvidences.push(description.evidenciaObjetiva);
            }

            setEvidences(allEvidences);
          }
        });

        if (rnc.origemNC === 'PRODUTO_ACABADO') {
          renderProduct();
        }
      }
    }
  }, [rnc]);

  const renderProduct = async () => {
    await axiosGetProduct(rnc.vinculoProduto).then(data => {
      setProductComplaintFinal({
        code: data.product?.codigoProduto,
        description: data.product?.nomeProduto,
        identifier: data.product?.identificador,
        shift: data.operator?.turnoOperador,
        line: data.operator?.linhaOperador,
        operator: data.operator?.nomeOperador,
        inspector: data.operator?.nomeInspetorOperador,
        nqa: data.product?.nqa,
        samples: data.product?.qtdAmostra,
        defects: data.product?.qtdDefeito,
        rejectionRate: data.product?.qtdRejeicao,
        batch: data.product?.lote,
        batchSize: data.product?.qtdLote,
        inspectionRule: data.product?.regimeInspecao,
        invoice: '',
        requestNumber: data.product?.numPedido,
        deliveredAt: new Date(),
        invoiceDate: new Date(),
        opNumber: data.product?.numOP,
        traceability: {
          date: data.traceability.dtNF,
          deliveredAt: data.traceability.dtEntregaNF,
          identifier: data.traceability.numNF,
          rncId: rnc.id,
        },
      });
    });
  };

  useEffect(() => {
    if (users) {
      setFirstForm({
        ...firstForm,
        emitter: { value: users.find(user => user.id === stateRnc?.idEmissorNC)?.nome, error: false },
        forwarded: { value: users.find(user => user.id === stateRnc?.idReceptorNC)?.nome, error: false },
      });
    }
  }, [users]);

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
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                    {processes?.map((process, i) => (
                      <MenuItem value={process.id} key={`process-${i}`}>
                        {process.nome}
                      </MenuItem>
                    ))}
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
                    {processes?.map((process, i) => (
                      <MenuItem value={process.id} key={`process-${i}`}>
                        {process.nome}
                      </MenuItem>
                    ))}
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
                    {stateRnc ? 'Atualizar' : 'Salvar'}
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
                  rncId={id}
                />
              </Row>
              {/* <Row className="ms-3 me-3 mt-3" fullWidth>
                <RepetitionRnc
                  onRepetitionChanged={onRepetitionChanged}
                  onSelectedRncIdsChanged={onSelectedRncIdsChanged}
                  repetition={repetition}
                  rncs={rncs}
                  selectedRncIds={selectedRncIds}
                />
              </Row> */}
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
                    // color="p
                    className="me-3"
                    onClick={onSaveRncDescription}
                  >
                    Salvar
                  </Button>
                  <Button variant="outlined" color="primary" style={{ background: '#e6b200', color: '#4e4d4d' }} onClick={goToNextStep}>
                    Avançar
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
