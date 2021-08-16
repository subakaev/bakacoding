import {
  getCardHistoryItemById,
  updateCardHistoryItem,
} from "lib/api/cards-history";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import withAuth from "lib/middlewares/auth-middleware";
import { updateCardStudyProgress } from "lib/services/study";

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

        const updatedItem = updateCardStudyProgress(
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
