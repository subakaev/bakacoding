import { useState, useEffect } from "react";
import _ from "lodash";
import {
  Button,
  Link as MuiLink,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  CircularProgress,
} from "@mui/material";
import MarkdownText from "./markdown/MarkdownText";
import { getEntryById } from "lib/contentful";
import CodeTaskSolution from "./CodeTaskSolution";

interface ContentfulTrainerProps {
  ids: string[];
}

const ContentfulCodeTaskTrainer = (
  props: ContentfulTrainerProps
): JSX.Element => {
  const [ids] = useState(_.shuffle(props.ids));
  const [index, setIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  // TODO: create type for contentful entity
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [entry, setEntry] = useState<any>(null); // TODO

  useEffect(() => {
    if (index === -1 || index >= ids.length) {
      return;
    }

    const loadData = async () => {
      setLoading(true);

      try {
        const data = await getEntryById(ids[index]);
        console.log(data); // TODO remove
        setEntry(data);
      } catch (e) {
        console.error(e); // TODO log
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [index, setLoading, setEntry, ids]);

  const startButtonClickHandler = () => {
    setIndex(0);
  };

  const goToPreviousClickHandler = () => {
    setIndex(index - 1);
  };

  const goToNextClickHandler = () => {
    setIndex(index + 1);
  };

  if (index === -1) {
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

  if (index >= ids.length) {
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

  if (loading || !entry) {
    return (
      <Box py={5} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardHeader title={entry.fields.name} />
      <CardContent>
        <Box my={2}>
          <MarkdownText text={entry.fields.task} />
        </Box>
        <Box my={5}>
          <MuiLink href={entry.fields.link} target="__blank" rel="noreferrer">
            <Button variant="contained" color="primary">
              Go to problem
            </Button>
          </MuiLink>
        </Box>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {entry.fields.javascript?.map((solution: any /* TODO: */) => {
          return (
            <CodeTaskSolution
              key={solution.sys.id}
              id={solution.sys.id}
              title={solution.fields.title}
              text={solution.fields.code}
            />
          );
        })}
        {entry.fields.answer && (
          <CodeTaskSolution id="answer" text={entry.fields.answer} />
        )}
      </CardContent>
      <CardActions>
        <Button onClick={goToPreviousClickHandler}>Previous</Button>
        <Button onClick={goToNextClickHandler}>Next</Button>
      </CardActions>
    </Card>
  );
};

export default ContentfulCodeTaskTrainer;
