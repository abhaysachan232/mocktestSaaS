export interface TestBasicInfo {
  testName: string;
  language: "Hindi" | "English" | "Bilingual";
}

export interface TopicSelection {
  topic: string;
  questionCount: number;
}

export interface SubjectSelection {
  subject: string;
  topics: TopicSelection[];
}

export interface CreateTestPayload {
  testName: string;
  language: string;
  subjects: SubjectSelection[];
}

export type TopicCountState = Record<
  string,
  Record<string, number>
>;