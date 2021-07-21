import { useState, useEffect } from "react";
import { getLayout } from "components/layouts/Layout";
import { InferGetServerSidePropsType } from "next";
import _, { set } from "lodash";
import { getEntries } from "lib/contentful";
import {
  IconButton,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  makeStyles,
  fade,
} from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import WarningIcon from "@material-ui/icons/Warning";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { v4 as uuid } from "uuid";
import store from "store2";
import { InterviewQuestion, InterviewQuestionSet } from ".";

const useStyles = makeStyles({
  solved: {
    "&.Mui-selected": {
      background: "#198754",
      color: "white",
      "&:hover": {
        background: "#157347",
      },
    },
  },
  average: {
    "&.Mui-selected": {
      background: "#ffcd39",
      "&:hover": {
        background: "#ffca2c",
      },
    },
  },
  failed: {
    "&.Mui-selected": {
      background: "#b02a37",
      color: "white",
      "&:hover": {
        background: "#bb2d3b",
      },
    },
  },
});

type Grade = "solved" | "average" | "failed";

interface InterviewQuestionWithAnswer extends InterviewQuestion {
  grade?: Grade;
  comment?: string;
}

interface InterviewQuestionWithAnswerSet {
  id: string;
  name: string;
  questions: InterviewQuestionWithAnswer[];
}

interface Answer {
  grade: Grade | null;
  comment: string;
}

interface FormValues {
  answers: { [id: string]: Answer };
}

const NewInterview = () => {
  const classes = useStyles();

  const interviewStore = store.namespace("inteview");

  const [questionSets, setQuestionsSets] = useState<
    InterviewQuestionWithAnswerSet[]
  >(interviewStore.get("questionSets", []));

  const [result, setResult] = useState("adfsadf\nsadf");

  const { control, handleSubmit, setValue, getValues } = useForm<FormValues>({
    defaultValues: {
      answers: questionSets
        .flatMap((x) => x.questions)
        .reduce(
          (acc, question) => ({
            ...acc,
            [question.id]: { comment: "", grade: "failed" },
          }),
          {}
        ),
    },
  });

  const getGradeIcon = (grade?: Grade): string => {
    switch (grade) {
      case "solved":
        return "✅";
      case "average":
        return "➕➖";
      case "failed":
        return "❌";
      default:
        return "";
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);

    const rows = [];

    for (const questionSet of questionSets) {
      rows.push(questionSet.name);
      rows.push("");
      for (const question of questionSet.questions) {
        const answer = data.answers[question.id];

        if (answer?.grade) {
          rows.push(
            `${question.question} (${answer.grade} ${getGradeIcon(
              answer.grade
            )})\n${answer.comment}\n`
          );
        }
      }
      rows.push("");
    }

    setResult(rows.join("\n"));
  };

  return (
    <Paper>
      <form onSubmit={handleSubmit(onSubmit)}>
        {questionSets.map((questionSet) => (
          <Box key={questionSet.id}>
            <Typography variant="h5">{questionSet.name}</Typography>
            {questionSet.questions.map((question) => (
              <Box key={question.id}>
                <Typography variant="body2">{question.question}</Typography>
                <Controller
                  name={`answers.${question.id}.grade`}
                  defaultValue={undefined}
                  control={control}
                  render={({
                    field: { name, ref, onChange, onBlur },
                    fieldState,
                    formState,
                  }) => (
                    <ToggleButtonGroup
                      value={getValues(name)}
                      onChange={(e, v) => setValue(name, v)}
                      exclusive
                      aria-label="text alignment"
                      size="small"
                    >
                      <ToggleButton
                        value="failed"
                        aria-label="left aligned"
                        className={classes.failed}
                      >
                        <ClearIcon fontSize="small" />
                      </ToggleButton>
                      <ToggleButton
                        value="average"
                        aria-label="centered"
                        className={classes.average}
                      >
                        <WarningIcon fontSize="small" />
                      </ToggleButton>
                      <ToggleButton
                        value="solved"
                        aria-label="right aligned"
                        className={classes.solved}
                      >
                        <DoneIcon fontSize="small" />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}
                />
                <Controller
                  name={`answers.${question.id}.comment`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => <TextField {...field} />}
                />
              </Box>
            ))}
          </Box>
        ))}
        <Button type="submit">Save</Button>
      </form>

      <Box mt={2}>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(result);
          }}
        >
          Copy
        </Button>
        <TextField
          rows={30}
          multiline
          value={result}
          fullWidth
          variant="outlined"
        />
      </Box>
    </Paper>
  );
};

NewInterview.getLayout = getLayout;

export default NewInterview;
