import { Db } from "mongodb";
import { connectToDatabase } from "../../lib/mongodb";

export default async function cardHandler(req: any, res: any) {
  const { method } = req;

  const conn = await connectToDatabase();

  const db = conn.db as Db;

  const card = req.body;

  console.log(card);

  switch (method) {
    // case "GET":
    //   // Get data from your database
    //   // res.status(200).json({ id, name: `User ${id}` });
    //   break;
    case "POST":
      const result = await db.collection("cards").insert(card);
      console.log(result);
      res.status(200);
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
