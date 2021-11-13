import { Entry } from "contentful";

export enum Difficulty {
  All = "All",
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export interface CodingCardSolutionFields {
  solution: string;
  spaceComplexity: string;
  timeComplexity: string;
  title: string;
}

export interface CodingCardFields {
  description: string;
  difficulty: Difficulty;
  hints: string[];
  link: string;
  slug: string;
  solutions: Entry<CodingCardSolutionFields>[];
  title: string;
}
