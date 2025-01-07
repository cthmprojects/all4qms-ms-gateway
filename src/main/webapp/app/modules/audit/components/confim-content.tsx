import { Box, Card, CardActions, CardContent, CircularProgress, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Button, CardHeader } from 'reactstrap';
import { AgendamentoAuditoria } from '../audit-models';

type ConfirmContent = {
  isPending: boolean;
  save: (payload: Partial<AgendamentoAuditoria>) => void;
  onClose: () => void;
};

export const ConfirmContent = ({ isPending, onClose, save }: ConfirmContent) => {
  return (
    <Box>
      <Card>
        <CardHeader>
          <Box display="flex" justifyContent="center" position="relative">
            <Typography fontSize="24px" fontWeight="500" marginX="auto" lineHeight="46px">
              Validação
            </Typography>
            <IconButton sx={{ position: 'absolute', right: 0 }} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </CardHeader>
        <CardContent>
          <Typography>Confirma que este agendamento foi executado ?</Typography>
        </CardContent>
        <CardActions>
          <Box display="flex" justifyContent="flex-end" width="100%" padding={{ xs: '0px' }} marginTop="16px">
            <Button variant="contained" onClick={() => save({ isFinalizado: true })} color="primary">
              {isPending ? <CircularProgress size="20px" /> : 'Confirmar'}
            </Button>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
};
