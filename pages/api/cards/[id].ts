import { Db, ObjectID } from "mongodb";
import { connectToDatabase } from "../../../lib/mongodb";
import omit from "lodash/omit";
import { NextApiRequest, NextApiResponse } from "next";

// TODO: think about making NextApiRequest generic to specify type for the body or query. It can be difficult because this handler is using for all family routes
export default async function cardsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { method } = req;

    console.log(req.method);

    const conn = await connectToDatabase();

    const db = conn.db as Db;

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
          .deleteOne({ _id: new ObjectID(req.query.id as string) });
        console.log(result1);
        res.status(204).end();
        break;
      case "PUT":
        await db
          .collection("cards")
          .updateOne(
            { _id: new ObjectID(req.query.id as string) },
            { $set: omit(req.body, "_id") }
          ); // get user id from session TODO: add createdby updatedby???
        // Update or create data in your database
        res.status(200).end(); // TODO: put correct code here and send response?
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
