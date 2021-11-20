import mongoose from "mongoose";
import {
  MemoryCardAttemptType,
  RepetitionPeriod,
} from "types/MemoryCardHistoryItem";

const CODING_CARD_SCHEMA_NAME = "CodingCard";

export interface CodingCard {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  slug: string;
  attempts: {
    failed: number;
    warning: number;
    success: number;
  };
  lastAttemptType: MemoryCardAttemptType;
  progress: number;
  repetitionPeriod: RepetitionPeriod;
  nextRepetitionDate: Date;
  lastAttemptDate: Date;
}

const CodingCardSchema = new mongoose.Schema<CodingCard>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  slug: {
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
  lastAttemptDate: {
    type: Date,
    required: true,
  },
});

const CodingCardModel: mongoose.Model<CodingCard> =
  mongoose.models[CODING_CARD_SCHEMA_NAME] ||
  mongoose.model(CODING_CARD_SCHEMA_NAME, CodingCardSchema, "coding-cards");

export default CodingCardModel;
