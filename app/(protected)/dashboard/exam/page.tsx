import { getExams } from "@/actions/exam";

export default async function ExamPage() {
  const exams = await getExams();

  return (
    <div>
      {exams.map((exam) => (
        <div key={exam.id}>
          <h2>{exam.name}</h2>
          <p>{exam.totalMarks}</p>
        </div>
      ))}
    </div>
  );
}
