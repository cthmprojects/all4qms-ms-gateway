import { Autocomplete, Chip, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { onAutocompleteChanged, onDateChanged } from '../../utils';

type GeneralInformationProps = {
  isOpportunity?: boolean;
  readonly?: boolean;
};

const GeneralInformation = ({ isOpportunity, readonly }: GeneralInformationProps) => {
  const [process, setProcess] = useState<string>('');
  const [processes, setProcesses] = useState<Array<string>>(['Processo 1', 'Processo 2']);
  const [sender, setSender] = useState<string>('');
  const [senders, setSenders] = useState<Array<string>>(['Usuário 1', 'Usuário 2']);
  const [type, setType] = useState<string>('');
  const [types, setTypes] = useState<Array<string>>(['Risco']);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    if (processes.length <= 0) {
      return;
    }

    setProcess(processes[0]);
  }, [processes]);

  useEffect(() => {
    if (senders.length <= 0) {
      return;
    }

    setSender(senders[0]);
  }, [senders]);

  useEffect(() => {
    if (types.length <= 0) {
      return;
    }

    setType(types[0]);
  }, [types]);

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Autocomplete
          onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setSender)}
          options={senders}
          renderInput={params => <TextField {...params} label="Emitido por" />}
          sx={{ flexGrow: 1 }}
          value={sender}
        />

        <DatePicker
          selected={date}
          disabled={readonly}
          onChange={newDate => onDateChanged(newDate, setDate)}
          className="date-picker"
          dateFormat={'dd/MM/yyyy'}
        />

        {!isOpportunity && (
          <>
            <Autocomplete
              onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setType)}
              options={types}
              renderInput={params => <TextField {...params} label="Tipo" />}
              value={type}
            />
            <Autocomplete
              onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setProcess)}
              options={processes}
              renderInput={params => <TextField {...params} label="Processo" />}
              value={process}
            />
          </>
        )}
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField label="Fluxo" placeholder="Fluxo" sx={{ flexGrow: 1 }} />
        <TextField label="Atividade" placeholder="Atividade" />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField label="Descrição" maxRows={5} multiline placeholder="Descrição" sx={{ flexGrow: 1 }} />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField label="Causa" maxRows={5} multiline placeholder="Causa" sx={{ flexGrow: 1 }} />
        <TextField label="Efeito" maxRows={5} multiline placeholder="Efeito" sx={{ flexGrow: 1 }} />
      </Stack>

      <Stack spacing={2}>
        <TextField label="Parte interessada" maxRows={5} multiline placeholder="Parte interessada" sx={{ flexGrow: 1 }} />

        <Autocomplete
          clearIcon={false}
          options={[]}
          freeSolo
          multiple
          renderTags={(value, props) => value.map((option, index) => <Chip label={option} {...props({ index })} />)}
          renderInput={params => <TextField {...params} />}
        />
      </Stack>
    </>
  );
};

export default GeneralInformation;
