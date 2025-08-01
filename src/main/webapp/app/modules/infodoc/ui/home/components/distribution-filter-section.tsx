import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { Enums } from '../../../models';

interface DistributionFilters {
  tipoControle?: string;
  codigo?: string;
  titulo?: string;
  idProcesso?: number;
  situacao?: string;
}

interface DistributionFilterSectionProps {
  filters: DistributionFilters;
  processes: any[];
  enums: Enums | null;
  onFilterChange: (filters: DistributionFilters) => void;
  onClearFilters: () => void;
}

const DistributionFilterSection: React.FC<DistributionFilterSectionProps> = ({
  filters,
  processes,
  enums,
  onFilterChange,
  onClearFilters,
}) => {
  const handleFilterChange = (field: keyof DistributionFilters, value: any) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const clearAllFilters = () => {
    onClearFilters();
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <FormControl className="me-2" sx={{ minWidth: 150 }}>
        <InputLabel>Tipo Controle</InputLabel>
        <Select
          value={filters.tipoControle || ''}
          onChange={e => handleFilterChange('tipoControle', e.target.value || undefined)}
          label="Tipo Controle"
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="C">CONTROLADA</MenuItem>
          <MenuItem value="N">NÃO CONTROLADA</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Código"
        value={filters.codigo || ''}
        onChange={e => handleFilterChange('codigo', e.target.value || undefined)}
        sx={{ minWidth: 120 }}
        className="me-2"
      />

      <TextField
        label="Título"
        value={filters.titulo || ''}
        onChange={e => handleFilterChange('titulo', e.target.value || undefined)}
        sx={{ minWidth: 200 }}
        className="me-2"
      />

      <FormControl className="me-2" sx={{ minWidth: 150 }}>
        <InputLabel>Área/Processo</InputLabel>
        <Select
          value={filters.idProcesso || ''}
          onChange={e => handleFilterChange('idProcesso', e.target.value ? parseInt(e.target.value.toString()) : undefined)}
          label="Área/Processo"
        >
          <MenuItem value="">Todos</MenuItem>
          {processes?.map((process, index) => (
            <MenuItem key={index} value={process.id}>
              {process.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl className="me-2" sx={{ minWidth: 150 }}>
        <InputLabel>Situação</InputLabel>
        <Select value={filters.situacao || ''} onChange={e => handleFilterChange('situacao', e.target.value || undefined)} label="Situação">
          <MenuItem value="">TODAS</MenuItem>
          {enums?.situacaoDetalheDistDoc?.map((option, index) => (
            <MenuItem key={index} value={option.nome}>
              {option.valor}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        className="secondary-button me-2 rnc-list-form-field"
        style={{ height: '49px', width: '60px', marginLeft: '7px' }}
        onClick={clearAllFilters}
        title="Limpar"
      >
        Limpar
      </Button>
    </div>
  );
};

export default DistributionFilterSection;
