import {
  getCardHistoryItem,
  updateCardHistoryItem,
} from "lib/api/cards-history";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import {
  MemoryCardAttemptType,
  MemoryCardHistoryItem,
} from "types/MemoryCardHistoryItem";
import * as Luxon from "luxon";
import { ObjectId } from "mongodb";

const maxRepetitions = {
  daily: 7,
  weekly: 7,
};

const updateCardHistory = (
  item: MemoryCardHistoryItem | null,
  userId: string,
  cardId: string,
  attemptTypeResult: MemoryCardAttemptType
): Omit<MemoryCardHistoryItem, "id"> => {
  const result: Omit<MemoryCardHistoryItem, "id"> = item ?? {
    cardId: new ObjectId(cardId),
    userId: new ObjectId(userId),
    lastAttemptType: attemptTypeResult,
    repetitionPeriod: "daily",
    progress: 0,
    nextRepetitionDate: new Date(),
    attempts: {
      failed: 0,
      success: 0,
      warning: 0,
    },
  };

  result.lastAttemptType = attemptTypeResult;
  result.attempts[attemptTypeResult] += 1;

  if (attemptTypeResult === "failed") {
    result.progress = 0;
    result.repetitionPeriod = "daily";
    result.nextRepetitionDate = Luxon.DateTime.utc()
      .plus({ days: 1 })
      .toJSDate();
  } else if (attemptTypeResult === "success") {
    result.progress += 1;

    if (result.repetitionPeriod !== "monthly") {
      if (result.progress >= maxRepetitions[result.repetitionPeriod]) {
        result.progress = 0;

        if (result.repetitionPeriod === "daily") {
          result.repetitionPeriod = "weekly";
        } else {
          result.repetitionPeriod = "monthly";
        }
      }
    }

    switch (result.repetitionPeriod) {
      case "daily":
        result.nextRepetitionDate = Luxon.DateTime.utc()
          .plus({ days: 1 })
          .toJSDate();
        break;
      case "weekly":
        result.nextRepetitionDate = Luxon.DateTime.utc()
          .plus({ weeks: 1 })
          .toJSDate();
        break;
      case "monthly":
        result.nextRepetitionDate = Luxon.DateTime.utc()
          .plus({ months: 1 })
          .toJSDate();
        break;
    }
  }

  return result;
};

async function cardsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { method } = req;

    const session = await getSession({ req });

    if (!session?.user) {
      res.status(401).end("User should be authenticated");
      return;
    }

    switch (method) {
      case "PUT":
        const { cardId, attemptTypeResult } = req.body;

        const userId = session.user.id;

        const historyItem = await getCardHistoryItem(userId, cardId);

        const updatedItem = updateCardHistory(
          historyItem,
          userId,
          cardId,
          attemptTypeResult
        );

        const result = await updateCardHistoryItem(updatedItem);

        res.status(200).json(result);

        break;
      default:
        res.setHeader("Allow", ["PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    res.status(500).end("Internal Server error");
  }
}

export default cardsHandler;
