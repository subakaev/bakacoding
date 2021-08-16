import { addCardHistoryItem } from "lib/api/cards-history";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { ObjectId } from "mongodb";
import withAuth from "lib/middlewares/auth-middleware";
import { updateCardStudyProgress } from "lib/services/study";

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
        const newItem = updateCardStudyProgress(
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
