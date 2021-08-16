import {
  getCardHistoryItemById,
  updateCardHistoryItem,
} from "lib/api/cards-history";
import { NextApiRequest, NextApiResponse } from "next";
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

    const { attemptTypeResult } = req.body;

    switch (method) {
      case "PUT":
        const historyItem = await getCardHistoryItemById(
          new ObjectId(req.query.id as string)
        );

        if (historyItem == null) {
          res.status(400).json({
            errorMessage: `Cannot find history item with id=${req.query.id}`,
          });
          return;
        }

        const updatedItem = updateCardHistory(
          historyItem,
          historyItem.userId,
          historyItem.cardId,
          attemptTypeResult
        );

        const result = await updateCardHistoryItem(
          historyItem._id,
          updatedItem
        );

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

export default withAuth(cardsHandler);
