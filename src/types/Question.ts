export interface Question {
  id: string;
  subjectId: string;
  levelId: string;
  topicId: string;
  text: string;
  options: string[];
  correctAnswer: string;
}
