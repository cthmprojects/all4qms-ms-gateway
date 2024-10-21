import { AddCircle } from '@mui/icons-material';
import { Autocomplete, Chip, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select, Stack, TextField } from '@mui/material';
import { MaterialDatepicker } from 'app/shared/components/input/material-datepicker';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { onAutocompleteChanged, onTextChanged } from '../../utils';
import { RawInterestedPart, SummarizedProcess } from '../../models';

type GeneralInformationProps = {
  isOpportunity?: boolean;
  summarizedProcesses: Array<SummarizedProcess>;
  readonly?: boolean;
};

const GeneralInformation = ({ isOpportunity, summarizedProcesses, readonly }: GeneralInformationProps) => {
  const [interestedPart, setInterestedPart] = useState<string>('');
  const [processes, setProcesses] = useState<Array<SummarizedProcess>>([]);

  const { register, setValue, formState, control, trigger } = useFormContext();

  const otherDate = useWatch({ control, name: 'date' });
  const formInterestedParts: RawInterestedPart = useWatch({ control, name: 'interestedParts', exact: true });
  const processForm = useWatch({ control, name: 'process' });

  const [interestedPartsArray, setInterestedPartsArray] = useState([]);

  useEffect(() => {
    // Poderia ser qualquer outro campo registrado
    if (!interestedPartsArray.length && formInterestedParts.nomeParteInteressada) {
      setInterestedPartsArray(formInterestedParts.nomeParteInteressada.split(';'));
    }
    trigger('description');
  }, [formInterestedParts.id]);

  useEffect(() => {
    const newInterestedParts: RawInterestedPart = { ...formInterestedParts, nomeParteInteressada: interestedPartsArray.join(';') };
    setValue('interestedParts', newInterestedParts, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
  }, [interestedPartsArray]);

  useEffect(() => {
    setProcesses(summarizedProcesses);
  }, [summarizedProcesses]);

  const getFirstAuxiliaryDescriptionLabel = (): string => {
    return !isOpportunity ? 'Causa' : 'Fraqueza';
  };

  const getSecondAuxiliaryDescriptionLabel = (): string => {
    return !isOpportunity ? 'Efeito' : 'Benefício';
  };

  const onInterestedPartAdded = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setInterestedPartsArray([...interestedPartsArray, interestedPart]);
    setInterestedPart('');
  };

  const onInterestedPartDeleted = (index: number): void => {
    const newInterestedParts: Array<string> = interestedPartsArray.filter((_, idx) => idx !== index);
    setInterestedPartsArray(newInterestedParts);
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
              {user?.name}
            </MenuItem>
          </Select>
        </FormControl>

        <MaterialDatepicker
          disabled={readonly}
          label="Data"
          selected={otherDate}
          onChange={date => setValue('date', date, { shouldValidate: true })}
          sx={{ flexGrow: 1 }}
        />

        {!isOpportunity && (
          <>
            {/* <Autocomplete
              disableClearable
              onChange={(event, value, reason, details) => setValue('type', value, { shouldValidate: true })}
              options={types}
              renderInput={params => <TextField {...params} label="Tipo" />}
              value={type}
            /> */}
            <Autocomplete
              disableClearable
              disabled={readonly}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value, reason, details) => setValue('process', value, { shouldValidate: true })}
              options={processes}
              getOptionLabel={option => option.name}
              renderInput={params => <TextField {...params} label="Processo" />}
              sx={{ flexGrow: 1 }}
              value={processForm}
            />
          </>
        )}
      </Stack>

      <Stack direction="row" spacing={2}>
        <Controller
          name="flow"
          control={control}
          render={({ field }) => <TextField disabled={readonly} label="Fluxo" placeholder="Fluxo" sx={{ flexGrow: 1 }} {...field} />}
        />
        <Controller
          name="activity"
          control={control}
          render={({ field }) => (
            <TextField disabled={readonly} label="Atividade" placeholder="Atividade" sx={{ flexGrow: 1 }} {...field} />
          )}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField disabled={readonly} label="Descrição" multiline placeholder="Descrição" rows={5} sx={{ flexGrow: 1 }} {...field} />
          )}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <Controller
          name="firstAuxiliaryDescription"
          control={control}
          render={({ field }) => (
            <TextField
              disabled={readonly}
              label={getFirstAuxiliaryDescriptionLabel()}
              multiline
              placeholder={getFirstAuxiliaryDescriptionLabel()}
              rows={5}
              sx={{ flexGrow: 1 }}
              {...field}
            />
          )}
        />
        <Controller
          name="secondAuxiliaryDescription"
          control={control}
          render={({ field }) => (
            <TextField
              disabled={readonly}
              label={getSecondAuxiliaryDescriptionLabel()}
              multiline
              placeholder={getSecondAuxiliaryDescriptionLabel()}
              rows={5}
              sx={{ flexGrow: 1 }}
              {...field}
            />
          )}
        />
      </Stack>

      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <TextField
            disabled={readonly}
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
          disabled={readonly}
          freeSolo
          multiple
          readOnly
          options={[]}
          renderTags={(value, props) =>
            value.map((option, index) => <Chip onDelete={_ => onInterestedPartDeleted(index)} label={option} {...props({ index })} />)
          }
          renderInput={params => <TextField {...params} />}
          value={interestedPartsArray}
        />
      </Stack>
    </>
  );
};

export default GeneralInformation;
