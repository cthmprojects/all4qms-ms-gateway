import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { Textarea, styled } from '@mui/joy';
import { Autocomplete, Card, CardContent, Checkbox, Chip, FormControlLabel, TextField, Typography } from '@mui/material';
import { IshikawaInvestigation, ReasonsInvestigation } from 'app/modules/rnc/models';
import React, { useEffect, useState } from 'react';

const StyledTextarea = styled(TextareaAutosize)({
  resize: 'none',
  border: 'none', // remove the native textarea border
  minWidth: 0, // remove the native textarea width
  outline: 0, // remove the native textarea outline
  padding: 0, // remove the native textarea padding
  paddingBlockStart: '1em',
  paddingInlineEnd: `var(--Textarea-paddingInline)`,
  flex: 'auto',
  alignSelf: 'stretch',
  color: 'inherit',
  backgroundColor: 'transparent',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontStyle: 'inherit',
  fontWeight: 'inherit',
  lineHeight: 'inherit',
  '&::placeholder': {
    opacity: 0,
    transition: '0.1s ease-out',
  },
  '&:focus::placeholder': {
    opacity: 1,
  },
  // specific to TextareaAutosize, cannot use '&:focus ~ label'
  '&:focus + textarea + label, &:not(:placeholder-shown) + textarea + label': {
    top: '0.5rem',
    fontSize: '0.75rem',
  },
  '&:focus + textarea + label': {
    color: 'var(--Textarea-focusedHighlight)',
  },
});

const StyledLabel = styled('label')(({ theme }) => ({
  position: 'absolute',
  lineHeight: 1,
  top: 'calc((var(--Textarea-minHeight) - 1em) / 2)',
  color: theme.vars.palette.text.tertiary,
  fontWeight: theme.vars.fontWeight.md,
  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
}));

const InnerTextareaNC = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={5} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>NC</StyledLabel>
    </React.Fragment>
  );
});

const InnerTextareaCausa = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={5} cols={30} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Causa</StyledLabel>
    </React.Fragment>
  );
});

type IshikawaInvestigationProps = {
  description?: string;
  onChanged: (investigation: IshikawaInvestigation) => void;
  ishikawa;
  newIshikawa;
};

const IshikawaInvestigation = ({ description, onChanged, ishikawa, newIshikawa }: IshikawaInvestigationProps) => {
  const [environmentCauses, setEnvironmentCauses] = useState<Array<string>>(ishikawa?.environment || []);
  const [machineCauses, setMachineCauses] = useState<Array<string>>(ishikawa?.machine || []);
  const [manpowerCauses, setManpowerCauses] = useState<Array<string>>(ishikawa?.manpower || []);
  const [measurementCauses, setMeasurementCauses] = useState<Array<string>>(ishikawa?.measurement || []);
  const [methodCauses, setMethodCauses] = useState<Array<string>>(ishikawa?.method || []);
  const [rawMaterialCauses, setRawMaterialCauses] = useState<Array<string>>(ishikawa?.rawMaterial || []);
  const [invalid, setInvalid] = useState<boolean>(false);

  useEffect(() => {
    onChanged({
      environment: environmentCauses,
      machine: machineCauses,
      manpower: manpowerCauses,
      measurement: measurementCauses,
      method: methodCauses,
      rawMaterial: rawMaterialCauses,
    });

    let counter = 0;
    if (environmentCauses.length > 0) counter++;
    if (machineCauses.length > 0) counter++;
    if (manpowerCauses.length > 0) counter++;
    if (measurementCauses.length > 0) counter++;
    if (methodCauses.length > 0) counter++;
    if (rawMaterialCauses.length > 0) counter++;

    if (counter < 1) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  }, [environmentCauses, machineCauses, manpowerCauses, measurementCauses, methodCauses, rawMaterialCauses]);

  const onEnvironmentCausesChanged = (inputValue): void => {
    setEnvironmentCauses(inputValue);
  };

  const onMachineCausesChanged = (inputValue): void => {
    setMachineCauses(inputValue);
  };

  const onManpowerCausesChanged = (inputValue): void => {
    setManpowerCauses(inputValue);
  };

  const onMeasurementCausesChanged = (inputValue): void => {
    setMeasurementCauses(inputValue);
  };

  const onMethodCausesChanged = (inputValue): void => {
    setMethodCauses(inputValue);
  };

  const onRawMaterialCausesChanged = (inputValue): void => {
    setRawMaterialCauses(inputValue);
  };

  return (
    <Card className="mt-2">
      <div className="flex p-2" style={{ justifyContent: 'space-between' }}>
        <div className="flex-col">
          <br />
          <Textarea
            slots={{ textarea: InnerTextareaNC }}
            slotProps={{ textarea: { placeholder: 'NC' } }}
            sx={{ borderRadius: '6px' }}
            name="ncArea"
            value={description || ''}
            readOnly
          />
        </div>
        <div className="flex-col" style={{ marginTop: '19px', width: '100%' }}>
          <Autocomplete
            multiple
            className="m-2"
            id="tags-outlined"
            options={['']}
            defaultValue={environmentCauses}
            disabled={!newIshikawa}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map(
                (option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />,
                onEnvironmentCausesChanged(value)
              )
            }
            disableClearable
            renderInput={params => <TextField {...params} label="Meio Ambiente" />}
          />
          <Autocomplete
            multiple
            className="m-2"
            id="tags-outlined"
            disabled={!newIshikawa}
            options={['']}
            defaultValue={machineCauses}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map(
                (option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />,
                onMachineCausesChanged(value)
              )
            }
            disableClearable
            renderInput={params => <TextField {...params} label="Máquina" />}
          />
        </div>
        <div className="flex-col" style={{ marginTop: '19px', width: '100%' }}>
          <Autocomplete
            multiple
            className="m-2"
            id="tags-outlined"
            disabled={!newIshikawa}
            options={['']}
            defaultValue={manpowerCauses}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map(
                (option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />,
                onManpowerCausesChanged(value)
              )
            }
            disableClearable
            renderInput={params => <TextField {...params} label="Mão de obra" />}
          />
          <Autocomplete
            multiple
            className="m-2"
            id="tags-outlined"
            disabled={!newIshikawa}
            options={['']}
            defaultValue={measurementCauses}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map(
                (option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />,
                onMeasurementCausesChanged(value)
              )
            }
            disableClearable
            renderInput={params => <TextField {...params} label="Medição" />}
          />
        </div>
        <div className="flex-col" style={{ marginTop: '19px', width: '100%' }}>
          <Autocomplete
            multiple
            className="m-2"
            id="tags-outlined"
            disabled={!newIshikawa}
            options={['']}
            defaultValue={methodCauses}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map(
                (option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />,
                onMethodCausesChanged(value)
              )
            }
            disableClearable
            renderInput={params => <TextField {...params} label="Método" />}
          />
          <Autocomplete
            multiple
            className="m-2"
            id="tags-outlined"
            disabled={!newIshikawa}
            options={['']}
            defaultValue={rawMaterialCauses}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map(
                (option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />,
                onRawMaterialCausesChanged(value)
              )
            }
            disableClearable
            renderInput={params => <TextField {...params} label="Matéria-prima" />}
          />
        </div>
      </div>
      {invalid && (
        <span style={{ justifyContent: 'start', color: 'red' }} className="ms-2 mb-2">
          * você precisa preencher no mínimo um campo e apertar enter
        </span>
      )}
    </Card>
  );
};

type ReasonsInvestigationProps = {
  description?: string;
  onChanged: (investigation: ReasonsInvestigation) => void;
  reasons;
  newReasons;
};

const ReasonsInvestigation = ({ description, onChanged, reasons, newReasons }: ReasonsInvestigationProps) => {
  const [firstReason, setFirstReason] = useState<string>(reasons?.first || '');
  const [secondReason, setSecondReason] = useState<string>(reasons?.second || '');
  const [thirdReason, setThirdReason] = useState<string>(reasons?.third || '');
  const [fourthReason, setFourthReason] = useState<string>(reasons?.fourth || '');
  const [fifthReason, setFifthReason] = useState<string>(reasons?.fifth || '');
  const [invalid, setInvalid] = useState<boolean>(false);

  const validateAndSave = (reasons: any) => {
    onChanged(reasons);

    let counter = 0;

    if (reasons.first) counter++;
    if (reasons.second) counter++;
    if (reasons.third) counter++;
    if (reasons.fourth) counter++;
    if (reasons.fifth) counter++;

    if (counter < 3) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  };

  const onFirstReasonChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setFirstReason(value);

    validateAndSave({
      first: value,
      second: secondReason,
      third: thirdReason,
      fourth: fourthReason,
      fifth: fifthReason,
    });
  };

  const onSecondReasonChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setSecondReason(value);
    validateAndSave({
      first: firstReason,
      second: value,
      third: thirdReason,
      fourth: fourthReason,
      fifth: fifthReason,
    });
  };

  const onThirdReasonChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setThirdReason(value);
    validateAndSave({
      first: firstReason,
      second: secondReason,
      third: value,
      fourth: fourthReason,
      fifth: fifthReason,
    });
  };

  const onFourthReasonChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setFourthReason(value);
    validateAndSave({
      first: firstReason,
      second: secondReason,
      third: thirdReason,
      fourth: value,
      fifth: fifthReason,
    });
  };

  const onFifthReasonChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setFifthReason(value);
    validateAndSave({
      first: firstReason,
      second: secondReason,
      third: thirdReason,
      fourth: fourthReason,
      fifth: value,
    });
  };

  return (
    <Card className="mt-2">
      <div className="flex p-2">
        <div className="flex-col">
          <br />
          <Textarea
            slots={{ textarea: InnerTextareaNC }}
            slotProps={{ textarea: { placeholder: 'NC' } }}
            sx={{ borderRadius: '6px' }}
            name="ncArea"
            value={description || ''}
            readOnly
          />
        </div>
        <div className="flex-col" style={{ marginTop: '19px', width: '100%' }}>
          <TextField label="Porquê?" className="m-2" disabled={!newReasons} onChange={onFirstReasonChanged} value={firstReason} />
          <TextField label="Porquê?" className="m-2" disabled={!newReasons} onChange={onSecondReasonChanged} value={secondReason} />
          <TextField label="Porquê?" className="m-2" disabled={!newReasons} onChange={onThirdReasonChanged} value={thirdReason} />
          <TextField label="Porquê?" className="m-2" disabled={!newReasons} onChange={onFourthReasonChanged} value={fourthReason} />
          <TextField label="Porquê?" className="m-2" disabled={!newReasons} onChange={onFifthReasonChanged} value={fifthReason} />
        </div>
        <div className="flex-col">
          <br />
          <Textarea
            slots={{ textarea: InnerTextareaCausa }}
            slotProps={{ textarea: { placeholder: 'Causa', label: 'Causa' } }}
            sx={{ borderRadius: '6px' }}
            name="ncArea"
            value={description || ''}
            readOnly
          />
        </div>
      </div>
      {invalid && (
        <span style={{ justifyContent: 'start', color: 'red' }} className="ms-2 mb-2">
          * você precisa preencher no mínimo três campos
        </span>
      )}
    </Card>
  );
};

type CauseInvestigationProps = {
  description?: string;
  onIshikawaInvestigationChanged: (investigation: IshikawaInvestigation) => void;
  onReasonsInvestigationChanged: (investigation: ReasonsInvestigation) => void;
  checkIshikawa: (check: boolean) => void;
  checkReasons: (check: boolean) => void;
  checkedIshikawa: boolean;
  checkedReasons: boolean;
  ishikawa;
  reasons;
  newIshikawa;
  newReasons;
};

const CauseInvestigation = ({
  description,
  onIshikawaInvestigationChanged,
  onReasonsInvestigationChanged,
  checkIshikawa,
  checkReasons,
  checkedIshikawa,
  checkedReasons,
  ishikawa,
  reasons,
  newIshikawa,
  newReasons,
}: CauseInvestigationProps) => {
  const onIshikawaChanged = (event: React.SyntheticEvent<Element, Event>, checked: boolean): void => {
    checkIshikawa(checked);
  };

  const onReasonsChanged = (event: React.SyntheticEvent<Element, Event>, checked: boolean): void => {
    checkReasons(checked);
  };

  return (
    <Card sx={{ minWidth: 275 }} className="mt-3 mb-2">
      <CardContent>
        <Typography variant="h5" component="div">
          Investigação de causas
        </Typography>

        <div className="mt-2" style={{ display: 'flex' }}>
          <FormControlLabel control={<Checkbox checked={checkedIshikawa} />} onChange={onIshikawaChanged} label="Ishikawa" />
          <FormControlLabel control={<Checkbox checked={checkedReasons} />} onChange={onReasonsChanged} label="Resposta dos 5 porquês" />
        </div>

        {checkedIshikawa && (
          <IshikawaInvestigation
            newIshikawa={newIshikawa}
            ishikawa={ishikawa}
            description={description}
            onChanged={onIshikawaInvestigationChanged}
          />
        )}

        {checkedReasons && (
          <ReasonsInvestigation
            newReasons={newReasons}
            reasons={reasons}
            description={description}
            onChanged={onReasonsInvestigationChanged}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CauseInvestigation;
