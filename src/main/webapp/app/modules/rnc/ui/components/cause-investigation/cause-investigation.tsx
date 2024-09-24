import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { AddOutlined, DeleteOutline } from '@mui/icons-material';
import { Textarea, styled } from '@mui/joy';
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { IshikawaInvestigation, ReasonsInvestigation } from 'app/modules/rnc/models';
import React, { useEffect, useState } from 'react';
import { CardHeader } from 'reactstrap';

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

  useEffect(() => {
    if (!ishikawa) {
      return;
    }

    setEnvironmentCauses(ishikawa?.environment);
    setMachineCauses(ishikawa?.machine);
    setManpowerCauses(ishikawa?.manpower);
    setMeasurementCauses(ishikawa?.measurement);
    setMethodCauses(ishikawa?.method);
    setRawMaterialCauses(ishikawa?.rawMaterial);
  }, [ishikawa]);

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
    <Card className="mt-3 mb-2">
      <CardHeader>
        <Typography variant="h5" sx={{ marginLeft: 2, marginTop: 1 }}>
          Ishikawa
        </Typography>
      </CardHeader>
      <CardContent>
        <div className="flex p-2" style={{ justifyContent: 'space-between' }}>
          <div className="flex-col">
            <br />
            <Textarea
              slots={{ textarea: InnerTextareaNC }}
              slotProps={{ textarea: { placeholder: 'NC' } }}
              sx={{ borderRadius: '6px', overflowY: 'scroll' }}
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
              value={environmentCauses}
              onChange={(event, values, reason, details) => {
                onEnvironmentCausesChanged(values);
              }}
              disabled={!newIshikawa}
              freeSolo
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
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
              value={machineCauses}
              onChange={(event, values, reason, details) => {
                onMachineCausesChanged(values);
              }}
              freeSolo
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
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
              value={manpowerCauses}
              onChange={(event, values, reason, details) => {
                onManpowerCausesChanged(values);
              }}
              freeSolo
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
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
              value={measurementCauses}
              onChange={(event, values, reason, details) => {
                onMeasurementCausesChanged(values);
              }}
              freeSolo
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
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
              value={methodCauses}
              onChange={(event, values, reason, details) => {
                onMethodCausesChanged(values);
              }}
              freeSolo
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
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
              value={rawMaterialCauses}
              onChange={(event, values, reason, details) => {
                onRawMaterialCausesChanged(values);
              }}
              freeSolo
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => <Chip label={option} {...getTagProps({ index })} />)
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
      </CardContent>
    </Card>
  );
};

type ReasonsInvestigationProps = {
  allowRemoving?: boolean;
  description?: string;
  onAdded?: () => void;
  onRemoved?: () => void;
  onChanged: (investigation: ReasonsInvestigation) => void;
  reasons: ReasonsInvestigation;
  newReasons: boolean;
};

const ReasonsInvestigation = ({ allowRemoving, description, onChanged, onRemoved, reasons, newReasons }: ReasonsInvestigationProps) => {
  const [firstReason, setFirstReason] = useState<string>(reasons?.first || '');
  const [secondReason, setSecondReason] = useState<string>(reasons?.second || '');
  const [thirdReason, setThirdReason] = useState<string>(reasons?.third || '');
  const [fourthReason, setFourthReason] = useState<string>(reasons?.fourth || '');
  const [fifthReason, setFifthReason] = useState<string>(reasons?.fifth || '');
  const [causeReason, setCauseReason] = useState<string>(reasons?.cause || '');
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
      cause: causeReason,
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
      cause: causeReason,
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
      cause: causeReason,
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
      cause: causeReason,
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
      cause: causeReason,
    });
  };

  const onCauseReasonChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setCauseReason(value);
    validateAndSave({
      first: firstReason,
      second: secondReason,
      third: thirdReason,
      fourth: fourthReason,
      fifth: fifthReason,
      cause: value,
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
            onChange={onCauseReasonChanged}
            value={causeReason}
            disabled={!newReasons}
          />
          {allowRemoving && (
            <Button
              onClick={() => {
                onRemoved();
              }}
            >
              <DeleteOutline />
            </Button>
          )}
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
  onReasonsInvestigationsChanged: (investigations: Array<ReasonsInvestigation>) => void;
  checkIshikawa: (check: boolean) => void;
  checkReasons: (check: boolean) => void;
  checkedIshikawa: boolean;
  checkedReasons: boolean;
  ishikawa: IshikawaInvestigation;
  reasons: Array<ReasonsInvestigation>;
  newIshikawa: boolean;
  newReasons: boolean;
  minimumReasons: number;
};

const CauseInvestigation = ({
  description,
  onIshikawaInvestigationChanged,
  onReasonsInvestigationsChanged,
  checkIshikawa,
  checkReasons,
  checkedIshikawa,
  checkedReasons,
  ishikawa,
  reasons,
  newIshikawa,
  newReasons,
  minimumReasons,
}: CauseInvestigationProps) => {
  const onReasonsInvestigationChanged = (investigation: ReasonsInvestigation, index: number): void => {
    const newReasons = [...reasons];
    newReasons[index] = investigation;
    onReasonsInvestigationsChanged(newReasons);
  };

  const onReasonsInvestigationRemoved = (index: number): void => {
    const newReasons = reasons.filter((_, idx) => idx !== index);
    onReasonsInvestigationsChanged(newReasons);
  };

  return (
    <Card sx={{ minWidth: 275 }} className="mt-3 mb-2">
      <CardContent>
        <Typography variant="h5" component="div">
          Investigação de causas
        </Typography>

        <IshikawaInvestigation
          newIshikawa={newIshikawa}
          ishikawa={ishikawa}
          description={description}
          onChanged={onIshikawaInvestigationChanged}
        />

        <Card className="mt-3 mb-2">
          <CardHeader>
            <Stack direction="row" spacing={2} sx={{ marginLeft: 2, marginTop: 1 }}>
              <Typography variant="h5">5 Porquês</Typography>

              <Button
                onClick={() => {
                  onReasonsInvestigationsChanged([...reasons, { fifth: '', first: '', fourth: '', second: '', third: '', cause: '' }]);
                }}
              >
                <AddOutlined />
              </Button>
            </Stack>
          </CardHeader>
          <CardContent>
            {reasons.map((reason, index) => (
              <ReasonsInvestigation
                allowRemoving={index >= minimumReasons}
                key={index}
                newReasons={newReasons}
                reasons={reason}
                description={description}
                onChanged={investigation => onReasonsInvestigationChanged(investigation, index)}
                onRemoved={() => onReasonsInvestigationRemoved(index)}
              />
            ))}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default CauseInvestigation;
