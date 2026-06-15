export default function LeaderboardPage() {
  const users = [
    {
      name: "Abhay",
      score: 95,
    },

    {
      name: "Rahul",
      score: 91,
    },

    {
      name: "Aman",
      score: 88,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-5xl font-bold mb-10">
          Leaderboard
        </h1>

        <div className="space-y-4">
          {users.map(
            (user, index) => (
              <div
                key={user.name}
                className="flex justify-between items-center border p-5 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                  <h2 className="text-xl font-semibold">
                    {user.name}
                  </h2>
                </div>

                <div className="text-2xl font-bold text-green-600">
                  {user.score}%
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}