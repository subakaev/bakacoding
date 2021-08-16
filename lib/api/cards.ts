import { MemoryCard } from "types/MemoryCard";
import { getItemsFromCollection } from "./common";

export async function getCardsByTags(tags: string[]): Promise<MemoryCard[]> {
  return getItemsFromCollection<MemoryCard>(
    "cards",
    tags.length > 0 ? { tags: { $elemMatch: { $in: tags } } } : {},
    { _id: -1 }
  );
}
