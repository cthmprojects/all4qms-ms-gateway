import { AddCircle } from '@mui/icons-material';
import { Autocomplete, Chip, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select, Stack, TextField } from '@mui/material';
import { MaterialDatepicker } from 'app/shared/components/input/material-datepicker';
import React, { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { onAutocompleteChanged, onTextChanged } from '../../utils';

type GeneralInformationProps = {
  isOpportunity?: boolean;
  readonly?: boolean;
};

const GeneralInformation = ({ isOpportunity, readonly }: GeneralInformationProps) => {
  const [interestedPart, setInterestedPart] = useState<string>('');
  const [interestedParts, setInterestedParts] = useState<Array<string>>(['A', 'B']);
  const [process, setProcess] = useState<string | null>(null);
  const [processes, setProcesses] = useState<Array<string>>([]);
  const [secondAuxiliaryDescription, setSecondAuxiliaryDescription] = useState<string>('');
  const [sender, setSender] = useState<string | null>(null);
  const [senders, setSenders] = useState<Array<string>>([]);
  const [type, setType] = useState<string | null>(null);
  const [types, setTypes] = useState<Array<string>>(['Risco', 'Oportunidade']);

  const { register, setValue, formState, control, trigger } = useFormContext();

  const otherDate = useWatch({ control, name: 'date' });
  const formInterestedParts = useWatch({ control, name: 'interestedParts' });

  useEffect(() => {
    // Poderia ser qualquer outro campo registrado
    trigger('description');
  }, [formInterestedParts]);

  const getFirstAuxiliaryDescriptionLabel = (): string => {
    return !isOpportunity ? 'Causa' : 'Fraqueza';
  };

  const getSecondAuxiliaryDescriptionLabel = (): string => {
    return !isOpportunity ? 'Efeito' : 'Benefício';
  };

  const onInterestedPartAdded = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setValue('interestedParts', [...formInterestedParts, interestedPart]);
    setInterestedPart('');
  };

  const onInterestedPartDeleted = (index: number): void => {
    const newInterestedParts: Array<string> = formInterestedParts.filter((_, idx) => idx !== index);
    setValue('interestedParts', newInterestedParts, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
  };

  const fieldHook = (fieldName: string) => register(fieldName as any, { required: true });

  const user = useWatch({ control, name: 'sender' });

  return (
    <>
      <Stack direction="row" spacing={2}>
        <FormControl sx={{ flexGrow: 1 }}>
          <InputLabel>Emitido por</InputLabel>
          <Select value={user} input={<OutlinedInput label="Emitido por" />} disabled>
            <MenuItem selected value={user}>
              {user.firstName}
            </MenuItem>
          </Select>
        </FormControl>

        <MaterialDatepicker label="Data" selected={otherDate} onChange={date => setValue('date', date, { shouldValidate: true })} />

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
        <TextField label="Fluxo" {...fieldHook('flow')} placeholder="Fluxo" sx={{ flexGrow: 1 }} />
        <TextField label="Atividade" {...fieldHook('activity')} placeholder="Atividade" />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField label="Descrição" multiline placeholder="Descrição" rows={5} sx={{ flexGrow: 1 }} {...fieldHook('description')} />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField
          label={getFirstAuxiliaryDescriptionLabel()}
          multiline
          placeholder={getFirstAuxiliaryDescriptionLabel()}
          rows={5}
          sx={{ flexGrow: 1 }}
          {...fieldHook('firstAuxiliaryDescription')}
        />
        <TextField
          label={getSecondAuxiliaryDescriptionLabel()}
          multiline
          placeholder={getSecondAuxiliaryDescriptionLabel()}
          rows={5}
          sx={{ flexGrow: 1 }}
          {...fieldHook('secondAuxiliaryDescription')}
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
          value={formInterestedParts}
        />
      </Stack>
    </>
  );
};

export default GeneralInformation;
