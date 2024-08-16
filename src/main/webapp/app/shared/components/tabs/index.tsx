import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';

export type TabPanelType = {
  children?: React.ReactNode;
  label: string;
};

export interface TabsCustomProps {
  tabsPanel: TabPanelType[];
  valueTab?: number;
  setValueTab?: React.Dispatch<React.SetStateAction<number>>;
  // disabled: boolean;
  handleChange?: (_event: React.SyntheticEvent, newValue: number) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};
export const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const TabsCustom = ({ tabsPanel, valueTab = 0, setValueTab, handleChange }: TabsCustomProps) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Tabs aria-label="tab container" value={valueTab} onChange={handleChange} variant="scrollable" scrollButtons="auto">
        {tabsPanel.map((item, index) => (
          // eslint-disable-next-line react/jsx-key
          <Tab key={index} aria-label={`tab${index}`} label={item.label} {...a11yProps(index)} />
        ))}
      </Tabs>
      <>
        {tabsPanel.map((item, index) => (
          <CustomTabPanel key={index} value={valueTab} index={index}>
            {item.children}
          </CustomTabPanel>
        ))}
      </>
    </Box>
  );
};

export default TabsCustom;
