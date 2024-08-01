import { Autocomplete, Chip, IconButton, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { onAutocompleteChanged, onDateChanged, onTextChanged } from '../../utils';
import { AddCircle } from '@mui/icons-material';

type GeneralInformationProps = {
  isOpportunity?: boolean;
  readonly?: boolean;
};

const GeneralInformation = ({ isOpportunity, readonly }: GeneralInformationProps) => {
  const [activity, setActivity] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState<string>('');
  const [firstAuxiliaryDescription, setFirstAuxiliaryDescription] = useState<string>('');
  const [flow, setFlow] = useState<string>('');
  const [interestedPart, setInterestedPart] = useState<string>('');
  const [interestedParts, setInterestedParts] = useState<Array<string>>(['A', 'B']);
  const [process, setProcess] = useState<string>('');
  const [processes, setProcesses] = useState<Array<string>>(['Processo 1', 'Processo 2']);
  const [secondAuxiliaryDescription, setSecondAuxiliaryDescription] = useState<string>('');
  const [sender, setSender] = useState<string>('');
  const [senders, setSenders] = useState<Array<string>>(['Usuário 1', 'Usuário 2']);
  const [type, setType] = useState<string>('');
  const [types, setTypes] = useState<Array<string>>(['Risco', 'Oportunidade']);

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

  const getFirstAuxiliaryDescriptionLabel = (): string => {
    return !isOpportunity ? 'Causa' : 'Fraqueza';
  };

  const getSecondAuxiliaryDescriptionLabel = (): string => {
    return !isOpportunity ? 'Efeito' : 'Benefício';
  };

  const onInterestedPartAdded = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setInterestedParts([...interestedParts, interestedPart]);
    setInterestedPart('');
  };

  const onInterestedPartDeleted = (index: number): void => {
    const newInterestedParts: Array<string> = interestedParts.filter((_, idx) => idx !== index);
    setInterestedParts(newInterestedParts);
  };

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Autocomplete
          disableClearable
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
              disableClearable
              onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setType)}
              options={types}
              renderInput={params => <TextField {...params} label="Tipo" />}
              value={type}
            />
            <Autocomplete
              disableClearable
              onChange={(event, value, reason, details) => onAutocompleteChanged(event, value, reason, details, setProcess)}
              options={processes}
              renderInput={params => <TextField {...params} label="Processo" />}
              value={process}
            />
          </>
        )}
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField label="Fluxo" onChange={event => onTextChanged(event, setFlow)} placeholder="Fluxo" sx={{ flexGrow: 1 }} value={flow} />
        <TextField label="Atividade" onChange={event => onTextChanged(event, setActivity)} placeholder="Atividade" value={activity} />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField
          label="Descrição"
          maxRows={5}
          multiline
          onChange={event => onTextChanged(event, setDescription)}
          placeholder="Descrição"
          rows={5}
          sx={{ flexGrow: 1 }}
          value={description}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField
          label={getFirstAuxiliaryDescriptionLabel()}
          maxRows={5}
          multiline
          onChange={event => onTextChanged(event, setFirstAuxiliaryDescription)}
          placeholder={getFirstAuxiliaryDescriptionLabel()}
          rows={5}
          sx={{ flexGrow: 1 }}
          value={firstAuxiliaryDescription}
        />
        <TextField
          label={getSecondAuxiliaryDescriptionLabel()}
          maxRows={5}
          multiline
          onChange={event => onTextChanged(event, setSecondAuxiliaryDescription)}
          placeholder={getSecondAuxiliaryDescriptionLabel()}
          rows={5}
          sx={{ flexGrow: 1 }}
          value={secondAuxiliaryDescription}
        />
      </Stack>

      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Parte interessada"
            onChange={event => onTextChanged(event, setInterestedPart)}
            placeholder="Parte interessada"
            sx={{ flexGrow: 1 }}
            value={interestedPart}
          />
          <IconButton disabled={readonly} aria-label="Adicionar parte interessada" onClick={onInterestedPartAdded}>
            <AddCircle fontSize="large" />
          </IconButton>
        </Stack>

        <Autocomplete
          clearIcon={false}
          options={[]}
          freeSolo
          multiple
          readOnly
          renderTags={(value, props) =>
            value.map((option, index) => <Chip onDelete={_ => onInterestedPartDeleted(index)} label={option} {...props({ index })} />)
          }
          renderInput={params => <TextField {...params} />}
          value={interestedParts}
        />
      </Stack>
    </>
  );
};

export default GeneralInformation;
