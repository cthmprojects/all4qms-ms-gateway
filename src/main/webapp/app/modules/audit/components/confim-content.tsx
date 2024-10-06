import { Box, Card, CardContent, CircularProgress, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Button } from 'reactstrap';
import { AgendamentoAuditoria } from '../audit-models';

type ConfirmContent = {
  isPending: boolean;
  save: (payload: Partial<AgendamentoAuditoria>) => void;
  onClose: () => void;
};

export const ConfirmContent = ({ isPending, onClose, save }: ConfirmContent) => {
  return (
    <Box>
      <Box display="flex" justifyContent="center" position="relative">
        <Typography fontSize="24px" fontWeight="500" marginX="auto" lineHeight="46px">
          Validar
        </Typography>
        <IconButton sx={{ position: 'absolute', right: 0 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Card>
        <CardContent>
          <h6>Confirmar agendamento executado</h6>
          <Box display="flex" justifyContent="flex-end" padding={{ xs: '0px', md: '0px 44px' }} marginTop="16px">
            <Button variant="contained" onClick={() => save({ isFinalizado: true })} color="primary">
              {isPending ? <CircularProgress size="20px" /> : 'Confirmar'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
