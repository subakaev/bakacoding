import { NextApiRequest, NextApiResponse } from "next";
import withAuth from "lib/middlewares/auth-middleware";
import { updateCodingCardStudyProgress } from "lib/services/coding-cards-study";
import {
  getCodingCardDocument,
  getOrCreateCodingCardDocument,
} from "lib/db/dao/coding-cards";
import { getUserIdFromSession } from "lib/api/utils";
import connectToMongo from "lib/db/connect";

async function codingCardsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    await connectToMongo();

    const { method } = req;

    const userId = await getUserIdFromSession(req);

    const slug = String(req.query.id ?? "");

    switch (method) {
      case "GET": {
        // TODO to service layer
        const card = await getCodingCardDocument({ userId, slug });

        res.status(200).json(card);

        break;
      }
      case "PUT":
        // TODO move to service layer
        const cardDocument = await getOrCreateCodingCardDocument({
          slug,
          userId,
        });

        const result = updateCodingCardStudyProgress(
          cardDocument.attempts,
          cardDocument.progress,
          cardDocument.repetitionPeriod,
          req.body.result
        );

        cardDocument.set({ ...result });

        const saved = await cardDocument.save();

        res.status(200).json(saved);

        break;
      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    console.error(e);
    res.status(500).end("Internal Server error");
  }
}

export default withAuth(codingCardsHandler);
