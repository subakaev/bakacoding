/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: fix any types
import { Control, Controller } from "react-hook-form";
import { TextField } from "@mui/material";

interface TextInputProps {
  name: string;
  control: Control<any>;
  defaultValue?: string;
  [key: string]: any;
}

const TextInput = ({
  name,
  control,
  defaultValue = "",
  ...other
}: TextInputProps): JSX.Element => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, formState: { errors } }) => (
        <TextField
          {...field}
          variant="filled"
          size="small"
          {...other}
          error={!!errors[name]}
          helperText={errors[name]?.message ?? " "}
        />
      )}
    />
  );
};

export default TextInput;
