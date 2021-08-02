/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Db, MongoClient } from "mongodb";

const MONGODB_URI = process.env.DATABASE_URL ?? "";
// const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface MongoConnection {
  client: MongoClient;
  db: Db;
}

interface CachedConnection {
  connection: MongoConnection;
  promise: Promise<MongoConnection>;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
let cached: CachedConnection = global.mongo;

if (!cached) {
  // @ts-ignore
  cached = global.mongo = { conn: null, promise: null };
}

// TODO: fix ts-ignore & return type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function connectToDatabase() {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(),
      };
    });
  }

  cached.connection = await cached.promise;

  return cached.connection;
}
