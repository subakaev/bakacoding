import { Box, Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import AutocompleteInput from "./form/AutoCompleteInput";

interface TagsFilterProps {
  tags: string[];
  onApply: (tags: string[]) => void;
  disabled?: boolean;
}

interface FormValues {
  tags: string[];
}

const TagsFilter = ({
  tags,
  onApply,
  disabled = false,
}: TagsFilterProps): JSX.Element => {
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: { tags: [] },
  });

  const onSubmit = (values: FormValues) => {
    onApply(values.tags);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
        }}>
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <AutocompleteInput
            name="tags"
            control={control}
            options={tags}
            disabled={disabled}
          />
        </Box>
        <Box sx={{ marginLeft: (theme) => ({ sm: theme.spacing(3) }) }}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={disabled}>
            Apply
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default TagsFilter;
