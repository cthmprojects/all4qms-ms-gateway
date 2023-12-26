import './general-register.css';
import React, { useState } from 'react';
import {
  Breadcrumbs,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Divider,
  Chip,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DatePicker from 'react-datepicker';
import { Link, useNavigate } from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Grid from '@mui/material/Grid';
import { Row } from 'reactstrap';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Add } from '@mui/icons-material';

export const GeneralRegister = () => {
  const navigate = useNavigate();
  const [registerForm, setRegisterForm] = useState({
    decision: {
      value: '',
      error: false,
    },
    keywords: {
      value: [],
      error: false,
    },
    keyword: {
      value: '',
      error: false,
    },
    descricaoAcao: {
      value: '',
      error: false,
    },
    prazo: {
      value: '',
      error: false,
    },
    responsavel: {
      value: '',
      error: false,
    },
    status: {
      value: '',
      error: false,
    },
    implementationDate: {
      value: new Date(),
      error: false,
    },
    decisaoResponsavel: {
      value: '',
      error: false,
    },
    investigacaoCausa: {
      value: '',
      error: false,
    },
    decisaoQtdSelecionada: {
      value: '0',
      error: false,
    },
    decisaoQtdAprovada: {
      value: '0',
      error: false,
    },
    decisaoQtdReprovada: {
      value: '0',
      error: false,
    },
    decisaoPercentRejeicao: {
      value: '0',
      error: false,
    },
    planoAcaoDescricao: {
      value: '',
      error: false,
    },
    planoAcaoPrazo: {
      value: '',
      error: false,
    },
    planoAcaoResponsavel: {
      value: '',
      error: false,
    },
    planoAcaoStatus: {
      value: '',
      error: false,
    },
    planoAcaoVerificacao: {
      value: '',
      error: false,
    },
    planoAcaoResponsavelVerificacao: {
      value: '',
      error: false,
    },
    causaMeioAmbiente: {
      value: '',
      error: false,
    },
    causaMaoObra: {
      value: '',
      error: false,
    },
    causaMetodo: {
      value: '',
      error: false,
    },
    causaMaquina: {
      value: '',
      error: false,
    },
    causaMedicao: {
      value: '',
      error: false,
    },
    causaMateriaPrima: {
      value: '',
      error: false,
    },
  });

  const handleChange = (value: any) => {
    setRegisterForm(value);
    // onRegisterChange(registerForm);
  };

  const [checkedIshikawa, setCheckedIshikawa] = React.useState(true);
  const handleCheckIshikawaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedIshikawa(event.target.checked);
  };

  const [checkedFiveWhy, setCheckedFiveWhy] = React.useState(true);
  const handleCheckFiveWhy = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedFiveWhy(event.target.checked);
  };

  return (
    <>
      <div style={{ background: '#fff' }} className="ms-5 me-5 pb-5">
        <Row className="justify-content-center mt-5">
          <Breadcrumbs aria-label="breadcrumb" className="pt-3 ms-5">
            <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
              Home
            </Link>
            <Link to={'/rnc/general'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
              Relatório de Não conformidade
            </Link>
            <Link to={'/rnc/general'} style={{ textDecoration: 'none', color: '#606060', fontWeight: 400 }}>
              Geral
            </Link>
          </Breadcrumbs>
        </Row>
        <div className="container-style">
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Análise de Abrangência da NC
              </Typography>
              <br />
              <div style={{ display: 'flex', alignItems: 'center' }} className="mt-2 mb-2">
                <span className="me-2" style={{ fontWeight: '500', fontSize: '16px', marginTop: '0px', color: '#384150' }}>
                  Palavra chave
                </span>
                <LocalOfferIcon sx={{ color: '#707070' }} />
                <TextField
                  className="ms-2"
                  id="text-field-keyword"
                  label="Escreva aqui..."
                  style={{ width: '40%', maxWidth: '400px', minWidth: '200px' }}
                  onChange={e => handleChange({ ...registerForm, keyword: { value: e.target.value, error: registerForm.keyword.error } })}
                />
                <IconButton aria-label="Adicionar palavra chave">
                  <AddCircleIcon fontSize="large" />
                </IconButton>
              </div>
              <div className="p-2 mt-3" style={{ width: '100%', border: '1px solid #c6c6c6', borderRadius: '4px', minHeight: '100px' }}>
                <Chip label="Software" onClick={() => {}} onDelete={() => {}} />
                <Chip label="Documents" onClick={() => {}} onDelete={() => {}} />
                {/* <textarea 
                  id="postTextAreaId" 
                  value={registerForm.keywords.value} 
                  name="postContent" 
                  rows={3} 
                  cols={80}
                  style={{ width: '100%'}} 
                /> */}
              </div>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 275 }} className="mt-3">
            <CardContent>
              <Typography variant="h5" component="div">
                Ação Imediata / Disposição para conter a NC
              </Typography>

              <br />
              <div style={{ display: 'flex', alignItems: 'center' }} className="mt-2 mb-2">
                <TextField
                  label="Descrição da ação"
                  className="m-2"
                  sx={{ width: '20% !important' }}
                  onChange={e =>
                    handleChange({ ...registerForm, descricaoAcao: { value: e.target.value, error: registerForm.descricaoAcao.error } })
                  }
                />
                <TextField
                  label="Prazo"
                  className="m-2"
                  sx={{ width: '20% !important' }}
                  onChange={e => handleChange({ ...registerForm, prazo: { value: e.target.value, error: registerForm.prazo.error } })}
                />
                <TextField
                  label="Responsável"
                  className="m-2"
                  sx={{ width: '20% !important' }}
                  onChange={e =>
                    handleChange({ ...registerForm, responsavel: { value: e.target.value, error: registerForm.responsavel.error } })
                  }
                />
                <TextField
                  label="Status"
                  className="m-2"
                  sx={{ width: '20% !important' }}
                  onChange={e => handleChange({ ...registerForm, status: { value: e.target.value, error: registerForm.status.error } })}
                />

                <IconButton aria-label="Editar">
                  <EditIcon fontSize="medium" />
                </IconButton>
                <IconButton aria-label="Remover">
                  <DeleteIcon fontSize="medium" />
                </IconButton>
                {/* <IconButton color="secondary" aria-label="Adicionar">
                  <AddIcon fontSize="large" />
                </IconButton> */}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }} className="mt-2 mb-2">
                <TextField
                  label="Descrição da ação"
                  className="m-2"
                  sx={{ width: '20% !important' }}
                  onChange={e =>
                    handleChange({ ...registerForm, descricaoAcao: { value: e.target.value, error: registerForm.descricaoAcao.error } })
                  }
                />
                <TextField
                  label="Prazo"
                  className="m-2"
                  sx={{ width: '20% !important' }}
                  onChange={e => handleChange({ ...registerForm, prazo: { value: e.target.value, error: registerForm.prazo.error } })}
                />
                <TextField
                  label="Responsável"
                  className="m-2"
                  sx={{ width: '20% !important' }}
                  onChange={e =>
                    handleChange({ ...registerForm, responsavel: { value: e.target.value, error: registerForm.responsavel.error } })
                  }
                />
                <TextField
                  label="Status"
                  className="m-2"
                  sx={{ width: '20% !important' }}
                  onChange={e => handleChange({ ...registerForm, status: { value: e.target.value, error: registerForm.status.error } })}
                />

                <IconButton aria-label="Editar">
                  <EditIcon fontSize="medium" />
                </IconButton>
                <IconButton aria-label="Remover">
                  <DeleteIcon fontSize="medium" />
                </IconButton>
                <Fab color="primary" aria-label="add" size="medium" className="ms-3 btn-add-fab">
                  <Add />
                </Fab>
              </div>
            </CardContent>
          </Card>
          <Divider light />
          <Card sx={{ minWidth: 275 }} className="mt-3">
            <CardContent>
              <Typography variant="h5" component="div">
                Decisão sobre Matéria-Prima/Insumo ou Decisão sobre Produto Acabado
              </Typography>
              <br />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="mt-2 mb-2">
                <FormControl className="mb-2 rnc-form-field me-2" sx={{ display: 'flex', maxWidth: '40%' }}>
                  <InputLabel>Retrabalho</InputLabel>
                  <Select
                    label="Decisão"
                    name="decision"
                    value={registerForm.decision.value}
                    onChange={event =>
                      setRegisterForm({ ...registerForm, decision: { value: event.target.value, error: registerForm.decision.error } })
                    }
                  >
                    <MenuItem value="1">Decisão 1</MenuItem>
                    <MenuItem value="2">Decisão 2</MenuItem>
                    <MenuItem value="3">Decisão 3</MenuItem>
                    <MenuItem value="4">Decisão 4</MenuItem>
                    <MenuItem value="5">Decisão 5</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  sx={{ height: '60px', maxWidth: '50% !important' }}
                  label="Descrição da decisão"
                  name="number"
                  id="rnc-text-field"
                  // value={firstForm.number.value}
                  className="rnc-form-field me-2 mb-2"
                />

                <FormControl className="mb-2 rnc-form-field me-2">
                  <DatePicker
                    selected={registerForm.implementationDate.value}
                    onChange={date =>
                      handleChange({ ...registerForm, implementationDate: { value: date, error: registerForm.implementationDate.error } })
                    }
                    className="date-picker"
                    id="date-picker-general-register"
                  />
                  <label htmlFor="" className="rnc-date-label">
                    Data
                  </label>
                </FormControl>
              </div>
              <br />
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '196px' }}
                className="mt-2 mb-2"
              >
                <Card className="p-3" sx={{ display: 'flex', flexDirection: 'column', width: '40%' }}>
                  <h3 style={{ fontSize: '1rem' }}>Responsável</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                      sx={{ height: '60px', maxWidth: '70% !important' }}
                      // label="Descrição da decisão"
                      name="number"
                      id="rnc-text-field"
                      // value={firstForm.number.value}
                      className="rnc-form-field me-2 mb-2"
                    />
                    <IconButton aria-label="Remover" className="me-2">
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                      sx={{ height: '60px', maxWidth: '70% !important' }}
                      // label="Descrição da decisão"
                      name="number"
                      id="rnc-text-field"
                      // value={firstForm.number.value}
                      className="rnc-form-field me-2 mb-2"
                    />
                    <Fab color="primary" aria-label="add" size="medium" className="btn-add-fab me-2">
                      <Add />
                    </Fab>
                  </div>
                </Card>

                <div
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '60%', height: '100%' }}
                  className="ms-3"
                >
                  <Card className="p-2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                      label="Quantidade selecionada"
                      className="m-2"
                      sx={{ width: '25% !important' }}
                      onChange={event =>
                        setRegisterForm({
                          ...registerForm,
                          decisaoQtdSelecionada: { value: event.target.value, error: registerForm.decisaoQtdSelecionada.error },
                        })
                      }
                    />
                    <TextField
                      label="Quantidade aprovada"
                      className="m-2"
                      sx={{ width: '25% !important' }}
                      onChange={event =>
                        setRegisterForm({
                          ...registerForm,
                          decisaoQtdAprovada: { value: event.target.value, error: registerForm.decisaoQtdAprovada.error },
                        })
                      }
                    />
                    <TextField
                      label="Quantidade reprovada"
                      className="m-2"
                      sx={{ width: '25% !important' }}
                      onChange={event =>
                        setRegisterForm({
                          ...registerForm,
                          decisaoQtdReprovada: { value: event.target.value, error: registerForm.decisaoQtdReprovada.error },
                        })
                      }
                    />
                    <TextField
                      label="% Rejeição"
                      className="m-2"
                      sx={{ width: '25% !important' }}
                      onChange={event =>
                        setRegisterForm({
                          ...registerForm,
                          decisaoPercentRejeicao: { value: event.target.value, error: registerForm.decisaoPercentRejeicao.error },
                        })
                      }
                    />
                  </Card>
                  <Card className="p-2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                      label="Quantidade selecionada"
                      className="m-2"
                      sx={{ width: '25% !important' }}
                      onChange={event =>
                        setRegisterForm({
                          ...registerForm,
                          decisaoQtdSelecionada: { value: event.target.value, error: registerForm.decisaoQtdSelecionada.error },
                        })
                      }
                    />
                    <TextField
                      label="Quantidade aprovada"
                      className="m-2"
                      sx={{ width: '25% !important' }}
                      onChange={event =>
                        setRegisterForm({
                          ...registerForm,
                          decisaoQtdAprovada: { value: event.target.value, error: registerForm.decisaoQtdAprovada.error },
                        })
                      }
                    />
                    <TextField
                      label="Quantidade reprovada"
                      className="m-2"
                      sx={{ width: '25% !important' }}
                      onChange={event =>
                        setRegisterForm({
                          ...registerForm,
                          decisaoQtdReprovada: { value: event.target.value, error: registerForm.decisaoQtdReprovada.error },
                        })
                      }
                    />
                    <TextField
                      label="% Rejeição"
                      className="m-2"
                      sx={{ width: '25% !important' }}
                      onChange={event =>
                        setRegisterForm({
                          ...registerForm,
                          decisaoPercentRejeicao: { value: event.target.value, error: registerForm.decisaoPercentRejeicao.error },
                        })
                      }
                    />
                  </Card>
                </div>
              </div>
              <br />
            </CardContent>
          </Card>
          <Divider light />
          <Card sx={{ minWidth: 275 }} className="mt-3">
            <CardContent>
              <h3 style={{ fontSize: '1rem' }}>Investigação de causas</h3>
              <br />
              <div style={{ display: 'flex', alignItems: 'center' }} className="mt-2 mb-2">
                <FormControlLabel control={<Checkbox />} onChange={handleCheckIshikawaChange} label="ISHIKAWA" />
                <textarea id="ncIshikawaTextAreaId" name="ncArea" rows={5} cols={30} />
                <div>
                  <div>
                    <TextField
                      label="Meio Ambiente"
                      className="m-2"
                      onChange={e =>
                        handleChange({
                          ...registerForm,
                          causaMeioAmbiente: { value: e.target.value, error: registerForm.causaMeioAmbiente.error },
                        })
                      }
                    />
                    <TextField
                      label="Máquina"
                      className="m-2"
                      onChange={e =>
                        handleChange({ ...registerForm, causaMaquina: { value: e.target.value, error: registerForm.causaMaquina.error } })
                      }
                    />
                  </div>
                  <div>
                    <TextField
                      label="Mão de obra"
                      className="m-2"
                      onChange={e =>
                        handleChange({ ...registerForm, causaMaoObra: { value: e.target.value, error: registerForm.causaMaoObra.error } })
                      }
                    />
                    <TextField
                      label="Medição"
                      className="m-2"
                      onChange={e =>
                        handleChange({ ...registerForm, causaMedicao: { value: e.target.value, error: registerForm.causaMedicao.error } })
                      }
                    />
                  </div>
                  <div>
                    <TextField
                      label="Método"
                      className="m-2"
                      onChange={e =>
                        handleChange({ ...registerForm, causaMedicao: { value: e.target.value, error: registerForm.causaMedicao.error } })
                      }
                    />
                    <TextField
                      label="Matéria-prima"
                      className="m-2"
                      onChange={e =>
                        handleChange({
                          ...registerForm,
                          causaMateriaPrima: { value: e.target.value, error: registerForm.causaMateriaPrima.error },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <Divider light />
              <div style={{ display: 'flex', alignItems: 'center' }} className="mt-2 mb-2">
                <FormControlLabel control={<Checkbox />} onChange={handleCheckFiveWhy} label="Resposta dos 5 porquês" />
                <div>
                  <textarea id="ncPorqueTextAreaId" rows={5} cols={30} />
                </div>
                <div>
                  <div>
                    <TextField label="Porquê" className="m-2" />
                  </div>
                  <div>
                    <TextField label="Porquê" className="m-2" />
                  </div>
                  <div>
                    <TextField label="Porquê" className="m-2" />
                  </div>
                  <div>
                    <TextField label="Porquê" className="m-2" />
                  </div>
                  <div>
                    <TextField label="Porquê" className="m-2" />
                  </div>
                </div>
                <div>
                  <textarea id="causaPorqueTextAreaId" rows={5} cols={30} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Divider light />
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Plano de Ação Corretiva
              </Typography>
              <br />
              <div style={{ display: 'flex', alignItems: 'center' }} className="mt-2 mb-2">
                <TextField
                  label="Descrição da ação"
                  onChange={e =>
                    handleChange({
                      ...registerForm,
                      planoAcaoDescricao: { value: e.target.value, error: registerForm.planoAcaoDescricao.error },
                    })
                  }
                />
                <TextField
                  label="Prazo"
                  onChange={e =>
                    handleChange({ ...registerForm, planoAcaoPrazo: { value: e.target.value, error: registerForm.planoAcaoPrazo.error } })
                  }
                />
                <TextField
                  label="Responsável"
                  onChange={e =>
                    handleChange({
                      ...registerForm,
                      planoAcaoResponsavel: { value: e.target.value, error: registerForm.planoAcaoResponsavel.error },
                    })
                  }
                />

                <TextField
                  label="Status"
                  onChange={e =>
                    handleChange({ ...registerForm, planoAcaoStatus: { value: e.target.value, error: registerForm.planoAcaoStatus.error } })
                  }
                />
                <TextField
                  label="Verificação"
                  onChange={e =>
                    handleChange({
                      ...registerForm,
                      planoAcaoVerificacao: { value: e.target.value, error: registerForm.planoAcaoVerificacao.error },
                    })
                  }
                />
                <TextField
                  label="Responsável Verificação"
                  onChange={e =>
                    handleChange({
                      ...registerForm,
                      planoAcaoResponsavelVerificacao: { value: e.target.value, error: registerForm.planoAcaoResponsavelVerificacao.error },
                    })
                  }
                />

                <IconButton aria-label="Editar">
                  <EditIcon fontSize="medium" />
                </IconButton>
                <IconButton aria-label="Remover">
                  <DeleteIcon fontSize="medium" />
                </IconButton>
                <IconButton color="secondary" aria-label="Adicionar">
                  <AddIcon fontSize="large" />
                </IconButton>
              </div>
            </CardContent>
          </Card>
          <div style={{ display: 'flex', justifyContent: 'flex-end', height: '45px' }} className="mt-5">
            <Button
              variant="contained"
              className="me-3"
              style={{ background: '#d9d9d9', color: '#4e4d4d' }}
              onClick={() => navigate('/rnc/new')}
            >
              Voltar
            </Button>
            <Button variant="outlined" color="primary" style={{ color: '#384150', border: '1px solid #384150', background: '#fff' }}>
              Salvar
            </Button>
            <Button
              className="ms-3"
              variant="contained"
              color="primary"
              style={{ background: '#e6b200', color: '#4e4d4d' }}
              onClick={() => navigate('/rnc/general/implementacao')}
            >
              Avançar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralRegister;
