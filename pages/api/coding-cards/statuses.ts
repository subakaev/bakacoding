import { addCardHistoryItem } from "lib/api/cards-history";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import withAuth from "lib/middlewares/auth-middleware";
import { updateCardStudyProgress } from "lib/services/study";
import connectToMongo from "lib/db/connect";
import CodingCardModel, { CodingCard } from "lib/db/models/CodingCardModel";
import { updateCodingCardStudyProgress } from "lib/services/coding-cards-study";
import mongoose from "mongoose";
import { getUserIdFromSession } from "lib/api/utils";
import { getActiveCodingCards, getCodingCards } from "lib/db/dao/coding-cards";

async function codingCardsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    await connectToMongo();

    const { method } = req;

    const userId = await getUserIdFromSession(req);

    switch (method) {
      case "GET":
        console.log(req.query);

        // TODO return just slugs here to optimize?
        const cards = await getCodingCards(userId);

        res
          .status(200)
          .json(
            cards.map((card) => ({
              slug: card.slug,
              nextRepetitionDat: card.nextRepetitionDate,
            }))
          );
        break;
      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    console.error(e);
    res.status(500).end("Internal Server error");
  }
}

export default withAuth(codingCardsHandler);
