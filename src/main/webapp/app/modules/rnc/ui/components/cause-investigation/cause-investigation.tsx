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
};

const IshikawaInvestigation = ({ description, onChanged }: IshikawaInvestigationProps) => {
  const [environmentCauses, setEnvironmentCauses] = useState<Array<string>>([]);
  const [machineCauses, setMachineCauses] = useState<Array<string>>([]);
  const [manpowerCauses, setManpowerCauses] = useState<Array<string>>([]);
  const [measurementCauses, setMeasurementCauses] = useState<Array<string>>([]);
  const [methodCauses, setMethodCauses] = useState<Array<string>>([]);
  const [rawMaterialCauses, setRawMaterialCauses] = useState<Array<string>>([]);

  useEffect(() => {
    onChanged({
      environment: environmentCauses,
      machine: machineCauses,
      manpower: manpowerCauses,
      measurement: measurementCauses,
      method: methodCauses,
      rawMaterial: rawMaterialCauses,
    });
  }, [environmentCauses, machineCauses, manpowerCauses, measurementCauses, methodCauses, rawMaterialCauses]);

  const onEnvironmentCausesChanged = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    const { value } = event.target;
    setEnvironmentCauses([...environmentCauses, value]);
  };

  const onMachineCausesChanged = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    const { value } = event.target;
    setMachineCauses([...machineCauses, value]);
  };

  const onManpowerCausesChanged = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    const { value } = event.target;
    setManpowerCauses([...manpowerCauses, value]);
  };

  const onMeasurementCausesChanged = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    const { value } = event.target;
    setMeasurementCauses([...measurementCauses, value]);
  };

  const onMethodCausesChanged = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    const { value } = event.target;
    setMethodCauses([...methodCauses, value]);
  };

  const onRawMaterialCausesChanged = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    const { value } = event.target;
    setRawMaterialCauses([...rawMaterialCauses, value]);
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
            defaultValue={[]}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
            }
            disableClearable
            renderInput={params => <TextField {...params} label="Meio Ambiente" onChange={onEnvironmentCausesChanged} />}
          />
          <Autocomplete
            multiple
            className="m-2"
            id="tags-outlined"
            options={['']}
            defaultValue={[]}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
            }
            disableClearable
            renderInput={params => <TextField {...params} label="Máquina" onChange={onMachineCausesChanged} />}
          />
        </div>
        <div className="flex-col" style={{ marginTop: '19px', width: '100%' }}>
          <Autocomplete
            multiple
            className="m-2"
            id="tags-outlined"
            options={['']}
            defaultValue={[]}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
            }
            disableClearable
            renderInput={params => <TextField {...params} label="Mão de obra" onChange={onManpowerCausesChanged} />}
          />
          <Autocomplete
            multiple
            className="m-2"
            id="tags-outlined"
            options={['']}
            defaultValue={[]}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
            }
            disableClearable
            renderInput={params => <TextField {...params} label="Medição" onChange={onMeasurementCausesChanged} />}
          />
        </div>
        <div className="flex-col" style={{ marginTop: '19px', width: '100%' }}>
          <Autocomplete
            multiple
            className="m-2"
            id="tags-outlined"
            options={['']}
            defaultValue={[]}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
            }
            disableClearable
            renderInput={params => <TextField {...params} label="Método" onChange={onMethodCausesChanged} />}
          />
          <Autocomplete
            multiple
            className="m-2"
            id="tags-outlined"
            options={['']}
            defaultValue={[]}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
            }
            disableClearable
            renderInput={params => <TextField {...params} label="Matéria-prima" onChange={onRawMaterialCausesChanged} />}
          />
        </div>
      </div>
    </Card>
  );
};

type ReasonsInvestigationProps = {
  description?: string;
  onChanged: (investigation: ReasonsInvestigation) => void;
};

const ReasonsInvestigation = ({ description, onChanged }: ReasonsInvestigationProps) => {
  const [firstReason, setFirstReason] = useState<string>('');
  const [secondReason, setSecondReason] = useState<string>('');
  const [thirdReason, setThirdReason] = useState<string>('');
  const [fourthReason, setFourthReason] = useState<string>('');
  const [fifthReason, setFifthReason] = useState<string>('');

  useEffect(() => {
    onChanged({
      first: firstReason,
      second: secondReason,
      third: thirdReason,
      fourth: fourthReason,
      fifth: fifthReason,
    });
  }, []);

  const onFirstReasonChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setFirstReason(value);
  };

  const onSecondReasonChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setSecondReason(value);
  };

  const onThirdReasonChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setThirdReason(value);
  };

  const onFourthReasonChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setFourthReason(value);
  };

  const onFifthReasonChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setFifthReason(value);
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
          <TextField label="Porquê?" className="m-2" required onChange={onFirstReasonChanged} value={firstReason} />
          <TextField label="Porquê?" className="m-2" required onChange={onSecondReasonChanged} value={secondReason} />
          <TextField label="Porquê?" className="m-2" required onChange={onThirdReasonChanged} value={thirdReason} />
          <TextField label="Porquê?" className="m-2" onChange={onFourthReasonChanged} value={fourthReason} />
          <TextField label="Porquê?" className="m-2" onChange={onFifthReasonChanged} value={fifthReason} />
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
    </Card>
  );
};

type CauseInvestigationProps = {
  description?: string;
  onIshikawaInvestigationChanged: (investigation: IshikawaInvestigation) => void;
  onReasonsInvestigationChanged: (investigation: ReasonsInvestigation) => void;
  checkIshikawa: (check: boolean) => void;
  checkReasons: (check: boolean) => void;
};

const CauseInvestigation = ({
  description,
  onIshikawaInvestigationChanged,
  onReasonsInvestigationChanged,
  checkIshikawa,
  checkReasons,
}: CauseInvestigationProps) => {
  const [ishikawaEnabled, setIshikawaEnabled] = useState<boolean>(false);
  const [reasonsEnabled, setReasonsEnabled] = useState<boolean>(false);

  const onIshikawaChanged = (event: React.SyntheticEvent<Element, Event>, checked: boolean): void => {
    setIshikawaEnabled(checked);
    checkIshikawa(checked);
  };

  const onReasonsChanged = (event: React.SyntheticEvent<Element, Event>, checked: boolean): void => {
    setReasonsEnabled(checked);
    checkReasons(checked);
  };

  return (
    <Card sx={{ minWidth: 275 }} className="mt-3 mb-2">
      <CardContent>
        <Typography variant="h5" component="div">
          Investigação de causas
        </Typography>

        <div className="mt-2" style={{ display: 'flex' }}>
          <FormControlLabel control={<Checkbox />} onChange={onIshikawaChanged} label="Ishikawa" />
          <FormControlLabel control={<Checkbox />} onChange={onReasonsChanged} label="Resposta dos 5 porquês" />
        </div>

        {ishikawaEnabled && <IshikawaInvestigation description={description} onChanged={onIshikawaInvestigationChanged} />}

        {reasonsEnabled && <ReasonsInvestigation description={description} onChanged={onReasonsInvestigationChanged} />}
      </CardContent>
    </Card>
  );
};

export default CauseInvestigation;
