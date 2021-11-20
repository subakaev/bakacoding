import { getCardsByTags } from "lib/api/cards";
import { getCardsHistoryForUser } from "lib/api/cards-history";
import {
  MemoryCardAttemptType,
  MemoryCardHistoryItem,
  RepetitionPeriod,
} from "types/MemoryCardHistoryItem";
import _ from "lodash";
import { MemoryCardStudyData } from "types/study";
import { DateTime } from "luxon";
import CodingCardModel, { CodingCard } from "lib/db/models/CodingCardModel";
import mongoose from "mongoose";

// async function getCardsHistoryItemsForUserCachedByCardId(
//   userId?: string
// ): Promise<{ [cardId: string]: MemoryCardHistoryItem }> {
//   const cardsHistoryItems = await getCardsHistoryForUser(userId);
//   return _.keyBy(cardsHistoryItems, (item) => item.cardId.toString());
// }

// export async function getCardsForStudying(
//   tags: string[],
//   userId?: string
// ): Promise<MemoryCardStudyData[]> {
//   const cards = await getCardsByTags(tags);

//   const cachedHistory = await getCardsHistoryItemsForUserCachedByCardId(userId);

//   const result: MemoryCardStudyData[] = [];

//   const now = new Date();

//   for (const card of cards) {
//     if (!_.has(cachedHistory, card._id)) {
//       result.push({ card });
//     } else {
//       const {
//         _id,
//         nextRepetitionDate,
//         attempts,
//         progress,
//         repetitionPeriod,
//         lastAttemptType,
//       } = cachedHistory[card._id];

//       if (nextRepetitionDate <= now) {
//         result.push({
//           card,
//           history: {
//             _id,
//             attempts,
//             lastAttemptType,
//             progress,
//             repetitionPeriod,
//           },
//         });
//       }
//     }
//   }

//   return result;
// }

const maxRepetitions: Record<RepetitionPeriod, number> = {
  daily: 7,
  weekly: 7,
  monthly: Number.MAX_SAFE_INTEGER,
};

export function updateCodingCardStudyProgress(
  attempts: { failed: number; warning: number; success: number },
  progress: number,
  repetitionPeriod: RepetitionPeriod,
  attemptTypeResult: MemoryCardAttemptType
): Pick<
  CodingCard,
  | "attempts"
  | "progress"
  | "lastAttemptType"
  | "nextRepetitionDate"
  | "repetitionPeriod"
  | "lastAttemptDate"
> {
  const now = DateTime.utc();

  const result: Pick<
    CodingCard,
    | "attempts"
    | "progress"
    | "lastAttemptType"
    | "nextRepetitionDate"
    | "repetitionPeriod"
    | "lastAttemptDate"
  > = {
    attempts: { ...attempts },
    progress,
    lastAttemptType: attemptTypeResult,
    repetitionPeriod,
    nextRepetitionDate: now.toJSDate(),
    lastAttemptDate: now.toJSDate(),
  };

  result.attempts[attemptTypeResult] += 1;

  if (attemptTypeResult === "failed") {
    result.progress = 0;
    result.repetitionPeriod = "daily";
    result.nextRepetitionDate = now.plus({ days: 1 }).toJSDate();
  } else if (attemptTypeResult === "success") {
    result.progress += 1;

    if (result.progress >= maxRepetitions[result.repetitionPeriod]) {
      result.repetitionPeriod = getNextRepetitionPeriod(
        result.repetitionPeriod
      );
    }

    result.nextRepetitionDate = getNextRepetitionDate(result.repetitionPeriod);
  }

  console.log(result);

  return result;
}

function getNextRepetitionPeriod(current: RepetitionPeriod): RepetitionPeriod {
  const map: Record<RepetitionPeriod, RepetitionPeriod> = {
    daily: "weekly",
    weekly: "monthly",
    monthly: "monthly",
  };

  return map[current];
}

function getNextRepetitionDate(period: RepetitionPeriod): Date {
  const map: Record<RepetitionPeriod, string> = {
    daily: "days",
    monthly: "months",
    weekly: "weeks",
  };

  return DateTime.utc()
    .plus({ [map[period]]: 1 })
    .toJSDate();
}
