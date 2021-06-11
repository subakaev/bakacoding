import { getLayout } from "components/layouts/Layout";
import _ from "lodash";
import {
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import { ToggleButton } from "@material-ui/lab";
import { useState } from "react";
import { getEntriesByTags } from "lib/contentful";
import Link from "next/link";
import { Typography } from "@material-ui/core";
import { CardHeader } from "@material-ui/core";
import MarkdownText from "components/markdown/MarkdownText";

interface Tag {
  id: string;
  name: string;
  active: boolean;
}

const initialTags: Tag[] = [
  { id: "backToBackSwe", name: "Back to back SWE", active: false },
  { id: "primitives", name: "Primitives", active: false },
];

interface TagProps {
  label: string;
  onClick: () => void;
  active?: boolean;
}

const Tag = ({ label, onClick, active = false }: TagProps) => {
  return (
    <Chip
      size="small"
      label={label}
      onClick={onClick}
      color={active ? "primary" : "default"}
    />
  );
};

const Cs = () => {
  const [tags, setTags] = useState<{ [id: string]: Tag }>(
    initialTags.reduce((acc, tag) => ({ ...acc, [tag.id]: tag }), {})
  );
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
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
    <Paper>
      <Card>
        <CardContent>
          {Object.values(tags).map((tag) => {
            return (
              <Box mr={1} component="span">
                <Tag
                  label={tag.name}
                  onClick={createOnTagToggleHandler(tag.id)}
                  active={tag.active}
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

                <MarkdownText text={current.fields.javaScriptSolution} />
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Paper>
  );
};

Cs.getLayout = getLayout;

export default Cs;
