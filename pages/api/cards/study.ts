import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { getCardsForStudying } from "lib/services/study";

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

        const data = await getCardsForStudying(tags, session?.user?.id);

        res.status(200).json(data);
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
