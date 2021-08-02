import { Db, ObjectID } from "mongodb";
import { connectToDatabase } from "../../../lib/mongodb";
import omit from "lodash/omit";
import { NextApiRequest, NextApiResponse } from "next";
import withAuth from "lib/middlewares/auth-middleware";
import withAdmin from "lib/middlewares/admin-middleware";

// TODO: think about making NextApiRequest generic to specify type for the body or query. It can be difficult because this handler is using for all family routes
async function cardsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { method } = req;

    const conn = await connectToDatabase();

    const db = conn.db as Db;

    switch (method) {
      case "DELETE":
        await db
          .collection("cards")
          .deleteOne({ _id: new ObjectID(req.query.id as string) });
        res.status(204).end();
        break;
      case "PUT":
        await db
          .collection("cards")
          .updateOne(
            { _id: new ObjectID(req.query.id as string) },
            { $set: omit(req.body, "_id") }
          ); // get user id from session TODO: add createdby updatedby???
        res.status(200).end(); // TODO: put correct code here and send response?
        break;
      default:
        res.setHeader("Allow", ["PUT", "DELETE"]); // TODO: change
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    console.log(e);
    res.status(500).end("Internal Server error");
  }
}

export default withAuth(withAdmin(cardsHandler));
