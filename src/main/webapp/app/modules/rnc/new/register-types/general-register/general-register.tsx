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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DatePicker from 'react-datepicker';
import { Link, useNavigate } from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Grid from '@mui/material/Grid';

export const GeneralRegister = ({ onRegisterChange }) => {
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
    onRegisterChange(registerForm);
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
      <div className="padding-container">
        <div className="container-style">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to={'/'} style={{ textDecoration: 'none', color: '#49a7ea', fontWeight: 400 }}>
              Home
            </Link>
            <Typography className="link">RNC</Typography>
          </Breadcrumbs>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Análise de Abrangência da NC
              </Typography>
              <br />
              <div className="m-2">
                <label htmlFor="text-field-keyword" className="m-2">
                  Palavra-chave:
                </label>
                <TextField
                  id="text-field-keyword"
                  label="palavra"
                  className="m-2"
                  onChange={e => handleChange({ ...registerForm, keyword: { value: e.target.value, error: registerForm.keyword.error } })}
                />
                <IconButton aria-label="Adicionar palavra chave">
                  <AddIcon />
                </IconButton>
              </div>
              <div>
                <textarea id="postTextAreaId" value={registerForm.keywords.value} name="postContent" rows={3} cols={80} />
              </div>
            </CardContent>
          </Card>
          <Divider light />
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Ação Imediata / Disposição para conter a NC
              </Typography>
              <IconButton color="secondary" aria-label="Adicionar">
                <AddIcon />
              </IconButton>
              <br />
              <div>
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

                <IconButton color="secondary" aria-label="Editar">
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" aria-label="Remover">
                  <DeleteIcon />
                </IconButton>
              </div>
            </CardContent>
          </Card>
          <Divider light />
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Decisão sobre Matéria-Prima/Insumo ou Decisão sobre Produto Acabado
              </Typography>
              <br />
              <div>
                <InputLabel>Decisão</InputLabel>
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

                <TextField label="Descrição" name="descriptionDecision" />
                <DatePicker
                  selected={registerForm.implementationDate.value}
                  onChange={date =>
                    handleChange({ ...registerForm, implementationDate: { value: date, error: registerForm.implementationDate.error } })
                  }
                  className="date-picker"
                  id="date-picker-general-register"
                />
              </div>
              <br />
              <div>
                <TextField
                  label="Responsável"
                  onChange={event =>
                    setRegisterForm({
                      ...registerForm,
                      decisaoResponsavel: { value: event.target.value, error: registerForm.decisaoResponsavel.error },
                    })
                  }
                />
                <TextField
                  label="Quantidade selecionada"
                  onChange={event =>
                    setRegisterForm({
                      ...registerForm,
                      decisaoQtdSelecionada: { value: event.target.value, error: registerForm.decisaoQtdSelecionada.error },
                    })
                  }
                />
                <TextField
                  label="Quantidade aprovada"
                  onChange={event =>
                    setRegisterForm({
                      ...registerForm,
                      decisaoQtdAprovada: { value: event.target.value, error: registerForm.decisaoQtdAprovada.error },
                    })
                  }
                />
                <TextField
                  label="Quantidade reprovada"
                  onChange={event =>
                    setRegisterForm({
                      ...registerForm,
                      decisaoQtdReprovada: { value: event.target.value, error: registerForm.decisaoQtdReprovada.error },
                    })
                  }
                />
                <TextField
                  label="% Rejeição"
                  onChange={event =>
                    setRegisterForm({
                      ...registerForm,
                      decisaoPercentRejeicao: { value: event.target.value, error: registerForm.decisaoPercentRejeicao.error },
                    })
                  }
                />
              </div>
              <br />
            </CardContent>
          </Card>
          <Divider light />
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Investigação de Causas
              </Typography>
              <br />
              <div>
                <div>
                  <FormControlLabel control={<Checkbox />} onChange={handleCheckIshikawaChange} label="ISHIKAWA" />
                </div>
                <Grid container spacing={2}>
                  <Grid item xs>
                    <div>
                      <textarea id="ncIshikawaTextAreaId" name="ncArea" rows={5} cols={20} />
                    </div>
                  </Grid>
                  <Grid item container xs spacing={3}>
                    <Grid item xs>
                      <TextField
                        label="Meio Ambiente"
                        onChange={e =>
                          handleChange({
                            ...registerForm,
                            causaMeioAmbiente: { value: e.target.value, error: registerForm.causaMeioAmbiente.error },
                          })
                        }
                      />
                      <TextField
                        label="Máquina"
                        onChange={e =>
                          handleChange({ ...registerForm, causaMaquina: { value: e.target.value, error: registerForm.causaMaquina.error } })
                        }
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        label="Mão de obra"
                        onChange={e =>
                          handleChange({ ...registerForm, causaMaoObra: { value: e.target.value, error: registerForm.causaMaoObra.error } })
                        }
                      />
                      <TextField
                        label="Medição"
                        onChange={e =>
                          handleChange({ ...registerForm, causaMedicao: { value: e.target.value, error: registerForm.causaMedicao.error } })
                        }
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        label="Método"
                        onChange={e =>
                          handleChange({ ...registerForm, causaMedicao: { value: e.target.value, error: registerForm.causaMedicao.error } })
                        }
                      />
                      <TextField
                        label="Matéria-prima"
                        onChange={e =>
                          handleChange({
                            ...registerForm,
                            causaMateriaPrima: { value: e.target.value, error: registerForm.causaMateriaPrima.error },
                          })
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </div>
              <Divider light />
              <div>
                <div>
                  <FormControlLabel control={<Checkbox />} onChange={handleCheckFiveWhy} label="Resposta dos 5 porquês" />
                </div>
                <div>
                  <Grid container spacing={2}>
                    <Grid item xs>
                      <div>
                        <textarea id="ncPorqueTextAreaId" rows={5} cols={20} />
                      </div>
                    </Grid>
                    <Grid item xs={5} direction="column" sm container>
                      <Grid item xs>
                        <div>
                          <TextField label="Porquê" />
                        </div>
                      </Grid>
                      <Grid item xs>
                        <div>
                          <TextField label="Porquê" />
                        </div>
                      </Grid>
                      <Grid item xs>
                        <div>
                          <TextField label="Porquê" />
                        </div>
                      </Grid>
                      <Grid item xs>
                        <div>
                          <TextField label="Porquê" />
                        </div>
                      </Grid>
                      <Grid item xs>
                        <div>
                          <TextField label="Porquê" />
                        </div>
                      </Grid>
                    </Grid>
                    <Grid item xs>
                      <div>
                        <textarea id="causaPorqueTextAreaId" rows={5} cols={20} />
                      </div>
                    </Grid>
                  </Grid>
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
              <div>
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

                <IconButton color="secondary" aria-label="Editar">
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" aria-label="Remover">
                  <DeleteIcon />
                </IconButton>
                <IconButton color="secondary" aria-label="Adicionar">
                  <AddIcon />
                </IconButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default GeneralRegister;
