import { getLayout } from "components/layouts/Layout";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CardHeader,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { getEntriesByTags } from "lib/contentful";
import MarkdownText from "components/markdown/MarkdownText";
import initialTags, { ContentfulTag } from "lib/tags";

interface Tag extends ContentfulTag {
  active: boolean;
}

const Cs = (): JSX.Element => {
  const [tags, setTags] = useState<{ [id: string]: Tag }>(
    initialTags.reduce(
      (acc, tag) => ({ ...acc, [tag.id]: { ...tag, active: false } }),
      {}
    )
  );
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  // TODO: fix any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [current, setCurrent] = useState<any>(null);

  const createOnTagToggleHandler = (id: string) => () => {
    setTags({ ...tags, [id]: { ...tags[id], active: !tags[id].active } });
  };

  const getTotalNumberOfTasks = async () => {
    try {
      setLoading(true);

      const selectedTags = Object.values(tags)
        .filter((x) => x.active)
        .map((x) => x.id);

      const entries = await getEntriesByTags(
        "problemSolvingTask",
        selectedTags,
        "in",
        { limit: 0 }
      );

      setTotal(entries.total);

      setLoading(false);
    } catch (e) {
      console.error(e); // TODO
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const selectedTags = Object.values(tags)
        .filter((x) => x.active)
        .map((x) => x.id);

      const problemIndex = Math.round(Math.random() * (total - 1));

      const entries = await getEntriesByTags(
        "problemSolvingTask",
        selectedTags,
        "in",
        { skip: problemIndex, limit: 1 }
      );
      setCurrent(entries.items[0]);
      setLoading(false);
    } catch {
      // TODO add error handling
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          {Object.values(tags).map((tag) => {
            return (
              <Box mr={1} component="span" key={tag.id}>
                <Chip
                  size="small"
                  label={tag.name}
                  onClick={createOnTagToggleHandler(tag.id)}
                  color={tag.active ? "primary" : "default"}
                />
              </Box>
            );
          })}
        </CardContent>
        <CardActions>
          <Button onClick={getTotalNumberOfTasks} disabled={loading}>
            Load
          </Button>
        </CardActions>
      </Card>
      {loading && (
        <Box mt={2} p={5} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
      {!loading && (
        <Box mt={2} p={5}>
          <Typography>Problems found: {total}</Typography>
          <Button onClick={loadData}>Pick next</Button>

          {current && (
            <Card>
              <CardHeader title={current.fields.title} />
              <CardContent>
                <MarkdownText text={current.fields.question} />

                {current.fields.hints?.map((hint: string, idx: number) => {
                  return (
                    <Box mt={2} key={idx}>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel${idx}-content`}
                          id={`panel${idx}-header`}>
                          <Typography>Show hint {idx + 1}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>{hint}</Typography>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  );
                })}

                <Box mt={2}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="javascript-content"
                      id="javascript-header">
                      <Typography>Show solution</Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ display: "block" }}>
                      <MarkdownText text={current.fields.javaScriptSolution} />
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

Cs.getLayout = getLayout;

export default Cs;
