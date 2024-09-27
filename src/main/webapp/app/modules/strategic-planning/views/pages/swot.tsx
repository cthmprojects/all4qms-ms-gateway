import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Button, Grid, Stack, Switch, TextField } from '@mui/material';
import { AddOutlined, DeleteOutlined } from '@mui/icons-material';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

type SwotEixoProps = {
  onAdded?: () => void;
  onChanged?: (newValue: string) => void;
  onRemoved?: () => void;
  valueEdit?: string;
  listSwotEixo?: { desc: string; isRO: boolean }[];
  setListSwotEixo?: React.Dispatch<React.SetStateAction<{ desc: string; isRO: boolean }[]>>;
};
const SwotEixo = ({ onAdded, onChanged, onRemoved, valueEdit, listSwotEixo, setListSwotEixo }: SwotEixoProps) => {
  const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{}}>
      <CardHeader
        action={
          <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
            <ExpandMoreIcon />
          </ExpandMore>
        }
        onClick={handleExpandClick}
        title="Strengths / Pontos Fortes"
        titleTypographyProps={{ fontSize: '16px', fontWeight: 700 }}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Stack direction="column" spacing={2}>
            {listSwotEixo &&
              listSwotEixo?.length > 0 &&
              listSwotEixo?.map((swotEixo, index) => (
                <Stack key={index} direction="row" spacing={2}>
                  <TextField
                    // disabled={readonly}
                    fullWidth
                    label={'Strenghts / Forças'}
                    // onChange={(e) => onChanged(e.target.value)}
                    placeholder={'Descreva aqui as forças'}
                    multiline
                    minRows={2}
                    value={valueEdit}
                    variant="outlined"
                    sx={{ flexGrow: 1 }}
                  />
                  <Stack direction="column">
                    <Typography fontSize={11} textAlign={'center'}>
                      Analisar
                    </Typography>
                    <Switch defaultChecked />
                  </Stack>
                  <IconButton onClick={onRemoved} style={{ height: '50px', width: '50px' }}>
                    <DeleteOutlined htmlColor="#A23900" style={{ height: '30px', width: '30px' }} />
                  </IconButton>
                </Stack>
              ))}
            <Stack direction="row" spacing={2}>
              <TextField
                // disabled={readonly}
                fullWidth
                label={'Strenghts / Forças'}
                // onChange={(e) => onChanged(e.target.value)}
                placeholder={'Descreva aqui as forças'}
                multiline
                minRows={2}
                value={valueEdit}
                variant="outlined"
                sx={{ flexGrow: 1 }}
              />
              <Stack direction="column">
                <Typography fontSize={11} textAlign={'center'}>
                  Analisar
                </Typography>
                <Switch defaultChecked />
              </Stack>
              <Box sx={{ boxShadow: 3, borderRadius: '50%', height: '50px', width: '50px', bgcolor: '#E0E0E0' }}>
                <IconButton disabled={'0'.length <= 0} onClick={onAdded} style={{ height: '50px', width: '50px' }}>
                  <AddOutlined />
                </IconButton>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
};
export default SwotEixo;
