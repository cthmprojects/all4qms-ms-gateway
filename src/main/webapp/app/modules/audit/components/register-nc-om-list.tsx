import { Box, Fab, Stack, CardHeader, Card, CardContent } from '@mui/material';
import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';

import { RegisterNcOmItem } from './register-nc-om-item';
import { OnlyRequired } from 'app/shared/model/util';
import { Rnc } from 'app/modules/rnc/models';
import { NcOmAuditoria, RegistroAuditoria } from '../audit-models';
import { deleteNcOmAuditoria } from '../audit-service';

type RegisterAuditNcOmListProps = {
  audit: RegistroAuditoria;
  type: 'NC' | 'OM';
  previousList: any[];
  raizNcParcial: OnlyRequired<Omit<Rnc, 'tipoNC'>>;
  afterItemDeleted?: () => void;
};

export const RegisterAuditNcOmList = ({ type, raizNcParcial, audit, previousList, afterItemDeleted }: RegisterAuditNcOmListProps) => {
  const isNC = type == 'NC';
  const fieldName = isNC ? 'ncList' : 'omList';

  const { control, setValue } = useFormContext();
  const { fields, prepend, remove } = useFieldArray({ control, name: fieldName, keyName: 'key' });

  const add = () => {
    prepend({ descricao: '', requisito: '', evidencia: '', tipoDescricao: type });
  };

  useEffect(() => {
    let localList = previousList?.map(item => {
      const { registroAgendamento, ...rest } = item;
      return { ...rest, idRegistroAgendamento: registroAgendamento.id };
    });

    setValue(fieldName, localList);

    if (!localList.length) add();
  }, [previousList]);

  async function onDeleteClick(descricaoNcOm: NcOmAuditoria, index: number) {
    try {
      if (!descricaoNcOm.id) {
        remove(index);
      } else {
        await deleteNcOmAuditoria(descricaoNcOm);
        afterItemDeleted();
      }
    } catch (error) {}
  }

  return (
    <Box>
      <Box display="flex" justifyContent="end" position="relative">
        <Fab sx={{ position: 'absolute', top: '155px', marginRight: '25px' }} onClick={add}>
          <AddIcon />
        </Fab>
      </Box>
      <Stack className="container-style" marginRight="110px" gap="24px">
        <CardHeader title={`${isNC ? 'Não Conformidade' : 'Oportunidade de Melhoria'} `} />
        {fields.map((field, index) => (
          <Card key={field.key}>
            <CardContent>
              <RegisterNcOmItem
                isNC={isNC}
                fieldPrefix={`${fieldName}.${index}`}
                raizNaoConformidade={{ ...raizNcParcial, tipoNC: type }}
                showGenerateNcButton={!!audit?.id}
                onDeleteClick={() => onDeleteClick(field as unknown as NcOmAuditoria, index)}
              />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
