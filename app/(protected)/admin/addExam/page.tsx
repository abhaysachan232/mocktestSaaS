import ExamForm from "@/components/adminTest/exam/ExamForm";
import { BookOpen } from "lucide-react";

export default function CreateExamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-8">

          <div className="flex items-center gap-4">

            <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
              <BookOpen size={28} />
            </div>

            <div>

              <h1 className="text-3xl font-bold text-slate-800">
                Create Exam
              </h1>

              <p className="text-slate-500 mt-1">
                Create an exam with multiple subjects and topics.
              </p>

            </div>

          </div>

        </div>

        <ExamForm />

      </div>

    </div>
  );
}