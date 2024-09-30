import { IconButton, Stack, TextField } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from 'reactstrap';
import { Controller, useFormContext, useFormState } from 'react-hook-form';
import { formField } from 'app/shared/util/form-utils';
import { OnlyRequired } from 'app/shared/model/util';
import { Rnc } from 'app/modules/rnc/models';
import { generateRnc } from '../audit-service';
import { useState } from 'react';
import { naoConformidadeToRncMs } from '../rnc-helper';

type RegisterNcOmItemProps = {
  isNC: boolean;
  fieldPrefix: string;
  raizNaoConformidade: OnlyRequired<Rnc>;
};

const defaultRules = { required: 'Campo obrigatório' };

export const RegisterNcOmItem = ({ isNC, fieldPrefix, raizNaoConformidade }: RegisterNcOmItemProps) => {
  const { control, register, getValues } = useFormContext();
  const { errors } = useFormState({ control });
  const [savedRnc, setSavedRnc] = useState('');

  const formr = (name: keyof typeof control._defaultValues) => ({
    ...register(name, { required: 'Campo obrigatório' }),
    required: true,
    error: !!errors?.[name]?.message,
    helperText: errors?.[name]?.message as string,
  });

  async function generateHandler() {
    const { numeroNC, numeroRelatorio } = getValues();
    const auditoria = {
      ocorrenciaAuditoria: numeroNC,
      processoAuditoria: Number(numeroRelatorio),
      sequecialAuditoria: 1,
      normaAuditoria: '',
      requisitoAuditoria: '',
    };
    const payload = { auditoria, raizNaoConformidade, naoConformidade: naoConformidadeToRncMs(getValues(fieldPrefix)) };
    const { id } = await generateRnc(payload);
    setSavedRnc(id + '');
  }

  return (
    <Stack flexDirection="row" gap="24px" paddingX="24px">
      <Stack flexBasis="88%" flexShrink="1" gap="16px">
        {/* Para campos de dentro de um array, o melhor é usar o `Controller`... ele é vida! */}
        <Controller
          name={`${fieldPrefix}.descricao`}
          control={control}
          rules={defaultRules}
          render={renderPayload => <TextField multiline rows="3" fullWidth label="Não conformidade" {...formField(renderPayload)} />}
        />
        <Controller
          name={`${fieldPrefix}.requisito`}
          control={control}
          rules={defaultRules}
          render={renderPayload => <TextField multiline rows="3" fullWidth label="Requisito descumprido" {...formField(renderPayload)} />}
        />
        <Controller
          name={`${fieldPrefix}.evidencia`}
          control={control}
          rules={defaultRules}
          render={renderPayload => <TextField multiline rows="3" fullWidth label="Evidência objetiva" {...formField(renderPayload)} />}
        />
      </Stack>

      <Stack flexGrow="1" justifyContent="center" alignItems="center" gap="16px">
        <Stack flexDirection="row" width="100%" gap="10px" justifyContent="space-between">
          <IconButton>
            <UploadFileIcon />
          </IconButton>
          <IconButton>
            <DownloadIcon />
          </IconButton>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Stack>
        <TextField disabled value={savedRnc} label={`Número da ${isNC ? 'RNC' : 'ROM'}`} />
        <Button variant="contained" style={{ background: '#d9d9d9', color: '#4e4d4d' }} onClick={generateHandler}>
          GERAR {isNC ? 'RNC' : 'ROM'}
        </Button>
      </Stack>
    </Stack>
  );
};
