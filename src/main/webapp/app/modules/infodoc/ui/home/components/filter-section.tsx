import React from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import DatePicker from 'react-datepicker';
import { Process } from 'app/modules/rnc/models';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

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

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  processes,
  onFilterChange,
  onClearFilters,
  onNewRegister,
  showNewRegisterButton = true,
}) => {
  const account = useAppSelector(state => state.authentication.account);
  const canAccessNewRegister = hasAnyAuthority(account.authorities, [AUTHORITIES.ADMIN, AUTHORITIES.SGQ, 'ROLE_EMISSOR', 'ROLE_APROVADOR']);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      {showNewRegisterButton && (
        <Button
          variant="contained"
          className={`${!canAccessNewRegister ? 'secondary-button' : 'primary-button'} me-2 infodoc-list-form-field`}
          style={{ marginRight: '10px', height: '58px' }}
          onClick={onNewRegister}
          title="Novo Registro"
          disabled={!canAccessNewRegister}
        >
          Novo Registro
        </Button>
      )}

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
