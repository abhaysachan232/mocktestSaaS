import { notFound } from "next/navigation";
import { getSubject } from "@/actions/subject.actions";
import SubjectForm from "@/components/subjects/SubjectForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditSubjectPage({ params }: Props) {
  const { id } = await params;
  const result = await getSubject(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Subject</h1>
      </div>

      <SubjectForm
        subject={{
          id: result.data.id,
          name: result.data.name,
        }}
      />
    </div>
  );
}
