import { connectToDatabase } from "lib/mongodb";
import { ObjectId } from "mongodb";
import { MemoryCardHistoryItem } from "types/MemoryCardHistoryItem";
import { getItemsFromCollection } from "./common";

export async function getCardsHistoryForUser(
  userId?: string
): Promise<MemoryCardHistoryItem[]> {
  if (!!userId) {
    return getItemsFromCollection<MemoryCardHistoryItem>("cards-history", {
      userId: new ObjectId(userId),
    });
  }

  return [];
}

export async function getCardHistoryItemById(
  _id: ObjectId
): Promise<MemoryCardHistoryItem> {
  const { db } = await connectToDatabase();

  const historyItem = await db
    .collection<MemoryCardHistoryItem>("cards-history")
    .findOne({ _id });

  if (historyItem == null) {
    throw new Error(`Cannot find card history item with id=${_id}`);
  }

  return historyItem;
}

export async function addCardHistoryItem(
  item: Omit<MemoryCardHistoryItem, "_id">
): Promise<MemoryCardHistoryItem> {
  const { db } = await connectToDatabase();

  const insertResult = await db.collection("cards-history").insertOne(item);

  return getCardHistoryItemById(insertResult.insertedId);
}

export async function updateCardHistoryItem(
  _id: ObjectId,
  item: Omit<MemoryCardHistoryItem, "_id">
): Promise<MemoryCardHistoryItem> {
  const { db } = await connectToDatabase();

  await db.collection("cards-history").updateOne(
    { _id },
    { $set: item },
    {
      upsert: true,
    }
  );

  return getCardHistoryItemById(_id);
}
