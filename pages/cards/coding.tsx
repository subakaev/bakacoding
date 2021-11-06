import { getLayout } from "components/layouts/Layout";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Typography,
  Container,
  Chip,
  Link as MuiLink,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
} from "@mui/material";
import _ from "lodash";
import { getContentfulClient } from "lib/contentful";
import { Entry } from "contentful";
import { useState } from "react";
import MarkdownText from "components/markdown/MarkdownText";

enum Difficulty {
  All = "All",
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

interface FormValues {
  difficulty: Difficulty;
}

interface CodingCardSolutionFields {
  solution: string;
  spaceComplexity: string;
  timeComplexity: string;
  title: string;
}

interface CodingCardFields {
  description: string;
  difficulty: Difficulty;
  hints: string[];
  link: string;
  slug: string;
  solutions: Entry<CodingCardSolutionFields>[];
  title: string;
}

const CodingCards = () => {
  const [cardIds, setCardIds] = useState<string[]>([]);
  const [cardIndex, setCardIndex] = useState(-1);
  const [entry, setEntry] = useState<Entry<CodingCardFields> | null>(null);

  const { handleSubmit, control, formState } = useForm<FormValues>({
    defaultValues: { difficulty: Difficulty.All },
  });

  const onSubmit = async (values: FormValues) => {
    const client = getContentfulClient();

    const entries = await client.getEntries<Entry<never>>({
      content_type: "codingTask",
      select: "sys.id",
      ...(values.difficulty !== Difficulty.All && {
        "fields.difficulty": values.difficulty,
      }),
    });

    setCardIds(_.shuffle(entries.items.map((item) => item.sys.id)));
    setCardIndex(0);
  };

  const pickCard = async () => {
    const client = getContentfulClient();

    const cardId = cardIds[cardIndex];

    const entry = await client.getEntry<CodingCardFields>(cardId);

    setEntry(entry);

    setCardIndex((idx) => idx + 1);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="difficulty"
          control={control}
          render={({ field }) => {
            return (
              <FormControl>
                <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
                <Select
                  {...field}
                  size="small"
                  id="difficulty-select"
                  labelId="difficulty-select-label"
                  label="Difficulty">
                  {Object.values(Difficulty).map((difficulty) => (
                    <MenuItem key={difficulty} value={difficulty}>
                      {_.capitalize(difficulty)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={formState.isSubmitting}>
          Apply
        </Button>
      </form>

      <Typography>{cardIds.length} cards found</Typography>
      <Button variant="contained" onClick={pickCard}>
        Pick random card
      </Button>

      {!!entry && (
        <Container maxWidth="xl">
          <Card>
            <CardHeader title={entry.fields.title} />
            <CardContent>
              <MarkdownText text={entry.fields.description} />
              <MuiLink href={entry.fields.link} target="_blank">
                Open
              </MuiLink>
              <Typography>Hints</Typography>
              {entry.fields.hints.map((hint, index) => (
                <Accordion key={hint}>
                  <AccordionSummary>
                    <Typography>Show hint {index + 1}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{hint}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
              <Typography>Solutions</Typography>
              {entry.fields.solutions.map((solution) => (
                <Accordion key={solution.sys.id}>
                  <AccordionSummary>
                    <Typography>{solution.fields.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Time complexity: {solution.fields.timeComplexity}
                    </Typography>
                    <Typography>
                      Space complexity: {solution.fields.spaceComplexity}
                    </Typography>
                    <MarkdownText text={solution.fields.solution} />
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
            <CardActions>
              <Button>Fail</Button>
              <Button>Keep</Button>
              <Button>Success</Button>
            </CardActions>
          </Card>
        </Container>
      )}
    </div>
  );
};

CodingCards.getLayout = getLayout;

export default CodingCards;
