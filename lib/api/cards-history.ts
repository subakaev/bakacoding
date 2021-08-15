import { MemoryCardHistoryItem } from "types/MemoryCardHistoryItem";
import { getItemsFromCollection } from "./common";

export async function getCardsHistoryForUser(
  userId?: string
): Promise<MemoryCardHistoryItem[]> {
  if (!!userId) {
    return getItemsFromCollection<MemoryCardHistoryItem>("cards-history", {
      userId,
    });
  }

  return [];
}
