export interface Expression {
  id: string;
  text: string;
  words: string[];
  whenToUse: {
    title: string;
    description?: string;
    images: string[];
  };
  situations: Situation[];
}

export interface Situation {
  id: string;
  titlePT: string;
  titleEN: string;
  descriptionPT: string;
  descriptionEN: string;
  contextPT: string;
  contextEN: string;
  answer: string[];
  answerColors: string[];
}

export interface UserProgress {
  currentTab: number;
  completedTabs: number[];
  writeProgress: number;
  dragDropAttempts: number;
}
