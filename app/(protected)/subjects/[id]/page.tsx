import { notFound } from "next/navigation";
import { getSubject } from "@/actions/subject.actions";
import TopicManager from "@/components/subjects/TopicManager";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SubjectPage({ params }: Props) {
  const { id } = await params;
  const result = await getSubject(id);

  if (!result.success) {
    notFound();
  }

  const subject = result.data;

  return (
    <div className="space-y-6 p-6">
      {/* Subject Header */}

      <div>
        <h1 className="text-2xl font-semibold">{subject.name}</h1>
        <p className="text-sm text-gray-500">{subject._count.topics} Topics</p>
      </div>

      {/* Topics */}

      <div>
        <h2 className="mb-4 text-lg font-semibold">Topics</h2>
        <TopicManager subjectId={subject.id} topics={subject.topics} />
      </div>
    </div>
  );
}
