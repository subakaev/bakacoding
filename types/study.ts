import { ObjectId } from "mongodb";
import { MemoryCard } from "./MemoryCard";
import {
  MemoryCardAttempts,
  MemoryCardAttemptType,
  RepetitionPeriod,
} from "./MemoryCardHistoryItem";

export interface MemoryCardsStudyingHistory {
  _id: ObjectId;
  attempts: MemoryCardAttempts;
  lastAttemptType: MemoryCardAttemptType;
  progress: number;
  repetitionPeriod: RepetitionPeriod;
}

export interface MemoryCardStudyData {
  card: MemoryCard;
  history?: MemoryCardsStudyingHistory;
}
