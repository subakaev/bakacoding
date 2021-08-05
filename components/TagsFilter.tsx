import { Box, Button } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import AutocompleteInput from "./form/AutoCompleteInput";

interface TagsFilterProps {
  tags: string[];
  onApply: (tags: string[]) => void;
}

interface FormValues {
  tags: string[];
}

const TagsFilter = ({ tags, onApply }: TagsFilterProps) => {
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: { tags: [] },
  });

  const onSubmit = (values: FormValues) => {
    onApply(values.tags);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" alignItems="center">
        <Box flexGrow={1}>
          <AutocompleteInput name="tags" control={control} options={tags} />
        </Box>
        <Box ml={3}>
          <Button type="submit" color="primary" variant="contained">
            Apply
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default TagsFilter;
