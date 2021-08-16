import { useState } from "react";
import {
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
import axios from "axios";
import { MemoryCardAttemptType } from "types/MemoryCardHistoryItem";
import { MemoryCardsStudyingHistory } from "types/study";
import { useSession } from "next-auth/client";

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
  history?: MemoryCardsStudyingHistory;
  currentCardNumber: number;
  totalCardsLength: number;
  onComplete: () => void;
}

const StudyingCard = ({
  card,
  history,
  currentCardNumber,
  totalCardsLength,
  onComplete,
}: MemoryCardItemProps): JSX.Element => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [session] = useSession();

  const getHandler = (attemptTypeResult: MemoryCardAttemptType) => async () => {
    try {
      setLoading(true);

      // TODO: session.isAuthenticated
      if (session?.user) {
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

export default StudyingCard;
