import { useState } from "react";
import { getLayout } from "components/layouts/Layout";
import TagsFilter from "components/TagsFilter";
import useTags from "lib/hooks/useTags";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  makeStyles,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MarkdownText from "components/markdown/MarkdownText";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";
import { MemoryCard } from "types/MemoryCard";
import useSWR from "swr";
import axios from "axios";
import {
  MemoryCardLearningData,
  MemoryCardLearningHistory,
} from "pages/api/cards/study";
import { MemoryCardAttemptType } from "types/MemoryCardHistoryItem";

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    minWidth: 500,
  },
  cardTitle: {
    fontSize: 10,
  },
  failed: {
    background: theme.palette.error.main,
    "&:hover": {
      background: theme.palette.error.dark,
    },
  },
  warning: {
    background: theme.palette.warning.main,
    "&:hover": {
      background: theme.palette.warning.dark,
    },
  },
  success: {
    background: theme.palette.success.main,
    "&:hover": {
      background: theme.palette.success.dark,
    },
  },
}));

interface MemoryCardItemProps {
  card: MemoryCard;
  history?: MemoryCardLearningHistory;
  currentCardNumber: number;
  totalCardsLength: number;
  onComplete: () => void;
}

const MemoryCardItem = ({
  card,
  history,
  currentCardNumber,
  totalCardsLength,
  onComplete,
}: MemoryCardItemProps) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const getHandler = (attemptTypeResult: MemoryCardAttemptType) => async () => {
    try {
      setLoading(true);

      if (!!history) {
        await axios.put(`/api/cards-history/${history._id}`, {
          attemptTypeResult,
        });
      } else {
        await axios.post("/api/cards-history", {
          cardId: card._id,
          attemptTypeResult,
        });
      }

      onComplete();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={classes.cardRoot}>
      <CardHeader
        classes={{ title: classes.cardTitle }}
        title={`#${card._id}`}
        action={
          <Typography variant="body2">
            {currentCardNumber} of {totalCardsLength}
          </Typography>
        }
      />
      <CardContent>
        <MarkdownText text={card.question} />

        <Accordion key={card._id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`card-${card._id}-answer-content`}
            id={`card-${card._id}-answer-header`}>
            <Typography>Answer</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <MarkdownText text={card.answer} />
            </div>
          </AccordionDetails>
        </Accordion>
      </CardContent>
      <CardActions>
        <Button
          onClick={getHandler("failed")}
          color="primary"
          variant="contained"
          className={classes.failed}
          disabled={loading}
          startIcon={<SentimentVeryDissatisfiedIcon />}>
          Failed
        </Button>
        <Button
          onClick={getHandler("warning")}
          color="primary"
          variant="contained"
          className={classes.warning}
          disabled={loading}
          startIcon={<SentimentDissatisfiedIcon />}>
          Warning
        </Button>
        <Button
          onClick={getHandler("success")}
          color="primary"
          variant="contained"
          className={classes.success}
          disabled={loading}
          startIcon={<SentimentSatisfiedIcon />}>
          Success
        </Button>
      </CardActions>
    </Card>
  );
};

const cardsFetcher = (
  url: string,
  tags: string[]
): Promise<MemoryCardLearningData[]> =>
  axios
    .get(`${url}?${tags.map((tag) => `tags=${tag}`).join("&")}`)
    .then((res) => res.data);

//TODO:
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useCards = (tags: string[]) => {
  const { data, error, revalidate } = useSWR(
    ["/api/cards/study", tags],
    cardsFetcher
  );

  return {
    cards: data ?? [],
    loading: !data && !error,
    error,
    revalidate,
  };
};

const CardsIndex = (): JSX.Element => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { tags } = useTags();

  const { cards, loading } = useCards(selectedTags);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // TODO:
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const startHandler = () => {
    setStarted(true);
  };
  const restartHandler = () => {
    setFinished(false);
    setSelectedIndex(0);
  };

  const nextHandler = () => {
    if (selectedIndex < cards.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const onFilterApplyHandler = (tags: string[]) => {
    setSelectedTags(tags);
    setFinished(false);
    setStarted(false);
    setSelectedIndex(0);
  };

  return (
    <div>
      <TagsFilter
        tags={tags}
        onApply={onFilterApplyHandler}
        disabled={loading}
      />

      <Box p={2} display="flex" alignItems="center" flexDirection="column">
        {loading && <CircularProgress />}
        {!loading && (
          <>
            {!started && (
              <>
                <Typography>{cards.length} cards found</Typography>
                {cards.length > 0 && (
                  <Button
                    onClick={startHandler}
                    color="primary"
                    variant="contained">
                    Start
                  </Button>
                )}
              </>
            )}
            {started && !finished && (
              <MemoryCardItem
                card={cards[selectedIndex].card}
                history={cards[selectedIndex].history}
                currentCardNumber={selectedIndex + 1}
                totalCardsLength={cards.length}
                onComplete={nextHandler}
              />
            )}
            {finished && (
              <>
                <Typography>Finished</Typography>
                <Button
                  onClick={restartHandler}
                  color="primary"
                  variant="contained">
                  Restart
                </Button>
              </>
            )}
          </>
        )}
      </Box>
    </div>
  );
};

CardsIndex.getLayout = getLayout;

export default CardsIndex;
