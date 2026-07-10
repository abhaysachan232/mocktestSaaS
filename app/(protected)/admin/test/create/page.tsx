"use client";

import CreateTestForm from "@/components/adminTest/createTest/CreateTestForm";

export default function CreateTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            Create Mock Test
          </h1>

          <p className="text-slate-500 mt-2">
            Create a test blueprint. Questions will automatically be fetched
            from the Question Bank according to selected topics.
          </p>
        </div>

        <CreateTestForm />

      </div>
    </div>
  );
}