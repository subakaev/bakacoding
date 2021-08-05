import { connectToDatabase } from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import withAuth from "lib/middlewares/auth-middleware";
import withAdmin from "lib/middlewares/admin-middleware";

async function cardsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { method } = req;

    const conn = await connectToDatabase();

    const db = conn.db;

    const card = req.body;

    switch (method) {
      case "GET":
        const tags = [req.query.tags ?? []].flat();
        const cards = await db
          .collection("cards")
          .find(tags.length > 0 ? { tags: { $elemMatch: { $in: tags } } } : {})
          .sort({ _id: -1 })
          .toArray();
        res.status(200).json(cards);
        break;
      case "POST":
        const result = await db.collection("cards").insertOne(card);
        const inserted = await db
          .collection("cards")
          .findOne({ _id: result.insertedId });
        res.status(201).json(inserted);
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    console.log(e);
    res.status(500).end("Internal Server error");
  }
}

export default withAuth(withAdmin(cardsHandler));
