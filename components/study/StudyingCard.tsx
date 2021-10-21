import { useState } from "react";
import {
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MarkdownText from "components/markdown/MarkdownText";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import { MemoryCard } from "types/MemoryCard";
import axios from "axios";
import { MemoryCardAttemptType } from "types/MemoryCardHistoryItem";
import { MemoryCardsStudyingHistory } from "types/study";
import { useSession } from "next-auth/client";

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
    <Card sx={{ width: "100%" }}>
      <CardHeader
        sx={{ "& .MuiTypography-root": { fontSize: 10 } }}
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
          sx={{
            background: (theme) => theme.palette.error.main,
            "&:hover": (theme) => ({
              background: theme.palette.error.dark,
            }),
            "& .MuiButton-startIcon": {
              display: { xs: "none", sm: "inherit" },
            },
          }}
          disabled={loading}
          startIcon={<SentimentVeryDissatisfiedIcon />}>
          Failed
        </Button>
        <Button
          onClick={getHandler("warning")}
          color="primary"
          variant="contained"
          sx={{
            background: (theme) => theme.palette.warning.main,
            "&:hover": (theme) => ({
              background: theme.palette.warning.dark,
            }),
            "& .MuiButton-startIcon": {
              display: { xs: "none", sm: "inherit" },
            },
          }}
          disabled={loading}
          startIcon={<SentimentDissatisfiedIcon />}>
          Warning
        </Button>
        <Button
          onClick={getHandler("success")}
          color="primary"
          variant="contained"
          sx={{
            background: (theme) => theme.palette.success.main,
            "&:hover": (theme) => ({
              background: theme.palette.success.dark,
            }),
            "& .MuiButton-startIcon": {
              display: { xs: "none", sm: "inherit" },
            },
          }}
          disabled={loading}
          startIcon={<SentimentSatisfiedIcon />}>
          Success
        </Button>
      </CardActions>
    </Card>
  );
};

export default StudyingCard;
