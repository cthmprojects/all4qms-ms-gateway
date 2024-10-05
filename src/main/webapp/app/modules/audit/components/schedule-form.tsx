import { Autocomplete, Chip, MenuItem, Stack, TextField } from '@mui/material';
import { MaterialDatepicker } from 'app/shared/components/input/material-datepicker';
import { MaterialSelect } from 'app/shared/components/select/material-select';
import { formField } from 'app/shared/util/form-utils';
import { Controller, UseFormReturn, useWatch } from 'react-hook-form';
import { AgendamentoAuditoria, PlanejamentoAuditoria } from '../audit-models';
import { isEqual, renderValueAuditor, renderValuePlanejamento } from '../audit-helper';
import { Process } from 'app/modules/infodoc/models';
import { defaultRule } from 'app/shared/model/constants';
import { IUsuario } from 'app/shared/model/usuario.model';

type ScheduleFormProps = {
  formObject: UseFormReturn<AgendamentoAuditoria>;
  processes: Process[];
  planning: PlanejamentoAuditoria;
  disabled?: boolean;
  users: IUsuario[];
};

export const ScheduleForm = ({ formObject, processes, planning, disabled, users }: ScheduleFormProps) => {
  const { control } = formObject;
  const selectedAuditors = useWatch({ control, name: 'auditores' });

  return (
    <Stack gap="24px">
      <Stack flexDirection="row" gap="1.5rem" flexWrap={{ xs: 'wrap', md: 'initial' }}>
        <Controller
          name="planejamento"
          control={control}
          render={renderPayload => (
            <MaterialSelect
              variant="outlined"
              label="Planejamento"
              {...formField(renderPayload)}
              renderValue={renderValuePlanejamento}
              disabled
              sx={{ minWidth: '215px', flexGrow: '1' }}
            >
              {
                // @ts-ignore - necessary to load object into value
                <MenuItem value={planning}>{planning?.metodo}</MenuItem>
              }
            </MaterialSelect>
          )}
        />

        <Controller
          name="idProcesso"
          control={control}
          rules={defaultRule}
          render={renderPayload => (
            <MaterialSelect
              variant="outlined"
              label="Processo"
              {...formField(renderPayload)}
              sx={{ minWidth: '215px', flexGrow: '1' }}
              disabled={disabled}
              fullWidth
            >
              {processes?.map(item => (
                // @ts-ignore - necessary to load object into value
                <MenuItem key={item.id} value={item.id}>
                  {item.descricao}
                </MenuItem>
              ))}
            </MaterialSelect>
          )}
        />

        <Controller
          name="dataAuditoria"
          control={control}
          rules={defaultRule}
          render={renderPayload => (
            <MaterialDatepicker
              selected={renderPayload.field.value}
              dateFormat="dd/MM/yyyy"
              label="Data da Auditoria"
              disabled={disabled}
              {...formField(renderPayload)}
              sx={{ minWidth: '185px', flexGrow: '.4' }}
            />
          )}
        />

        <Controller
          name="horaInicial"
          control={control}
          rules={defaultRule}
          render={renderPayload => (
            <MaterialDatepicker
              selected={renderPayload.field.value}
              showTimeSelect
              showTimeSelectOnly
              dateFormat="hh:mm"
              label="Hora início"
              disabled={disabled}
              {...formField(renderPayload)}
              sx={{ minWidth: '140px' }}
            />
          )}
        />

        <Controller
          name="horaFinal"
          control={control}
          rules={defaultRule}
          render={renderPayload => (
            <MaterialDatepicker
              selected={renderPayload.field.value}
              showTimeSelect
              showTimeSelectOnly
              dateFormat="hh:mm"
              label="Hora término"
              disabled={disabled}
              {...formField(renderPayload)}
              sx={{ minWidth: '140px' }}
            />
          )}
        />

        <Controller
          name="responsavelAuditoria"
          control={control}
          rules={defaultRule}
          render={renderPayload => (
            <MaterialSelect
              variant="outlined"
              label="Responsável"
              {...formField(renderPayload)}
              sx={{ minWidth: '215px', flexGrow: '1' }}
              disabled={disabled}
              fullWidth
            >
              {users?.map(item => (
                // @ts-ignore - necessary to load object into value
                <MenuItem key={item.id} value={item.id}>
                  {item.nome}
                </MenuItem>
              ))}
            </MaterialSelect>
          )}
        />
      </Stack>
      <Controller
        name="auditores"
        control={control}
        rules={{
          validate: value => (value && value.length > 0) || 'Selecione pelo menos um auditor',
        }}
        render={({ field, fieldState }) => (
          <Autocomplete
            disabled={disabled}
            multiple
            filterOptions={(options, state) =>
              options.filter(option => option.nomeAuditor.toLowerCase().includes(state.inputValue.toLowerCase()))
            } // Evita o filtro padrão
            getOptionLabel={renderValueAuditor}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  label={option.nomeAuditor} // Customiza o conteúdo da tag (Chip)
                />
              ))
            }
            options={planning.auditores || []}
            filterSelectedOptions
            onChange={(_, val) => field.onChange(val)}
            onBlur={field.onBlur}
            value={field.value}
            isOptionEqualToValue={isEqual}
            renderInput={params => (
              <TextField
                {...params}
                label="Auditores"
                placeholder="Digite o nome do auditor"
                error={!!fieldState?.error?.message}
                helperText={fieldState?.error?.message}
              />
            )}
          />
        )}
      />
    </Stack>
  );
};
