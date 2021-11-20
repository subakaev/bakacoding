import { Document, Model, Types } from "mongoose";
import CodingCardModel, { CodingCard } from "../models/CodingCardModel";

function getDocumentFromCollection<T>(
  model: Model<T>,
  query: Partial<T>
): Promise<Document<Types.ObjectId, any, T> | null> {
  return model.findOne(query).exec();
}

const getDefaultCodingCard = (
  params: Partial<CodingCard>
): Omit<CodingCard, "_id"> => ({
  slug: "",
  userId: new Types.ObjectId(),
  lastAttemptType: "warning",
  repetitionPeriod: "daily",
  progress: 0,
  nextRepetitionDate: new Date(),
  lastAttemptDate: new Date(),
  attempts: {
    failed: 0,
    success: 0,
    warning: 0,
  },
  ...params,
});

export const getCodingCardDocument = (
  params: Partial<CodingCard>
): Promise<Document<Types.ObjectId, any, CodingCard> | null> =>
  getDocumentFromCollection<CodingCard>(CodingCardModel, params);

export const getOrCreateCodingCardDocument = async (
  params: Partial<CodingCard>
): Promise<
  Document<any, any, CodingCard> & CodingCard & { _id: Types.ObjectId }
> => {
  const card = await CodingCardModel.findOne(params).exec();

  return card ?? new CodingCardModel(getDefaultCodingCard(params));
};

export const getCodingCards = (
  userId: Types.ObjectId
): Promise<CodingCard[]> => {
  return CodingCardModel.find({ userId }).lean<CodingCard[]>().exec();
};

export const getActiveCodingCards = (
  userId: Types.ObjectId
): Promise<CodingCard[]> => {
  return CodingCardModel.find({
    userId,
    nextRepetitionDate: { $lte: new Date() },
  })
    .lean<CodingCard[]>()
    .exec();
};
