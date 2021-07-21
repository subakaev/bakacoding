// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongodb, { MongoClient } from "mongodb";

export default async (req, res) => {
  const client = new MongoClient(process.env.DATABASE_URL);

  await client.connect();
  const database = client.db("main");
  const movies = database.collection("test");

  res.status(200).json({ name: "John Doe" });
};
