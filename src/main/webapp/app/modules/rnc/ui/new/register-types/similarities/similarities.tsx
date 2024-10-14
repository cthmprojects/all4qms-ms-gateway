import { VisibilityOutlined } from '@mui/icons-material';
import {
  Button,
  Card,
  Checkbox,
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
import { useAppDispatch } from 'app/config/store';
import { ExtendedNc, Rnc, RncData } from 'app/modules/rnc/models';
import { getSimilarities } from 'app/modules/rnc/reducers/similarities.reducer';
import { useEffect, useMemo, useState } from 'react';

type SimilaritiesProps = {
  description: string;
  onChanged: (id: number) => void;
  rncs: Array<ExtendedNc | Rnc>;
  similarId: number | null;
};

export const Similarities = ({ description, onChanged, rncs, similarId }: SimilaritiesProps) => {
  const dispatch = useAppDispatch();

  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [similarRncIds, setSimilarRncIds] = useState<Array<number>>([]);

  const similarRncs = useMemo<Array<ExtendedNc>>(() => {
    if (!rncs || rncs.length <= 0 || !similarRncIds || similarRncIds.length <= 0) {
      return [];
    }

    const extendedRncs: Array<ExtendedNc> = rncs as Array<ExtendedNc>;

    const set: Set<number> = new Set<number>(similarRncIds);

    return extendedRncs.filter(r => set.has(r.nc.id));
  }, [similarRncIds, rncs]);

  const onLoadSimilaritiesClicked = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setLoading(true);

    getSimilarities(description)
      .then(res => {
        setSimilarRncIds(res);
        setLoading(false);
        setLoaded(true);
      })
      .catch(() => {
        setSimilarRncIds([]);
        setLoading(false);
        setLoaded(true);
      });
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
        {similarRncs.length > 0 && (
          <>
            <Typography>Este problema tem similaridade com as seguintes decisões anteriores, deseja proceder da mesma forma?</Typography>

            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table sx={{ width: '100%' }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Vincular</TableCell>
                    <TableCell align="left">%</TableCell>
                    <TableCell align="left">Decisão</TableCell>
                    <TableCell align="left">Visualizar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {similarRncs.map(rnc => {
                    const data: RncData = rnc.dados;
                    const nc: Rnc = rnc.nc;

                    return (
                      <TableRow key={nc.id}>
                        <TableCell>
                          <Checkbox checked={similarId === nc.id} onChange={_ => onChanged(nc.id)} />
                        </TableCell>
                        <TableCell>{'-'}</TableCell>
                        <TableCell>{data.descricao}</TableCell>
                        <TableCell>
                          <Tooltip title="Visualizar">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                window.open(`./rnc/view/${nc.id}`, '_blank');
                              }}
                            >
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
        )}

        {similarRncIds.length <= 0 && <Typography>Não foi possível encontrar similaridades para o problema atual.</Typography>}
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
          <h3 className="m-3">Similaridades</h3>

          {!loaded && !loading && renderInitial()}

          {loading && renderLoading()}

          {loaded && !loading && renderLoaded()}
        </Stack>
      </Card>
    </>
  );
};

export default Similarities;
