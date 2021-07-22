import _ from "lodash";
import { IconButton, Button, TextField, Box, Divider } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import { useForm, useFieldArray, Controller, Control } from "react-hook-form";
import { v4 as uuid } from "uuid";
import store from "store2";
import { InterviewQuestionSet } from "../../types/interview";

interface FormValues {
  questionSets: InterviewQuestionSet[];
}

interface InterviewQuestionSetFormProps {
  questionSetIndex: number;
  control: Control<FormValues>;
}

const InterviewQuestionSetForm = ({
  questionSetIndex,
  control,
}: InterviewQuestionSetFormProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questionSets.${questionSetIndex}.questions`,
  });

  return (
    <Box p={2}>
      <Button
        onClick={() => append({ id: uuid(), question: "" })}
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        size="small"
      >
        Add question
      </Button>

      {fields.map((item, index) => {
        return (
          <Box key={item.id} display="flex" alignItems="center" px={2} my={1}>
            <Box flexGrow={1}>
              <Controller
                name={`questionSets.${questionSetIndex}.questions.${index}.question`}
                control={control}
                defaultValue={item.question}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    size="small"
                    label="question"
                    fullWidth
                  />
                )}
              />
            </Box>
            <Box ml={2}>
              <IconButton
                aria-label="delete"
                color="secondary"
                onClick={() => remove(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

const InterviewQuestionSetsForm = () => {
  const interviewStore = store.namespace("inteview");

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { questionSets: interviewStore.get("questionSets", []) },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questionSets",
  });

  const onSubmit = (data: FormValues) => {
    interviewStore.set("questionSets", data.questionSets, true);
  };

  // TODO: test useCallback here
  const addCategoryHander = () => {
    append({ id: uuid(), name: "", questions: [] });
  };
  const createRemoveCategoryHandler = (index: number) => () => {
    if (confirm("Are you sure?")) {
      remove(index);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={addCategoryHander}
          >
            Add category
          </Button>
        </Box>
        <Divider />

        {fields.map((item, index) => (
          <Box mt={2} mb={5}>
            <Box display="flex" alignItems="center">
              <Controller
                name={`questionSets.${index}.name`}
                control={control}
                defaultValue={item.name}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="Category name"
                    size="small"
                  />
                )}
              />
              <Box ml={3}>
                <Button
                  onClick={createRemoveCategoryHandler(index)}
                  color="secondary"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                >
                  Remove category
                </Button>
              </Box>
            </Box>
            <InterviewQuestionSetForm
              questionSetIndex={index}
              control={control}
            />
            <Divider />
          </Box>
        ))}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
      </form>
    </>
  );
};

export default InterviewQuestionSetsForm;
