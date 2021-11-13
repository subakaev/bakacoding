import mongoose from "mongoose";
import {
  MemoryCardAttemptType,
  RepetitionPeriod,
} from "types/MemoryCardHistoryItem";

const CODING_CARD_SCHEMA_NAME = "CodingCard";

const CodingCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  entryId: {
    type: String,
    required: true,
  },
  attempts: {
    failed: {
      type: Number,
      required: true,
      default: 0,
    },
    warning: {
      type: Number,
      required: true,
      default: 0,
    },
    success: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  lastAttemptType: {
    type: String, // TODO validate value
    required: true,
  },
  progress: {
    type: Number,
    required: true,
  },
  repetitionPeriod: {
    type: String, // TODO validate value
    required: true,
  },
  nextRepetitionDate: {
    type: Date,
    required: true,
  },
});

export interface CodingCard {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  entryId: string;
  attempts: {
    failed: number;
    warning: number;
    success: number;
  };
  lastAttemptType: MemoryCardAttemptType;
  progress: number;
  repetitionPeriod: RepetitionPeriod;
  nextRepetitionDate: Date;
}

const CodingCardModel =
  mongoose.models[CODING_CARD_SCHEMA_NAME] ||
  mongoose.model(CODING_CARD_SCHEMA_NAME, CodingCardSchema, "coding-cards");

export default CodingCardModel;
