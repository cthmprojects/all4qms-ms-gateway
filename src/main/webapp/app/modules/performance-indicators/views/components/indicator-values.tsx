import { Add, Delete } from '@mui/icons-material';
import { Autocomplete, IconButton, Stack, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { getYearRange, onAutocompleteChanged } from '../../utils';
import IndicatorValue from './indicator-value';

type IndicatorValuesProps = {
  allowAdding?: boolean;
  allowRemoving?: boolean;
  initialFrequency?: string | null;
  initialValues?: Array<number | null>;
  initialYear?: string | null;
  inputOnly?: boolean;
  frequencies: Array<string>;
  unit: string;
  onAdded?: () => void;
  onChanged: (frequency: string, year: number, values: Array<number | null>) => void;
  onRemoved?: () => void;
};

const IndicatorValues = ({
  allowAdding,
  allowRemoving,
  frequencies,
  initialFrequency,
  initialValues,
  initialYear,
  inputOnly,
  unit,
  onAdded,
  onChanged,
  onRemoved,
}: IndicatorValuesProps) => {
  const [frequency, setFrequency] = useState<string | null>(null);
  const [values, setValues] = useState<Array<number | null>>([null, null, null, null, null, null, null, null, null, null, null, null]);
  const [year, setYear] = useState<number | null>(null);
  const [years, setYears] = useState<Array<number>>([]);

  useEffect(() => {
    setYears(getYearRange());
  }, []);

  useEffect(() => {
    if (!frequencies || frequencies.length <= 0 || frequency) {
      return;
    }
    setFrequency(frequencies[0]);
  }, [frequency, frequencies]);

  useEffect(() => {
    if (!initialFrequency) {
      return;
    }

    setFrequency(initialFrequency);
  }, [initialFrequency]);

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    setValues(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (!initialYear) {
      return;
    }

    setYear(Number(initialYear));
  }, [initialYear]);

  useEffect(() => {
    if (!years || years.length <= 0 || year) {
      return;
    }
    //setYear(initialYear);
    const now: Date = new Date();
    const currentYear: number = now.getFullYear();

    setYear(currentYear);
  }, [year, years]);

  const getValueLabel = (idx: number): string => {
    const labels: Array<string> = [];

    if (frequency === 'MENSAL') {
      labels.push('JAN');
      labels.push('FEV');
      labels.push('MAR');
      labels.push('ABR');
      labels.push('MAI');
      labels.push('JUN');
      labels.push('JUL');
      labels.push('AGO');
      labels.push('SET');
      labels.push('OUT');
      labels.push('NOV');
      labels.push('DEZ');
    } else if (frequency === 'BIMESTRAL') {
      labels.push('1º B');
      labels.push('');
      labels.push('2º B');
      labels.push('');
      labels.push('3º B');
      labels.push('');
      labels.push('4º B');
      labels.push('');
      labels.push('5º B');
      labels.push('');
      labels.push('6º B');
      labels.push('');
    } else if (frequency === 'TRIMESTRAL') {
      labels.push('1º T');
      labels.push('');
      labels.push('');
      labels.push('2º T');
      labels.push('');
      labels.push('');
      labels.push('3º T');
      labels.push('');
      labels.push('');
      labels.push('4º T');
      labels.push('');
      labels.push('');
    } else if (frequency === 'QUADRIMESTRAL') {
      labels.push('1º Q');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('2º Q');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('3º Q');
      labels.push('');
      labels.push('');
      labels.push('');
    } else if (frequency === 'SEMESTRAL') {
      labels.push('1º S');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('2º S');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('');
    } else if (frequency === 'ANUAL') {
      labels.push('Ano');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('');
      labels.push('');
    }

    return labels[idx];
  };

  const shouldRenderValue = (idx: number): boolean => {
    const indicesToRender: Set<number> = new Set<number>();

    if (frequency === 'MENSAL') {
      indicesToRender.add(0);
      indicesToRender.add(1);
      indicesToRender.add(2);
      indicesToRender.add(3);
      indicesToRender.add(4);
      indicesToRender.add(5);
      indicesToRender.add(6);
      indicesToRender.add(7);
      indicesToRender.add(8);
      indicesToRender.add(9);
      indicesToRender.add(10);
      indicesToRender.add(11);
    } else if (frequency === 'BIMESTRAL') {
      indicesToRender.add(0);
      indicesToRender.add(2);
      indicesToRender.add(4);
      indicesToRender.add(6);
      indicesToRender.add(8);
      indicesToRender.add(10);
    } else if (frequency === 'TRIMESTRAL') {
      indicesToRender.add(0);
      indicesToRender.add(3);
      indicesToRender.add(6);
      indicesToRender.add(9);
    } else if (frequency === 'QUADRIMESTRAL') {
      indicesToRender.add(0);
      indicesToRender.add(4);
      indicesToRender.add(8);
    } else if (frequency === 'SEMESTRAL') {
      indicesToRender.add(0);
      indicesToRender.add(6);
    } else if (frequency === 'ANUAL') {
      indicesToRender.add(0);
    }

    return indicesToRender.has(idx);
  };

  const updateValue = (value: string, idx: number): void => {
    const newValues: Array<number> = [...values];
    newValues[idx] = value.length > 0 ? parseInt(value) : null;
    onChanged(frequency, year, newValues);
  };

  const renderValues = () => {
    return (
      <Stack direction="row" spacing={2}>
        {values.map((value, idx) => {
          if (shouldRenderValue(idx)) {
            return (
              <IndicatorValue label={getValueLabel(idx)} onChanged={value => updateValue(value, idx)} value={value?.toString() ?? ''} />
            );
          } else {
            return <></>;
          }
        })}
      </Stack>
    );
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Autocomplete
          disableClearable
          disabled={inputOnly}
          onChange={(event, value, reason, details) => {
            onAutocompleteChanged(event, value, reason, details, setFrequency);
            onChanged(value, year, [null, null, null, null, null, null, null, null, null, null, null, null]);
          }}
          options={frequencies}
          renderInput={params => <TextField {...params} label="Frequência" />}
          sx={{ minWidth: '215px' }}
          value={frequency}
        />

        <Autocomplete
          disableClearable
          disabled={inputOnly}
          getOptionLabel={option => option.toString()}
          onChange={(event, value, reason, details) => {
            onAutocompleteChanged(event, value, reason, details, setYear);
            onChanged(frequency, value, values);
          }}
          options={years}
          renderInput={props => <TextField {...props} label="Ano" />}
          sx={{ minWidth: '100px' }}
          value={year}
        />

        {allowAdding && (
          <IconButton onClick={onAdded} sx={{ width: 50, height: 50 }}>
            <Add />
          </IconButton>
        )}

        {allowRemoving && (
          <IconButton onClick={onRemoved} sx={{ width: 50, height: 50 }}>
            <Delete />
          </IconButton>
        )}
      </Stack>

      {renderValues()}
    </Stack>
  );
};

export default IndicatorValues;
