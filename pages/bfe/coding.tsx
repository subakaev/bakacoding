import { useState, useEffect } from "react";
import { getLayout } from "components/layouts/Layout";
import { createClient } from "contentful";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import _ from "lodash";
import {
  Button,
  CircularProgress,
  Paper,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID ?? "",
  accessToken:
    process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_API_ACCESS_TOKEN ?? "",
  host: "preview.contentful.com",
});

const BfeCoding = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [ids, setIds] = useState(_.shuffle(props.ids));
  const [index, setIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [entry, setEntry] = useState<any>(null);

  useEffect(() => {
    if (index === -1 || index >= ids.length) {
      return;
    }

    const loadData = async () => {
      setLoading(true);

      try {
        const data = await client.getEntry(ids[index]);
        console.log(data);
        setEntry(data);
      } catch (e) {
        console.error(e);
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
      <Paper>
        <Button onClick={startButtonClickHandler}>Start</Button>
      </Paper>
    );
  }

  if (index >= ids.length) {
    return (
      <Paper>
        <Typography variant="h1">Finished</Typography>
        <Button onClick={startButtonClickHandler}>Start again</Button>
      </Paper>
    );
  }

  if (loading || !entry) {
    return (
      <Paper>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper>
      <Card>
        <CardHeader title={entry.fields.name} />
        <CardContent>
          <Box my={2}>
            <Typography component="div" variant="body1">
              {entry.fields.task}
            </Typography>
          </Box>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="subtitle1">Show answer</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="div" variant="body2">
                {entry.fields.javascript[0].fields.code}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </CardContent>
        <CardActions>
          <Button onClick={goToPreviousClickHandler}>Previous</Button>
          <Button onClick={goToNextClickHandler}>Next</Button>
        </CardActions>
      </Card>
    </Paper>
  );
};

BfeCoding.getLayout = getLayout;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const data = await client.getEntries({
    content_type: "codeTask",
    "metadata.tags.sys.id[in]": "bfe,coding",
  });

  const ids = data.items.map((item) => item.sys.id);

  return {
    props: { data, ids },
  };
};

export default BfeCoding;
