import { getLayout } from "components/layouts/Layout";
import _ from "lodash";
import { Paper, Box, Button, TextField } from "@material-ui/core";
import Link from "next/link";
import { Autocomplete } from "@material-ui/lab";
import { useForm, Controller, Control } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface MemoryCard {
  question: string;
  answer: string;
  link: string;
  tags: string[];
}

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
}: TextInputProps) => {
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

const schema = yup.object().shape({
  question: yup.string().required(),
  answer: yup.string().required(),
  link: yup.string(),
  tags: yup.array(yup.string()).required(),
});

const InterviewPage = () => {
  const { handleSubmit, control, formState } = useForm<MemoryCard>({
    defaultValues: { tags: [] },
    resolver: yupResolver(schema),
  });

  console.log(formState.errors);

  const onSubmit = (data: MemoryCard) => {
    console.log(data);
    setTags(Array.from(new Set([...tags, ...data.tags])));
  };

  const [tags, setTags] = useState(["one", "two", "three"]);

  return (
    <Paper>
      <Box p={5}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            name="question"
            control={control}
            label="Question"
            rows={5}
            multiline
            fullWidth
          />
          <TextInput
            name="answer"
            control={control}
            label="Answer"
            rows={5}
            multiline
            fullWidth
          />
          <TextInput name="link" control={control} label="Link" fullWidth />
          <Controller
            name="tags"
            defaultValue={[]}
            control={control}
            render={({ field }) => (
              <Autocomplete
                multiple
                freeSolo
                options={tags}
                value={field.value}
                onChange={(_, v) => field.onChange(v)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Multiple values"
                    placeholder="Favorites"
                  />
                )}
              />
            )}
          />
          <Button variant="contained" color="primary" type="submit">
            Add
          </Button>
        </form>
      </Box>
    </Paper>
  );
};

InterviewPage.getLayout = getLayout;

export default InterviewPage;
