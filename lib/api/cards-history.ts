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

// TODO: get history item by its own id
export async function getCardHistoryItem(
  userId: string,
  cardId: string
): Promise<MemoryCardHistoryItem | null> {
  const { db } = await connectToDatabase();

  return db
    .collection<MemoryCardHistoryItem>("cards-history")
    .findOne({ userId: new ObjectId(userId), cardId: new ObjectId(cardId) });
}

export async function updateCardHistoryItem(
  item: Omit<MemoryCardHistoryItem, "id">
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
