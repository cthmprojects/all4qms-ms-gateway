import { Dialog, SxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
interface Props {
  color?: string;
  width?: string;
  heigth?: string;
}

export const StyledDialog = styled(Dialog)(({ color, width, heigth }: Props) => ({
  '& .MuiDialog-paper': {
    width: width,
    heigth: heigth,
    overflow: 'hidden',
  },

  '& .MuiPaper-root': {
    borderRadius: '9px',
  },
  '& .MuiDialogTitle-root': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: color ? color : '#2F4A7D',
  },
  '& .MuiDialogContent-root': {
    padding: 2,
  },
  '& .MuiDialogActions-root': {
    padding: 2,
  },
}));

export const IconButtonStyles: SxProps = {
  padding: 0,
  '& :hover': {
    background: '#F1F2F5',
    borderRadius: '50%',
  },
  // '& svg': {
  //   color: colorIcon ? '#fff' : '#919097',
  // },
};
