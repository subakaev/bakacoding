import { Dictionary } from "types/Dictionary";
import { Answer, Grade, InterviewQuestionSet } from "types/interview";

const getGradeIcon = (grade: Grade | null): string => {
  switch (grade) {
    case "solved":
      return "✅";
    case "average":
      return "➕➖";
    case "failed":
      return "❌";
    default:
      return "";
  }
};

export const generateInterviewResult = (
  questionSets: InterviewQuestionSet[],
  answers: Dictionary<Answer>
): string => {
  const rows = [];

  for (const questionSet of questionSets) {
    rows.push(questionSet.name);
    rows.push("");
    for (const question of questionSet.questions) {
      const answer = answers[question.id];

      if (answer?.grade) {
        rows.push(
          `${question.question} (${answer.grade} ${getGradeIcon(
            answer.grade
          )})\n${answer.comment}\n`
        );
      }
    }
    rows.push("");
  }

  return rows.join("\n");
};
