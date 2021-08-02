import { Controller, Control } from "react-hook-form";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { capitalize } from "lodash";

interface AutocompleteInputProps {
  name: string;
  // TODO:
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  options: string[];
  label?: string;
}

const AutocompleteInput = ({
  name,
  control,
  options,
  label,
}: AutocompleteInputProps): JSX.Element => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState: { errors } }) => (
        <Autocomplete
          multiple
          freeSolo
          options={options}
          value={field.value}
          onChange={(_, v) => field.onChange(v)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={label ?? capitalize(name)}
              error={!!errors[name]}
              helperText={errors[name]?.message ?? " "}
            />
          )}
        />
      )}
    />
  );
};

export default AutocompleteInput;
