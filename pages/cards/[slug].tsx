import { getLayout } from "components/layouts/CodingCardsLayout";
import { getContentfulClient } from "lib/contentful";
import {
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { CodingCardFields } from "types/contentful/CodingCard";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Link as MuiLink,
  Box,
  LinearProgress,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MarkdownText from "components/markdown/MarkdownText";
import { Entry } from "contentful";
import axios from "axios";
import { useEffect, useState } from "react";
import { MemoryCardAttemptType } from "types/MemoryCardHistoryItem";
import { CodingCard } from "lib/db/models/CodingCardModel";

const CodingCardPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const entry = props.entry;

  const [card, setCard] = useState<CodingCard | null>(null);

  useEffect(() => {
    if (!entry) {
      return;
    }
    const getCard = async () => {
      const response = await axios.get(
        `/api/coding-cards/${entry.fields.slug}`
      );

      console.log(response);

      setCard(response.data);
    };

    getCard();
  }, [entry]);

  const updateProgress = async (result: MemoryCardAttemptType) => {
    try {
      // setSaving(true);

      const response = await axios.put(
        `/api/coding-cards/${entry.fields.slug}`,
        { result }
      );

      // if (codingCard == null) {
      //   const response = await axios.post("/api/coding-cards", {
      //     entryId: entry?.sys.id,
      //     result,
      //   });
      // } else {

      // }
      // setSaving(false);
      console.log("done");
    } catch {
      // setSaving(false);
      console.log("error");
    }
  };

  const failedHandler = async () => {
    await updateProgress("failed");
  };

  const warningHandler = async () => {
    await updateProgress("warning");
  };

  const successHandler = async () => {
    await updateProgress("success");
  };

  if (!entry) {
    return "Loading...";
  }

  console.log(entry);

  // TODO export settings (7 days might be changed later)
  const percent = Math.trunc(((card?.progress ?? 0) * 100) / 7);

  const hints = entry.fields.hints ?? [];

  return (
    <Container maxWidth="xl">
      {!!card && (
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="body2">
            Frequency: {card.repetitionPeriod}
          </Typography>
          <LinearProgress
            value={percent}
            sx={{ width: 200, ml: 2, mr: 1 }}
            variant="determinate"
          />
          <Typography variant="body2">{percent}%</Typography>
          <Typography variant="body2" sx={{ ml: 2 }}>
            Last attempt: {card.lastAttemptType} at {card.lastAttemptDate}
          </Typography>
        </Box>
      )}
      {!card && (
        <Box mb={2}>
          <Typography variant="body2">Not studied before</Typography>
        </Box>
      )}
      <Card>
        <CardHeader title={entry.fields.title} />
        <CardContent>
          <MarkdownText text={entry.fields.description} />
          <MuiLink href={entry.fields.link} target="_blank">
            Open
          </MuiLink>
        </CardContent>
        <CardActions>
          <Button onClick={failedHandler}>Fail</Button>
          <Button onClick={warningHandler}>Keep</Button>
          <Button onClick={successHandler}>Success</Button>
        </CardActions>
      </Card>

      {hints.length > 0 && (
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="hints-content"
            id="hints-header">
            <Typography>Hints</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {hints.map((hint, index) => (
              <Accordion key={hint}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="hints-content"
                  id="hints-header">
                  Hint {index + 1}
                </AccordionSummary>
                <AccordionDetails>{hint}</AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="hints-content"
          id="hints-header">
          <Typography>Solutions</Typography>
        </AccordionSummary>
        {entry.fields.solutions.map((solution) => (
          <Accordion key={solution.sys.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="hints-content"
              id="hints-header">
              <Typography>{solution.fields.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Time comlexity: {solution.fields.timeComplexity}
              </Typography>
              <Typography>
                Space complexity: {solution.fields.spaceComplexity}
              </Typography>
              <MarkdownText text={solution.fields.solution} />
            </AccordionDetails>
          </Accordion>
        ))}
      </Accordion>
    </Container>
  );
};

CodingCardPage.getLayout = getLayout;

export const getStaticProps: GetStaticProps<{
  entry: Entry<CodingCardFields>;
}> = async (context: GetStaticPropsContext) => {
  const slug = context.params?.slug;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  // TODO to method
  const client = getContentfulClient();

  const entries = await client.getEntries<CodingCardFields>({
    content_type: "codingTask",
    "fields.slug": slug,
  });

  // TODO if not found
  const [entry] = entries.items;

  return {
    props: {
      entry,
    },
    revalidate: 1,
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default CodingCardPage;
