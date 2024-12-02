import { Box, Fab, Stack, CardHeader, Card, CardContent } from '@mui/material';
import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';

import { RegisterNcOmItem } from './register-nc-om-item';
import { OnlyRequired } from 'app/shared/model/util';
import { Rnc } from 'app/modules/rnc/models';
import { RegistroAuditoria } from '../audit-models';

type RegisterAuditNcOmListProps = {
  audit: RegistroAuditoria;
  type: 'NC' | 'OM';
  previousList: any[];
  raizNcParcial: OnlyRequired<Omit<Rnc, 'tipoNC'>>;
};

export const RegisterAuditNcOmList = ({ type, raizNcParcial, audit, previousList }: RegisterAuditNcOmListProps) => {
  const isNC = type == 'NC';
  const fieldName = isNC ? 'ncList' : 'omList';

  const { control } = useFormContext();
  const { fields, prepend, append } = useFieldArray({ control, name: fieldName });

  const add = () => {
    prepend({ descricao: '', requisito: '', evidencia: '', tipoDescricao: type });
  };
  useEffect(() => {
    setTimeout(() => {
      if (!fields.length) add();
    }, 300);
  }, []);

  useEffect(() => {
    previousList.forEach(item => {
      const { registroAgendamento, ...rest } = item;
      append({ ...rest, idRegistroAgendamento: registroAgendamento.id });
    });
  }, [previousList]);
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
          <Card key={field.id}>
            <CardContent>
              <RegisterNcOmItem
                isNC={isNC}
                fieldPrefix={`${fieldName}.${index}`}
                raizNaoConformidade={{ ...raizNcParcial, tipoNC: type }}
                showGenerateNcButton={!!audit?.id}
              />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
