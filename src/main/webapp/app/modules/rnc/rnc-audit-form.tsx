import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit}>
      <h1>Auditoria Interna</h1>
      <div>
        <label htmlFor="norma">Norma:</label>
        <input
          type="text"
          id="norma"
          name="norma"
          value={formulario.norma}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="rnc">Número RNC:</label>
        <input
          type="number"
          id="rnc"
          name="rnc"
          value={formulario.rnc}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="requisitoNorma">Requisito da Norma:</label>
        <input
          type="text"
          id="requisitoNorma"
          name="requisitoNorma"
          value={formulario.requisitoNorma}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="numeroRelatorio">Número do Relatório:</label>
        <input
          type="number"
          id="numeroRelatorio"
          name="numeroRelatorio"
          value={formulario.numeroRelatorio}
          onChange={handleInputChange}
        />
      </div>

    <h2>Descrição</h2>

      <div>
        <label htmlFor="naoConfirmidade">Não Confirmidade:</label>
        <textarea
          id="naoConfirmidade"
          name="naoConfirmidade"
          value={formulario.naoConfirmidade}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="requisitoDescumprido">Requisito Descumprido:</label>
        <textarea
          id="requisitoDescumprido"
          name="requisitoDescumprido"
          value={formulario.requisitoDescumprido}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="evidenciaObjetiva">Evidência Objetiva:</label>
        <textarea
          id="evidenciaObjetiva"
          name="evidenciaObjetiva"
          value={formulario.evidenciaObjetiva}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>
          Reiciência:
          <input
            type="checkbox"
            name="reiciencia"
            checked={formulario.reiciencia}
            onChange={handleInputChange}
          />
        </label>
      </div>
      {formulario.reiciencia && (
        <div>
          <label htmlFor="documentoAnterior">Documento Anterior:</label>
          <select
            id="documentoAnterior"
            name="documentoAnterior"
            value={formulario.documentoAnterior}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Selecione um documento anterior
            </option>
            <option value="documento1">Documento 1</option>
            <option value="documento2">Documento 2</option>
            <option value="documento3">Documento 3</option>
          </select>
        </div>
      )}
      <div>
        <button type="button">Voltar</button>
        <button type="submit">Salvar</button>
        <button type="button">Avançar</button>
      </div>
    </form>
  );
}

export default RncAuditForm;
