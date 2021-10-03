import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from "@mui/material";
import _ from "lodash";
import { getEntryById } from "lib/contentful";
import MarkdownText from "./markdown/MarkdownText";
import CodeTaskSolution from "./CodeTaskSolution";

interface ContentfulQuestionSetTrainerProps {
  ids: string[];
}

const ContentfulQuestionSetTrainer = (
  props: ContentfulQuestionSetTrainerProps
): JSX.Element => {
  const [ids] = useState(_.shuffle(props.ids));

  const [setIndex, setSetIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  // TODO: fix any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [questions, setQuestions] = useState<any>([]);
  const [questionIndex, setQuestionIndex] = useState(-1);

  useEffect(() => {
    if (setIndex === -1 || setIndex >= ids.length) {
      return;
    }

    const loadData = async () => {
      setLoading(true);

      try {
        // TODO: fix any type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await getEntryById<any>(ids[setIndex]);
        console.log(data); // TODO remove
        setTitle(data.fields.title);
        const keys = Object.keys(data.fields)
          .filter((key) => key.toLowerCase().startsWith("question"))
          .filter((key) => data.fields[key].trim() !== "");

        const qs = keys.map((key) => {
          const num = key.replace("question", "");

          return {
            question: data.fields[key],
            answer: data.fields[`answer${num}`],
          };
        });

        setQuestions(qs);
      } catch (e) {
        console.error(e); // TODO log
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setIndex, ids]);

  const startButtonClickHandler = () => {
    setSetIndex(0);
    setQuestionIndex(0);
  };

  const startQuestionSetClickHandler = () => {
    setQuestionIndex(0);
  };

  const startNextQuestionSetClickHanlder = () => {
    setSetIndex((i) => i + 1);
    setQuestionIndex(0);
  };

  const goToPreviousClickHandler = () => {
    setQuestionIndex((i) => i - 1);
  };

  const goToNextClickHandler = () => {
    setQuestionIndex((i) => i + 1);
  };

  if (setIndex === -1) {
    return (
      <Box py={5} display="flex" justifyContent="center">
        <Button
          onClick={startButtonClickHandler}
          variant="contained"
          color="primary"
          size="large">
          Start
        </Button>
      </Box>
    );
  }

  if (setIndex >= ids.length) {
    return (
      <Box py={5} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h3">Finished</Typography>
        <Button
          onClick={startButtonClickHandler}
          variant="contained"
          color="primary"
          size="large">
          Start again
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box py={5} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (questionIndex === -1) {
    return (
      <Box py={5} display="flex" justifyContent="center">
        <Typography variant="body1">{title}</Typography>
        <Button
          onClick={startQuestionSetClickHandler}
          variant="contained"
          color="primary"
          size="large">
          Start
        </Button>
      </Box>
    );
  }

  if (questionIndex >= questions.length) {
    return (
      <Box py={5} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h3">Finished</Typography>
        <Button
          onClick={startQuestionSetClickHandler}
          variant="contained"
          color="primary"
          size="large">
          Start again
        </Button>
        <Button
          onClick={startNextQuestionSetClickHanlder}
          variant="contained"
          color="primary"
          size="large">
          Next set
        </Button>
      </Box>
    );
  }

  const data = questions[questionIndex];

  return (
    <Card>
      <CardHeader title={`Question ${questionIndex + 1}`} />
      <CardContent>
        <Box my={2}>
          <MarkdownText text={data.question} />
        </Box>

        <CodeTaskSolution
          key={`answer${questionIndex + 1}`}
          id={`answer${questionIndex + 1}`}
          text={data.answer}
        />
      </CardContent>
      <CardActions>
        <Button onClick={goToPreviousClickHandler}>Previous</Button>
        <Button onClick={goToNextClickHandler}>Next</Button>
      </CardActions>
    </Card>
  );
};

export default ContentfulQuestionSetTrainer;
