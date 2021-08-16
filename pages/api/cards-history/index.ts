import { addCardHistoryItem } from "lib/api/cards-history";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import {
  MemoryCardAttemptType,
  MemoryCardHistoryItem,
} from "types/MemoryCardHistoryItem";
import * as Luxon from "luxon";
import { ObjectId } from "mongodb";
import withAuth from "lib/middlewares/auth-middleware";

const maxRepetitions = {
  daily: 7,
  weekly: 7,
};

const updateCardHistory = (
  item: MemoryCardHistoryItem | null,
  userId: ObjectId,
  cardId: ObjectId,
  attemptTypeResult: MemoryCardAttemptType
): Omit<MemoryCardHistoryItem, "_id"> => {
  const result: Omit<MemoryCardHistoryItem, "_id"> = item ?? {
    cardId,
    userId,
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

    const { cardId, attemptTypeResult } = req.body;

    const userId = session?.user?.id ?? "";

    switch (method) {
      case "POST":
        const newItem = updateCardHistory(
          null,
          new ObjectId(userId),
          new ObjectId(cardId),
          attemptTypeResult
        );

        const result = await addCardHistoryItem(newItem);

        res.status(200).json(result);
        break;
      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    res.status(500).end("Internal Server error");
  }
}

export default withAuth(cardsHandler);
