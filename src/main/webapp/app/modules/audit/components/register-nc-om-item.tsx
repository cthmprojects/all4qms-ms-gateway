import { Button, IconButton, Stack, TextField, Tooltip } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { formField } from 'app/shared/util/form-utils';
import { OnlyRequired } from 'app/shared/model/util';
import { Rnc } from 'app/modules/rnc/models';
import { generateRnc, persistNcsOmsAuditoria } from '../audit-service';
import { useMemo, useState } from 'react';
import { naoConformidadeToRncMs } from '../audit-helper';
import { RegistrarAuditoriaForm } from '../audit-models';
import { AttachmentButton } from 'app/shared/layout/AttachmentButton';

type RegisterNcOmItemProps = {
  isNC: boolean;
  fieldPrefix: `${'ncList' | 'omList'}.${number}`;
  raizNaoConformidade: OnlyRequired<Rnc>;
  showGenerateNcButton?: boolean;
};

const defaultRules = { required: 'Campo obrigatório' };

export const RegisterNcOmItem = ({ isNC, fieldPrefix, raizNaoConformidade, showGenerateNcButton }: RegisterNcOmItemProps) => {
  const { control, getValues } = useFormContext<RegistrarAuditoriaForm>();
  const form = useWatch({ control, name: fieldPrefix });
  const [savedRnc, setSavedRnc] = useState('');

  const isInvalid = useMemo(() => {
    if (form) {
      const { idRnc, numeroRnc, criadoEm, ...rest } = form;
      return Object.values(rest || {}).some(val => !val);
    }
    return true;
  }, [form]);

  const tooltip = useMemo(() => {
    if (!form?.id || isInvalid) return 'Para liberar preencha e salve os três campos ao lado';
    if (form.idRnc) return 'RNC já gerada';
    return '';
  }, [form, isInvalid]);

  async function generateHandler() {
    const {
      agendamento: { registro },
    } = getValues();
    console.log(getValues());
    const { numeroNC, numeroRelatorio } = registro;
    const auditoria = {
      ocorrenciaAuditoria: numeroNC,
      processoAuditoria: Number(numeroRelatorio),
      sequecialAuditoria: 1,
      normaAuditoria: '',
      requisitoAuditoria: '',
    };
    const payload = { auditoria, raizNaoConformidade, naoConformidade: naoConformidadeToRncMs(getValues(fieldPrefix)) };
    const { id } = await generateRnc(payload);
    await persistNcsOmsAuditoria([{ ...form, idRnc: id }]);
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
          <Controller
            control={control}
            name={`${fieldPrefix}.anexo`}
            render={({ field: { value, onChange, ...field } }) => {
              return <AttachmentButton {...{}} onChange={onChange} />;
            }}
          />
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Stack>
        <TextField disabled value={form?.idRnc || ''} label={`Número da ${isNC ? 'RNC' : 'ROM'}`} />
        {showGenerateNcButton && (
          <Tooltip title={tooltip}>
            <span>
              <Button color="secondary" variant="contained" size="large" disabled={isInvalid || !!form?.idRnc} onClick={generateHandler}>
                GERAR {isNC ? 'RNC' : 'ROM'}
              </Button>
            </span>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
};
