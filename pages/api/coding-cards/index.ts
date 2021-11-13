import { addCardHistoryItem } from "lib/api/cards-history";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import withAuth from "lib/middlewares/auth-middleware";
import { updateCardStudyProgress } from "lib/services/study";
import connectToMongo from "lib/db/connect";
import CodingCardModel, { CodingCard } from "lib/db/CodingCardModel";
import { updateCodingCardStudyProgress } from "lib/services/coding-cards-study";
import mongoose from "mongoose";

async function codingCardsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { method } = req;

    console.log("requrie");

    const session = await getSession({ req });

    console.log(session);

    await connectToMongo();

    // const { cardId, attemptTypeResult } = req.body;

    console.log(req.query);

    const active = req.query.active ?? false;

    const userId = session?.user?.id ?? "";

    switch (method) {
      case "GET":
        const cards = await CodingCardModel.find({ userId })
          .lean<CodingCard[]>()
          .exec();

        res.status(200).json(cards);
        break;
      case "POST":
        const newItem = updateCodingCardStudyProgress(
          null,
          new mongoose.Types.ObjectId(userId),
          req.body.entryId,
          req.body.result
        );

        const item = new CodingCardModel(newItem);

        const saved = await item.save();

        res.status(200).json(saved);

        // const newItem = updateCardStudyProgress(
        //   null,
        //   new ObjectId(userId),
        //   new ObjectId(cardId),
        //   attemptTypeResult
        // );

        // const result = await addCardHistoryItem(newItem);

        // res.status(200).json(result);
        break;
      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    res.status(500).end("Internal Server error");
  }
}

export default withAuth(codingCardsHandler);
