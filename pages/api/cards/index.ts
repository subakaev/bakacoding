import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import {
  MemoryCardAttempts,
  MemoryCardAttemptType,
  MemoryCardHistoryItem,
  RepetitionPeriod,
} from "types/MemoryCardHistoryItem";
import _ from "lodash";
import { MemoryCard } from "types/MemoryCard";
import { getCardsByTags } from "lib/api/cards";
import { getCardsHistoryForUser } from "lib/api/cards-history";

interface MemoryCardLearningHistory {
  attempts: MemoryCardAttempts;
  lastAttemptType: MemoryCardAttemptType;
  progress: number;
  repetitionPeriod: RepetitionPeriod;
}

export interface MemoryCardLearningData {
  card: MemoryCard;
  history?: MemoryCardLearningHistory;
}

async function cardsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { method } = req;

    const session = await getSession({ req });

    switch (method) {
      case "GET":
        const tags = [req.query.tags ?? []].flat();
        const cards = await getCardsByTags(tags);

        const cardsHistoryItems = await getCardsHistoryForUser(
          session?.user?.id
        );
        const cachedHistory: { [cardId: string]: MemoryCardHistoryItem } =
          _.keyBy(cardsHistoryItems, (item) => item.userId);

        const result: MemoryCardLearningData[] = [];

        const now = new Date();

        for (const card of cards) {
          if (!_.has(cachedHistory, card._id)) {
            result.push({ card });
          } else {
            const historyItem = cachedHistory[card._id];

            if (historyItem.nextRepetitionDate <= now) {
              result.push({
                card,
                history: {
                  attempts: historyItem.attempts,
                  lastAttemptType: historyItem.lastAttemptType,
                  progress: historyItem.progress,
                  repetitionPeriod: historyItem.repetitionPeriod,
                },
              });
            }
          }
        }
        res.status(200).json(result);
        break;
      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch {
    res.status(500).end("Internal Server error");
  }
}

export default cardsHandler;
