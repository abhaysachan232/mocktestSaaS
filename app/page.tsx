import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Users,
  Trophy,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
          <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
            🚀 Complete SaaS for Coaching Institutes
          </span>

          <h1 className="mt-8 text-6xl font-extrabold leading-tight">
            Online Mock Test
            <br />
            Management Platform
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-blue-100">
            Conduct exams, manage students, generate reports,
            accept payments and grow your coaching business with
            one powerful platform.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-white px-7 py-4 font-semibold text-blue-700 shadow-lg transition hover:scale-105"
            >
              Start Free
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl border border-white/40 px-7 py-4 transition hover:bg-white/10"
            >
              Live Demo
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Everything You Need
          </h2>

          <p className="mt-4 text-gray-500">
            Powerful tools to run your coaching institute efficiently.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BookOpen,
              title: "Mock Tests",
              desc: "Unlimited online exams with timer and auto evaluation.",
            },
            {
              icon: Users,
              title: "Student Management",
              desc: "Manage thousands of students in one dashboard.",
            },
            {
              icon: Trophy,
              title: "Leaderboards",
              desc: "Rank students and boost competition.",
            },
            {
              icon: BarChart3,
              title: "Analytics",
              desc: "Detailed reports and performance insights.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <item.icon className="h-12 w-12 text-blue-600" />
              <h3 className="mt-6 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 text-center md:grid-cols-4">
          <div>
            <h3 className="text-5xl font-bold">100K+</h3>
            <p className="mt-2 text-slate-400">Students</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold">500+</h3>
            <p className="mt-2 text-slate-400">Institutes</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold">2M+</h3>
            <p className="mt-2 text-slate-400">Tests Taken</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold">99.9%</h3>
            <p className="mt-2 text-slate-400">Uptime</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <h2 className="text-5xl font-bold">
          Ready to Grow Your Coaching?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-gray-500">
          Launch your own branded online test platform in minutes.
        </p>

        <Link
          href="/register"
          className="mt-10 inline-block rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-105"
        >
          Get Started Free
        </Link>
      </section>
    </main>
  );
}