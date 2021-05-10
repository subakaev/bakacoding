import { useState, useEffect } from "react";
import _ from "lodash";
import {
  Paper,
  Button,
  Link as MuiLink,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MarkdownText from "./markdown/MarkdownText";
import { getContentfulClient } from "lib/contentful";

interface ContentfulTrainerProps {
  ids: string[];
}

const ContentfulCodeTaskTrainer = (props: ContentfulTrainerProps) => {
  const client = getContentfulClient();

  const [ids] = useState(_.shuffle(props.ids));
  const [index, setIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [entry, setEntry] = useState<any>(null); // TODO

  useEffect(() => {
    if (index === -1 || index >= ids.length) {
      return;
    }

    const loadData = async () => {
      setLoading(true);

      try {
        const data = await client.getEntry(ids[index]);
        console.log(data); // TODO remove
        setEntry(data);
      } catch (e) {
        console.error(e); // TODO log
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [index, setLoading, setEntry]);

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
          size="large"
        >
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
          size="large"
        >
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
        {entry.fields.javascript.map((solution: any /* TODO */) => {
          return (
            <Accordion key={solution.sys.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${solution.sys.id}-content`}
                id={`${solution.sys.id}-header`}
              >
                <Typography variant="subtitle1">
                  {solution.fields.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <MarkdownText text={solution.fields.code} />
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </CardContent>
      <CardActions>
        <Button onClick={goToPreviousClickHandler}>Previous</Button>
        <Button onClick={goToNextClickHandler}>Next</Button>
      </CardActions>
    </Card>
  );
};

export default ContentfulCodeTaskTrainer;
