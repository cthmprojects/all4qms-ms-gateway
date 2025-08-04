import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useAppSelector } from 'app/config/store';
import { Process } from 'app/modules/rnc/models';
import React from 'react';
import DatePicker from 'react-datepicker';

interface FilterSectionProps {
  filters: {
    dtIni: Date | null;
    dtFim: Date | null;
    idProcesso: number;
    origem: string | null;
    situacao: string;
    pesquisa: string | null;
  };
  processes: Process[];
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  onNewRegister: () => void;
  showNewRegisterButton?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters, processes, onFilterChange, onClearFilters }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <FormControl className="me-2">
        <DatePicker
          selected={filters.dtIni}
          onChange={date => onFilterChange({ ...filters, dtIni: date })}
          dateFormat="dd/MM/yyyy"
          className="infodoc-list-date-picker mt-4"
          id="start-date-picker"
          placeholderText="Data de início"
        />
        <label htmlFor="start-date-picker" className="infodoc-list-date-label">
          Início
        </label>
      </FormControl>

      <FormControl className="infodoc-list-form-field me-2">
        <DatePicker
          selected={filters.dtFim}
          onChange={date => onFilterChange({ ...filters, dtFim: date })}
          dateFormat={'dd/MM/yyyy'}
          className="infodoc-list-date-picker mt-4"
          placeholderText="Data de fim"
        />
        <label htmlFor="" className="infodoc-list-date-label">
          Fim
        </label>
      </FormControl>

      <FormControl className="infodoc-list-form-field me-2">
        <InputLabel>Processo</InputLabel>
        <Select
          value={filters.idProcesso}
          onChange={e => onFilterChange({ ...filters, idProcesso: parseInt(e.target.value.toString(), 10) })}
          label="Processo"
        >
          <MenuItem value={0}>Selecionar</MenuItem>
          {processes?.map((process, index) => (
            <MenuItem key={index} value={process.id}>
              {process.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <TextField
          label="Pesquisa"
          style={{ minWidth: '20vw' }}
          onChange={event => onFilterChange({ ...filters, pesquisa: event.target.value })}
          placeholder="Descrição"
          value={filters.pesquisa || ''}
        />
      </FormControl>

      <Button
        variant="contained"
        className="secondary-button me-2 rnc-list-form-field"
        style={{ height: '49px', width: '60px', marginLeft: '7px' }}
        onClick={onClearFilters}
        title="Limpar"
      >
        Limpar
      </Button>
    </div>
  );
};

export default FilterSection;
