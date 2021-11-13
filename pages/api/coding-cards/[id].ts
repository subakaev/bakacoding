import {
  getCardHistoryItemById,
  updateCardHistoryItem,
} from "lib/api/cards-history";
import { NextApiRequest, NextApiResponse } from "next";
import withAuth from "lib/middlewares/auth-middleware";
import { updateCardStudyProgress } from "lib/services/study";
import CodingCardModel from "lib/db/CodingCardModel";
import mongoose from "mongoose";
import { updateCodingCardStudyProgress } from "lib/services/coding-cards-study";

async function codingCardsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { method } = req;

    const { attemptTypeResult } = req.body;

    switch (method) {
      case "GET": {
        console.log(req.query.id);
        const card = await CodingCardModel.findOne({
          entryId: req.query.id as string,
        }).exec();

        console.log(JSON.stringify(card));

        res.status(200).json(card);

        break;
      }
      case "PUT":
        const card = await CodingCardModel.findOne({
          _id: new mongoose.Types.ObjectId(req.query.id as string),
        }).exec();

        // const historyItem = await getCardHistoryItemById(
        //   new ObjectId(req.query.id as string)
        // );

        if (card == null) {
          res.status(400).json({
            errorMessage: `Cannot find history item with id=${req.query.id}`,
          });
          return;
        }

        const updatedItem = updateCodingCardStudyProgress(
          card,
          card.userId,
          card.entryId,
          req.body.result
        );

        card.set({ ...updatedItem });

        const saved = await card.save();

        // const result = await updateCardHistoryItem(
        //   historyItem._id,
        //   updatedItem
        // );

        res.status(200).json(saved);

        break;
      default:
        res.setHeader("Allow", ["PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    res.status(500).end("Internal Server error");
  }
}

export default withAuth(codingCardsHandler);
