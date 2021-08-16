import { useState } from "react";
import { getLayout } from "components/layouts/Layout";
import TagsFilter from "components/TagsFilter";
import useTags from "lib/hooks/useTags";
import { Box, CircularProgress, Typography, Button } from "@material-ui/core";
import useSWR from "swr";
import axios from "axios";
import { MemoryCardStudyData } from "types/study";
import StudyingCard from "components/study/StudyingCard";

const cardsFetcher = (
  url: string,
  tags: string[]
): Promise<MemoryCardStudyData[]> =>
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
              <StudyingCard
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
