import SubjectForm from "@/components/subjects/SubjectForm";

export default function CreateSubjectPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Create Subject</h1>
        <p className="text-sm text-gray-500">Create a new subject.</p>
      </div>

      <SubjectForm />
    </div>
  );
}
