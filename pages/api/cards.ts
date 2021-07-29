import { Db } from "mongodb";
import { connectToDatabase } from "../../lib/mongodb";

export default async function cardsHandler(req: any, res: any) {
  const { method } = req;

  const conn = await connectToDatabase();

  const db = conn.db as Db;

  const card = req.body;

  switch (method) {
    case "GET":
      const cards = await db.collection("cards").find().toArray();
      res.status(200).json(cards);
      // Get data from your database
      // res.status(200).json({ id, name: `User ${id}` });
      break;
    case "POST":
      const result = await db.collection("cards").insert(card);
      res.status(200).send("success"); // TODO: change status code and return added element
      break;
    // case "PUT":
    //   // Update or create data in your database
    //   res.status(200).json({ id, name: name || `User ${id}` });
    //   break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
