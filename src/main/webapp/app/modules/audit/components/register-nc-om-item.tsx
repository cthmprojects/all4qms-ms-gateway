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
import axios from 'axios';

type RegisterNcOmItemProps = {
  isNC: boolean;
  fieldPrefix: `${'ncList' | 'omList'}.${number}`;
  raizNaoConformidade: OnlyRequired<Rnc>;
  showGenerateNcButton?: boolean;
  onDeleteClick: () => void;
};

const defaultRules = { required: 'Campo obrigatório' };

export const RegisterNcOmItem = ({
  isNC,
  fieldPrefix,
  raizNaoConformidade,
  showGenerateNcButton,
  onDeleteClick,
}: RegisterNcOmItemProps) => {
  const { control, getValues } = useFormContext<RegistrarAuditoriaForm>();
  const form = useWatch({ control, name: fieldPrefix });
  const [savedRnc, setSavedRnc] = useState('');

  const isInvalid = useMemo(() => {
    if (form) {
      const { requisito, tipoDescricao, evidencia, descricao, id } = form;
      return Object.values({ requisito, tipoDescricao, evidencia, descricao, id }).some(val => !val);
    }
    return true;
  }, [form]);

  const tooltip = useMemo(() => {
    if (!form?.id || isInvalid) return 'Para liberar preencha e salve os três campos ao lado';
    if (form.idRnc || !!savedRnc) return 'RNC já gerada';
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
    setSavedRnc(`${id}`);
    await persistNcsOmsAuditoria([{ ...form, idRnc: id }]);
  }

  async function download() {
    try {
      const response = await axios.get(`/services/all4qmsmsauditplan/api/auditoria/registros/descncoms/anexo/${form.id}`, {
        responseType: 'blob', // Define o tipo de resposta como blob
      });

      // Obtém o cabeçalho Content-Disposition
      const contentDisposition = response.headers['content-disposition'];

      // Extrai o nome do arquivo do cabeçalho
      let fileName = 'downloaded_file'; // Nome padrão caso a extração falhe
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename\*?="?([^;"]+)[";]/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = decodeURIComponent(fileNameMatch[1].replace(/['"]/g, '')); // Decodifica caracteres especiais
        }
      }

      // Cria um objeto URL para o blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Cria um elemento de link
      const link = document.createElement('a');
      link.href = url;

      // Define o nome do arquivo que será baixado
      link.download = fileName;

      // Simula um clique no link para iniciar o download
      document.body.appendChild(link);
      link.click();

      // Remove o link do DOM
      document.body.removeChild(link);

      // Libera o objeto URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao fazer o download do arquivo:', error);
    }
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
              return <AttachmentButton download={form?.hasAnexo ? download : null} onChange={onChange} />;
            }}
          />
          <IconButton onClick={onDeleteClick}>
            <DeleteIcon />
          </IconButton>
        </Stack>
        <TextField disabled value={form?.idRnc || savedRnc} label={`Número da ${isNC ? 'RNC' : 'ROM'}`} />
        {showGenerateNcButton && (
          <Tooltip title={tooltip}>
            <span>
              <Button
                color="secondary"
                variant="contained"
                size="large"
                disabled={isInvalid || !!form?.idRnc || !!savedRnc}
                onClick={generateHandler}
              >
                GERAR {isNC ? 'RNC' : 'ROM'}
              </Button>
            </span>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
};
