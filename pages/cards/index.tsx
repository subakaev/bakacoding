import { useState } from "react";
import { getLayout } from "components/layouts/Layout";
import TagsFilter from "components/TagsFilter";
import useTags from "lib/api/useTags";
import _ from "lodash";
import useCards from "lib/api/useCards";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MarkdownText from "components/markdown/MarkdownText";

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
              <>
                <Typography>
                  Card #{cards[selectedIndex]._id} {selectedIndex + 1} of{" "}
                  {cards.length}
                </Typography>
                <MarkdownText text={cards[selectedIndex].question} />

                <Accordion key={cards[selectedIndex]._id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`card-${cards[selectedIndex]._id}-answer-content`}
                    id={`card-${cards[selectedIndex]._id}-answer-header`}>
                    <Typography>Answer</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                      <MarkdownText text={cards[selectedIndex].answer} />
                    </div>
                  </AccordionDetails>
                </Accordion>
                <Button
                  onClick={nextHandler}
                  color="primary"
                  variant="contained">
                  Next
                </Button>
              </>
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
