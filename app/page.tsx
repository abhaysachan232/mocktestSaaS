import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Coaching SaaS</h1>

          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 border rounded-lg">
              Login
            </Link>

            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-5xl font-bold mb-6">Online Mock Test Platform</h2>

        <p className="text-gray-600 text-lg mb-8">
          Coaching institutes ke liye complete SaaS platform
        </p>

        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl"
          >
            Dashboard
          </Link>

          <Link
            href="/admin-login"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl"
          >
            Admin
          </Link>
        </div>
      </section>
    </main>
  );
}
