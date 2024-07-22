import { Stack } from '@mui/material';
import React from 'react';
import Analysis from './analysis';
import ControlAction from './control-action';
import GeneralInformation from './general-information';

type BaseDetailsProps = {
  isOpportunity?: boolean;
  readonly?: boolean;
};

const BaseDetails = ({ isOpportunity, readonly }: BaseDetailsProps) => {
  return (
    <Stack spacing={2}>
      <GeneralInformation isOpportunity={isOpportunity} readonly={readonly} />

      {!isOpportunity && <ControlAction />}

      <Analysis />
    </Stack>
  );
};

export default BaseDetails;
