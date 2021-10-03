/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: fix any
import { Box, Tab, Tabs } from "@mui/material";
import MarkdownText from "components/markdown/MarkdownText";
import React from "react";
import { Control, UseFormGetValues } from "react-hook-form";
import TextInput from "./TextInput";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  name: string;
}

const a11yProps = (index: number, name: string) => {
  return {
    id: `${name}-tab-${index}`,
    "aria-controls": `${name}-tabpanel-${index}`,
  };
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, name, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${name}-tabpanel-${index}`}
      aria-labelledby={`${name}-tab-${index}`}
      {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

interface TextInputProps {
  name: string;
  control: Control<any>;
  defaultValue?: string;
  disabled?: boolean;
  getValues: UseFormGetValues<any>;
  [key: string]: any;
}

const MarkdownInput = ({
  name,
  control,
  disabled,
  getValues,
  ...other
}: TextInputProps): JSX.Element => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange} aria-label="question tabs">
        <Tab label="Markdown" {...a11yProps(0, name)} />
        <Tab label="Preview" {...a11yProps(1, name)} />
      </Tabs>
      <TabPanel value={value} index={0} name={name}>
        <TextInput
          name={name}
          control={control}
          disabled={disabled}
          {...other}
        />
      </TabPanel>
      <TabPanel value={value} index={1} name={name}>
        <MarkdownText text={getValues(name)} />
      </TabPanel>
    </>
  );
};

export default MarkdownInput;
