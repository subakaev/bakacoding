import { getCardsByTags } from "lib/api/cards";
import { getCardsHistoryForUser } from "lib/api/cards-history";
import { MemoryCardHistoryItem } from "types/MemoryCardHistoryItem";
import _ from "lodash";
import { MemoryCardStudyData } from "types/study";

async function getCardsHistoryItemsForUserCachedByCardId(
  userId?: string
): Promise<{ [cardId: string]: MemoryCardHistoryItem }> {
  const cardsHistoryItems = await getCardsHistoryForUser(userId);
  return _.keyBy(cardsHistoryItems, (item) => item.cardId.toString());
}

export async function getCardsForStudying(
  tags: string[],
  userId?: string
): Promise<MemoryCardStudyData[]> {
  const cards = await getCardsByTags(tags);

  const cachedHistory = await getCardsHistoryItemsForUserCachedByCardId(userId);

  const result: MemoryCardStudyData[] = [];

  const now = new Date();

  for (const card of cards) {
    if (!_.has(cachedHistory, card._id)) {
      result.push({ card });
    } else {
      const {
        _id,
        nextRepetitionDate,
        attempts,
        progress,
        repetitionPeriod,
        lastAttemptType,
      } = cachedHistory[card._id];

      if (nextRepetitionDate <= now) {
        result.push({
          card,
          history: {
            _id,
            attempts,
            lastAttemptType,
            progress,
            repetitionPeriod,
          },
        });
      }
    }
  }

  return result;
}
