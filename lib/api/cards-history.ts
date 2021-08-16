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
  id: string
): Promise<MemoryCardHistoryItem | null> {
  const { db } = await connectToDatabase();
  return db
    .collection<MemoryCardHistoryItem>("cards-history")
    .findOne({ _id: new ObjectId(id) });
}

export async function addCardHistoryItem(
  item: Omit<MemoryCardHistoryItem, "_id">
): Promise<MemoryCardHistoryItem> {
  return updateCardHistoryItem(item);
}

export async function updateCardHistoryItem(
  item: Omit<MemoryCardHistoryItem, "_id">
): Promise<MemoryCardHistoryItem> {
  const { db } = await connectToDatabase();

  await db.collection("cards-history").updateOne(
    { userId: item.userId, cardId: item.cardId },
    { $set: item },
    {
      upsert: true,
    }
  );

  const result = await db
    .collection<MemoryCardHistoryItem>("cards-history")
    .findOne({ userId: item.userId, cardId: item.cardId });

  if (result == null) {
    throw new Error("Should find item");
  }

  return result;
}
