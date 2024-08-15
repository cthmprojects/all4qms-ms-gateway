import { FC } from 'react';

import { Box, Button, DialogContent, Grid, IconButton, Typography } from '@mui/material';
import { DialogProps } from '@mui/material/Dialog/Dialog';
import { Breakpoint } from '@mui/system';

// import { ReactComponent as CloseModalInviterUser } from '@assets/CloseModalInviterUser.svg';

import { DialogTitle } from './DialogTitle';
import { StyledDialog } from './styles';
import React from 'react';

interface Props {
  title?: string;
  maxWidth?: string;
  open: boolean;
  handleClose?: () => void;
  color?: string;
  backgroundColor?: string;
  close?: boolean;
  disableLine?: boolean;
  colorIcon?: string;
  width?: string;
  overflow?: string;
}

export const Modal: FC<Props & DialogProps> = ({
  width,
  colorIcon,
  color,
  backgroundColor,
  children,
  title,
  maxWidth = 'md',
  handleClose,
  open,
  close = false,
  disableLine = false,
  overflow = 'auto',
  ...rest
}) => {
  return (
    <StyledDialog open={open} color={color} maxWidth={maxWidth} onClose={handleClose} aria-labelledby="customized-dialog" {...rest}>
      {title && (
        <DialogTitle onClose={handleClose} style={{ backgroundColor, p: 1 }} close={close}>
          {disableLine ? (
            `${title}`
          ) : (
            <Grid item xs={12} p={1}>
              <Typography
                color="#585858"
                align="left"
                sx={{
                  fontSize: '22px',
                  fontWeight: 'bold',
                }}
              >
                {title}
              </Typography>
              <Grid item>
                <Box sx={{ height: '5px', width: '100%', background: '#FFB243' }} />
              </Grid>
            </Grid>
          )}
        </DialogTitle>
      )}
      <DialogContent style={{ overflow: overflow }}>
        <Box>
          <IconButton
            sx={{
              // backgroundColor: 'transparent',
              position: 'absolute',
              right: 1,
              top: 1,
              zIndex: 999,
              // width: '2px',
            }}
            onClick={() => handleClose()}
          >
            {/* <CloseModalInviterUser width={20} /> */}
          </IconButton>
        </Box>
        {children}
      </DialogContent>
    </StyledDialog>
  );
};
