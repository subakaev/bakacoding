import { Db } from "mongodb";
import { connectToDatabase } from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function cardsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { method } = req;

    console.log(req.method);

    const conn = await connectToDatabase();

    const db = conn.db as Db;

    const card = req.body;

    switch (method) {
      case "GET":
        const cards = await db.collection("cards").find().toArray();
        res.status(200).json(cards);
        break;
      case "POST":
        const result = await db.collection("cards").insertOne(card);
        const inserted = await db
          .collection("cards")
          .findOne({ _id: result.insertedId });
        res.status(201).json(inserted);
        break;
      // case "PUT":
      //   // Update or create data in your database
      //   res.status(200).json({ id, name: name || `User ${id}` });
      //   break;
      default:
        res.setHeader("Allow", ["GET", "PUT"]); // TODO: change
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    res.status(500).end("Internal Server error");
  }
}
