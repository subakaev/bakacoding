import { connectToDatabase } from "lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import withAuth from "lib/middlewares/auth-middleware";
import withAdmin from "lib/middlewares/admin-middleware";

async function tagsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { method } = req;

    const conn = await connectToDatabase();

    const db = conn.db;

    switch (method) {
      case "GET":
        const item = await db.collection("tags").findOne({});
        res.status(200).json(item?.tags ?? []);
        break;

      case "PUT":
        await db
          .collection("tags")
          .updateOne({}, { $set: { tags: req.body.tags } }, { upsert: true });
        res.status(201).json(req.body.tags);
        break;
      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    res.status(500).end("Internal Server error");
  }
}

export default withAuth(withAdmin(tagsHandler));
