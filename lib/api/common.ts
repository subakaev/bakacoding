import { connectToDatabase } from "lib/mongodb";
import { FilterQuery, SortOptionObject } from "mongodb";

export async function getItemsFromCollection<T>(
  collectionName: string,
  query?: FilterQuery<T>,
  sort?: SortOptionObject<T>
): Promise<T[]> {
  const { db } = await connectToDatabase();

  let cursor = db.collection<T>(collectionName).find(query ?? {});

  if (sort) {
    cursor = cursor.sort(sort);
  }

  return cursor.toArray();
}
