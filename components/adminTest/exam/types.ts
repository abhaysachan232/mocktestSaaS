export interface TopicForm {
  name: string;
  code: string;
}

export interface SubjectForm {
  name: string;
  code: string;
  topics: TopicForm[];
}

export interface ExamFormValues {
  name: string;
  code: string;
  subjects: SubjectForm[];
}