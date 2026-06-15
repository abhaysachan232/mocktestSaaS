export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white p-8 rounded-3xl shadow max-w-4xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">
            SSC Mock Test
          </h1>

          <div className="bg-red-100 text-red-600 px-5 py-2 rounded-xl font-bold">
            59:20
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-500 mb-3">
            Question 1
          </p>

          <h2 className="text-2xl font-semibold">
            भारत की राजधानी क्या है?
          </h2>
        </div>

        <div className="space-y-4">
          {[
            "दिल्ली",
            "मुंबई",
            "कोलकाता",
            "चेन्नई",
          ].map((option) => (
            <button
              key={option}
              className="w-full border p-5 rounded-2xl hover:bg-blue-50 text-left"
            >
              {option}
            </button>
          ))}
        </div>

        <button className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-2xl">
          Next Question
        </button>
      </div>
    </div>
  );
}