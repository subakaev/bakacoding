import { useState, useEffect } from "react";
import { getLayout } from "components/layouts/Layout";
import { InferGetServerSidePropsType } from "next";
import _ from "lodash";
import { getEntries } from "lib/contentful";
import {
  IconButton,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { v4 as uuid } from "uuid";
import store from "store2";

interface FormValues {
  questions: { id: string; question: string }[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
}

export interface InterviewQuestionSet {
  id: string;
  name: string;
  questions: InterviewQuestion[];
}

interface InterviewQuestionSetProps {
  questionSet: InterviewQuestionSet;
  onChange: (questionSetId: string, questions: InterviewQuestion[]) => void;
}

const InterviewQuestionSet = ({
  questionSet,
  onChange,
}: InterviewQuestionSetProps) => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      questions: questionSet.questions,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = (data: FormValues) => {
    onChange(questionSet.id, data.questions);
  };

  return (
    <Box>
      <Typography variant="h1">{questionSet.name}</Typography>
      <Button onClick={() => append({ id: uuid(), question: "" })}>Add</Button>

      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((item, index) => {
          return (
            <Box key={item.id} display="flex" alignItems="center" px={2} my={1}>
              <Box flexGrow={1}>
                <Controller
                  name={`questions.${index}.question`}
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
        <Button type="submit">Submit</Button>
      </form>
    </Box>
  );
};

const NewCategoryForm = ({
  addQuestionSet: addCategory,
}: {
  addQuestionSet: (name: string) => void;
}) => {
  const { control, register, handleSubmit } = useForm<{ name: string }>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    addCategory(data.name);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" alignItems="center">
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              size="small"
              label="Name"
            />
          )}
        />
        <Button type="submit">Add</Button>
      </Box>
    </form>
  );
};

const BfeCoding = () => {
  const interviewStore = store.namespace("inteview");

  const [questionSets, setQuestionsSets] = useState<InterviewQuestionSet[]>(
    interviewStore.get("questionSets", [])
  );

  useEffect(() => {
    interviewStore.set("questionSets", questionSets, true);
  }, [questionSets]);

  const addQuestionSet = (name: string) => {
    setQuestionsSets([...questionSets, { id: uuid(), name, questions: [] }]);
  };

  const updateQuestions = (
    questionSetId: string,
    questions: InterviewQuestion[]
  ) => {
    const updatedItems = questionSets.map((questionSet) => {
      if (questionSet.id === questionSetId) {
        return { ...questionSet, questions };
      }

      return questionSet;
    });

    setQuestionsSets(updatedItems);
  };

  return (
    <Paper>
      <NewCategoryForm addQuestionSet={addQuestionSet} />

      {questionSets.map((questionSet) => (
        <InterviewQuestionSet
          key={questionSet.id}
          questionSet={questionSet}
          onChange={updateQuestions}
        />
      ))}
    </Paper>
  );
};

BfeCoding.getLayout = getLayout;

export default BfeCoding;
