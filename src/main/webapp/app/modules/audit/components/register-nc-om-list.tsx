import { Box, Fab, Stack, CardHeader, Card, CardContent } from '@mui/material';
import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';

import { RegisterNcOmItem } from './register-nc-om-item';
import { OnlyRequired } from 'app/shared/model/util';
import { Rnc } from 'app/modules/rnc/models';

type RegisterAuditNcOmListProps = {
  audit: any;
  type: 'NC' | 'OM';
  previousList: any[];
  raizNcParcial: OnlyRequired<Omit<Rnc, 'tipoNC'>>;
};

export const RegisterAuditNcOmList = ({ type, raizNcParcial }: RegisterAuditNcOmListProps) => {
  const isNC = type == 'NC';
  const fieldName = isNC ? 'ncList' : 'omList';

  const { control } = useFormContext();
  const { fields, prepend } = useFieldArray({ control, name: fieldName });

  const add = () => {
    prepend({});
  };
  useEffect(() => {
    if (!fields.length) add();
  }, []);
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
              />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
