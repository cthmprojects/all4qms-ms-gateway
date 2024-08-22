import React from 'react';
import { FC, ReactNode } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle as MUIDialogTitle, IconButton, SxProps, useTheme } from '@mui/material';

import { IconButtonStyles } from './styles';

interface Props {
  onClose: () => void;
  children: ReactNode;
  style?: SxProps;
  close?: boolean;
  colorIcon?: string;
}

export const DialogTitle: FC<Props> = ({ close, style, children, onClose, ...rest }) => {
  const theme = useTheme();

  return (
    <MUIDialogTitle sx={style} {...rest}>
      {children}
      {close ? (
        <IconButton aria-label="close" onClick={onClose} sx={IconButtonStyles}>
          <CloseIcon sx={{ fontSize: 28, color: theme.palette.primary[200] }} />
        </IconButton>
      ) : null}
    </MUIDialogTitle>
  );
};
