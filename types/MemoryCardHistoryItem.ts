import { ObjectId } from "mongodb";

/**
 * failed - reset period and start learning from beginning
 * warning - keep same level and don't update the progress
 * success - update progress and period if needed
 */
export type MemoryCardAttemptType = "failed" | "warning" | "success";

export type RepetitionPeriod = "daily" | "weekly" | "monthly";

export interface MemoryCardAttempts {
  failed: number;
  warning: number;
  success: number;
}

export interface MemoryCardHistoryItem {
  _id: ObjectId;
  userId: ObjectId;
  cardId: ObjectId;
  attempts: MemoryCardAttempts;
  lastAttemptType: MemoryCardAttemptType;
  progress: number;
  repetitionPeriod: RepetitionPeriod;
  nextRepetitionDate: Date;
  // history: TODO:
}
