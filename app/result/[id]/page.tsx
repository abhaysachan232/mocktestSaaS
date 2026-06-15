export default function ResultPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-[600px] text-center">
        <h1 className="text-5xl font-bold mb-10">
          Test Result
        </h1>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-2xl">
            <p className="text-gray-500">
              Score
            </p>

            <h2 className="text-5xl font-bold text-blue-600 mt-3">
              82%
            </h2>
          </div>

          <div className="bg-green-50 p-6 rounded-2xl">
            <p className="text-gray-500">
              Rank
            </p>

            <h2 className="text-5xl font-bold text-green-600 mt-3">
              #12
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}