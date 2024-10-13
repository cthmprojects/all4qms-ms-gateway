import { VisibilityOutlined } from '@mui/icons-material';
import {
  Button,
  Card,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { ExtendedNc, Rnc } from 'app/modules/rnc/models';
import { useState } from 'react';

type SimilaritiesProps = {
  rncs: Array<ExtendedNc | Rnc>;
};

export const Similarities = ({ rncs }: SimilaritiesProps) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onLoadSimilaritiesClicked = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setLoaded(true);
    }, 2500);
  };

  const renderInitial = () => {
    return (
      <>
        <Button onClick={onLoadSimilaritiesClicked}>Carregar similaridade</Button>
      </>
    );
  };

  const renderLoaded = () => {
    return (
      <>
        <Typography>Este problema tem similaridade com as seguintes decisões anteriores, deseja proceder da mesma forma?</Typography>

        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell align="left">Aprova</TableCell>
                <TableCell align="left">%</TableCell>
                <TableCell align="left">Decisão</TableCell>
                <TableCell align="left">Visualizar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rncs as Array<ExtendedNc>)?.map(rnc => {
                const nc: Rnc = rnc.nc;

                return (
                  <TableRow key={nc.id}>
                    <TableCell>{'-'}</TableCell>
                    <TableCell>{'-'}</TableCell>
                    <TableCell>{'-'}</TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton color="primary" onClick={() => {}}>
                          <VisibilityOutlined sx={{ color: '#e6b200' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  const renderLoading = () => {
    return (
      <>
        <LinearProgress />
      </>
    );
  };

  return (
    <>
      <Card className="pt-3 pb-3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack spacing={2} sx={{ display: 'flex', flexGrow: 1 }}>
          {!loaded && !loading && renderInitial()}

          {loading && renderLoading()}

          {loaded && !loading && renderLoaded()}
        </Stack>
      </Card>
    </>
  );
};

export default Similarities;
