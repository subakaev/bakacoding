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
  id: ObjectId
): Promise<MemoryCardHistoryItem | null> {
  const { db } = await connectToDatabase();
  return db
    .collection<MemoryCardHistoryItem>("cards-history")
    .findOne({ _id: id });
}

export async function addCardHistoryItem(
  item: Omit<MemoryCardHistoryItem, "_id">
): Promise<MemoryCardHistoryItem> {
  const { db } = await connectToDatabase();

  const insertResult = await db.collection("cards-history").insertOne(item);

  const result = await getCardHistoryItemById(insertResult.insertedId);

  if (result == null) {
    throw new Error("Should find item");
  }

  return result;
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

  const result = await getCardHistoryItemById(_id);

  if (result == null) {
    throw new Error("Should find item");
  }

  return result;
}
