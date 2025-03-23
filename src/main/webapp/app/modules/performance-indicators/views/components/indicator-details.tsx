import { Autocomplete, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Indicator, SummarizedProcess } from '../../models';
import { onAutocompleteChanged, onTextChanged } from '../../utils';

type IndicatorDetailsProps = {
  initialValue?: Indicator;
  processes: Array<SummarizedProcess>;
  readonly?: boolean;
  trends: Array<string>;
  units: Array<string>;
  onChanged?: (
    code: string,
    description: string,
    formation: string,
    name: string,
    process: SummarizedProcess,
    responsible: string,
    source: string,
    trend: string,
    unit: string,
    verification: string
  ) => void;
};

const IndicatorDetails = ({ initialValue, processes, readonly, trends, units, onChanged }: IndicatorDetailsProps) => {
  const [code, setCode] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [formation, setFormation] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [process, setProcess] = useState<SummarizedProcess | null>(null);
  const [responsible, setResponsible] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [trend, setTrend] = useState<string | null>(null);
  const [unit, setUnit] = useState<string | null>(null);
  const [verification, setVerification] = useState<string>('');

  useEffect(() => {
    if (!onChanged) {
      return;
    }

    onChanged(code, description, formation, name, process, responsible, source, trend, unit, verification);
  }, [code, description, formation, name, process, responsible, source, trend, unit, verification]);

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    const { code, description, formation, name, processId, responsible, source, trend, unit, verification } = initialValue;

    setCode(code);
    setDescription(description);
    setFormation(formation);
    setName(name);
    setProcess(getProcess(processId));
    setResponsible(responsible);
    setSource(source);
    setTrend(trend);
    setUnit(unit);
    setVerification(verification);
  }, [initialValue]);

  useEffect(() => {
    if (!processes || processes.length <= 0 || process) {
      return;
    }
    setProcess(processes[0]);
  }, [process, processes]);

  useEffect(() => {
    if (!trends || trends.length <= 0 || trend) {
      return;
    }
    setTrend(trends[0]);
  }, [trend, trends]);

  useEffect(() => {
    if (!units || units.length <= 0 || unit) {
      return;
    }
    setUnit(units[0]);
  }, [unit, units]);

  const getProcess = (id: number): SummarizedProcess | null => {
    const filteredProcesses: Array<SummarizedProcess> = processes.filter(i => i.id === id);

    return filteredProcesses.length > 0 ? filteredProcesses[0] : null;
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <TextField disabled={readonly} label="Código" onChange={event => onTextChanged(event, setCode)} placeholder="Código" value={code} />

        <TextField
          disabled={readonly}
          label="Nome"
          onChange={event => onTextChanged(event, setName)}
          placeholder="Nome"
          sx={{ flexGrow: 1 }}
          value={name}
        />

        {/* <Autocomplete
          disableClearable
          disabled={readonly}
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setUnit)}
          options={units}
          renderInput={props => <TextField {...props} label="Unidade" />}
          sx={{ flexGrow: 1 }}
          value={unit}
        /> */}

        <Autocomplete
          disableClearable
          disabled={readonly}
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setTrend)}
          options={trends}
          renderInput={props => <TextField {...props} label="Tendência" />}
          sx={{ flexGrow: 1 }}
          value={trend}
        />

        <Autocomplete
          disableClearable
          disabled={readonly}
          getOptionLabel={option => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setProcess)}
          options={processes}
          renderInput={props => <TextField {...props} label="Processo" />}
          sx={{ flexGrow: 1 }}
          value={process}
        />
      </Stack>

      <TextField
        disabled={readonly}
        label="Descrição do indicador"
        multiline
        onChange={event => onTextChanged(event, setDescription)}
        placeholder="Descrição do indicador"
        rows={5}
        value={description}
      />

      <Stack direction="row" spacing={2}>
        <TextField
          disabled={readonly}
          label="Cargo responsável"
          onChange={event => onTextChanged(event, setResponsible)}
          placeholder="Cargo responsável"
          sx={{ flexGrow: 1 }}
          value={responsible}
        />

        <TextField
          disabled={readonly}
          label="Fonte de dados"
          onChange={event => onTextChanged(event, setSource)}
          placeholder="Fonte de dados"
          sx={{ flexGrow: 1 }}
          value={source}
        />

        <TextField
          disabled={readonly}
          label="Prazo máximo de apuração"
          onChange={event => onTextChanged(event, setVerification)}
          placeholder="Prazo máximo de apuração"
          sx={{ flexGrow: 1 }}
          value={verification}
        />

        <TextField
          disabled={readonly}
          label="Formação do índice"
          onChange={event => onTextChanged(event, setFormation)}
          placeholder="Formação do índice"
          sx={{ flexGrow: 1 }}
          value={formation}
        />
      </Stack>
    </Stack>
  );
};

export default IndicatorDetails;
