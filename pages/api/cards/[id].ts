import { Db, ObjectID } from "mongodb";
import { connectToDatabase } from "../../../lib/mongodb";
import omit from "lodash/omit";

export default async function cardsHandler(req: any, res: any) {
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
      // case "POST":
      //   const result = await db.collection("cards").insertOne(card);
      //   const inserted = await db
      //     .collection("cards")
      //     .findOne({ _id: result.insertedId });
      //   res.status(201).json(inserted);
      //   break;
      case "DELETE":
        const result1 = await db
          .collection("cards")
          .deleteOne({ _id: new ObjectID(req.query.id) });
        console.log(result1);
        res.status(204).end();
        break;
      case "PUT":
        const r = await db
          .collection("cards")
          .updateOne(
            { _id: new ObjectID(req.query.id) },
            { $set: omit(req.body, "_id") }
          ); // get user id from session TODO: add createdby updatedby???
        // Update or create data in your database
        res.status(200).end(); // TODO: put correct code here
        break;
      default:
        res.setHeader("Allow", ["GET", "PUT"]); // TODO: change
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    console.log(e);
    res.status(500).end("Internal Server error");
  }
}
