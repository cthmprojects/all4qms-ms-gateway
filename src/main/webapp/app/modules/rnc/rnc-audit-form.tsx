import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import './rnc-audit-form.css';

function RncAuditForm() {
  const [formulario, setFormulario] = useState({
    norma: '',
    rnc: '',
    requisitoNorma: '',
    numeroRelatorio: '',
    naoConfirmidade: '',
    requisitoDescumprido: '',
    evidenciaObjetiva: '',
    reiciencia: false,
    documentoAnterior: '',
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você pode adicionar a lógica para salvar os dados do formulário
    console.log('Dados do Formulário:', formulario);
  };

  return (
    
    <form onSubmit={handleSubmit} className='form-audit'>
      <header>
        <h1>
          Auditoria Externa
        </h1>  
      </header>
      
      <div className='Content'>
        <div>
          <TextField
            label="Norma"
            variant="outlined"
            id="norma"
            name="norma"
            value={formulario.norma}
            onChange={handleInputChange}
            placeholder='false'
            
          />
        </div>
        <div>
          <TextField
            label="Número RNC"
            variant="outlined"
            type="number"
            id="rnc"
            name="rnc"
            value={formulario.rnc}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <TextField
            label="Requisito da Norma"
            variant="outlined"
            id="requisitoNorma"
            name="requisitoNorma"
            value={formulario.requisitoNorma}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <TextField
            label="Número do Relatório"
            variant="outlined"
            type="number"
            id="numeroRelatorio"
            name="numeroRelatorio"
            value={formulario.numeroRelatorio}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <hr></hr>

      <header>
        <h2>
          Descrição
        </h2>
      </header>      

      <div className='Content-2'>
        <div>
          <TextField
            label="Não Conformidade"
            variant="outlined"
            multiline
            rows={4}
            id="naoConfirmidade"
            name="naoConfirmidade"
            value={formulario.naoConfirmidade}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <TextField
            label="Requisito Descumprido"
            variant="outlined"
            multiline
            rows={4}
            id="requisitoDescumprido"
            name="requisitoDescumprido"
            value={formulario.requisitoDescumprido}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <TextField
            label="Evidência Objetiva"
            variant="outlined"
            multiline
            rows={4}
            id="evidenciaObjetiva"
            name="evidenciaObjetiva"
            value={formulario.evidenciaObjetiva}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>
            Reiciência:
            <Checkbox
              name="reiciencia"
              checked={formulario.reiciencia}
              onChange={handleInputChange}
            />
          </label>
        </div>
        {formulario.reiciencia && (
          <div>
            <TextField
              label="Documento Anterior"
              variant="outlined"
              select
              id="documentoAnterior"
              name="documentoAnterior"
              value={formulario.documentoAnterior}
              onChange={handleInputChange}
            >
              <MenuItem value="">
                <em>Selecione um documento anterior</em>
              </MenuItem>
              <MenuItem value="documento1">Documento 1</MenuItem>
              <MenuItem value="documento2">Documento 2</MenuItem>
              <MenuItem value="documento3">Documento 3</MenuItem>
            </TextField>
          </div>
        )}
      </div>
      <div>
        <Button type="button" className='Return'>Voltar</Button>
        <Button type="submit" className='Save'>Salvar</Button>
        <Button type="button" className='Next'>Avançar</Button>
      </div>
    </form>
  );
}

export default RncAuditForm;
