"use client";

import {
  Timer,
  BarChart3,
  Trophy,
  Smartphone,
  ShieldCheck,
  Shuffle,
  FileQuestion,
  Users,
  Target,
  Zap,
  BookmarkCheck,
  Brain,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: FileQuestion,
    title: "Smart Test Engine",
    description:
      "Create and conduct powerful mock tests with flexible questions, sections, subjects and difficulty levels.",
    points: [
      "Multiple choice questions",
      "Section-wise tests",
      "Random questions",
      "Difficulty-based tests",
    ],
  },
  {
    icon: Timer,
    title: "Advanced Test Timer",
    description:
      "Accurate countdown timer that helps students manage their exam time effectively.",
    points: [
      "Auto countdown",
      "Time alerts",
      "Auto submit",
      "Section timing support",
    ],
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description:
      "Understand student performance with detailed reports and actionable insights.",
    points: [
      "Score analysis",
      "Accuracy tracking",
      "Time analysis",
      "Subject-wise performance",
    ],
  },
  {
    icon: Trophy,
    title: "Leaderboard",
    description:
      "Motivate students with real-time rankings and competitive performance tracking.",
    points: [
      "Global ranking",
      "Test-wise ranking",
      "Top performers",
      "Score comparison",
    ],
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description:
      "A smooth test-taking experience across mobile, tablet and desktop devices.",
    points: [
      "Responsive UI",
      "Touch friendly",
      "Mobile navigation",
      "Fast loading",
    ],
  },
  {
    icon: Shuffle,
    title: "Randomization",
    description:
      "Generate unique test experiences by randomizing questions and options.",
    points: [
      "Random questions",
      "Random options",
      "Question pools",
      "Unique attempts",
    ],
  },
  {
    icon: BookmarkCheck,
    title: "Question Bookmarking",
    description:
      "Allow students to bookmark questions and revisit them before submitting.",
    points: [
      "Mark for review",
      "Bookmarked questions",
      "Quick navigation",
      "Review before submit",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Secure Testing",
    description:
      "Build a reliable examination environment with controlled test sessions.",
    points: [
      "Protected sessions",
      "Auto save answers",
      "Submit confirmation",
      "Attempt tracking",
    ],
  },
  {
    icon: Users,
    title: "Student Management",
    description:
      "Manage students, attempts and performance from a centralized dashboard.",
    points: [
      "Student profiles",
      "Test history",
      "Attempt tracking",
      "Performance reports",
    ],
  },
  {
    icon: Target,
    title: "Performance Tracking",
    description:
      "Track progress over multiple tests and identify strengths and weaknesses.",
    points: [
      "Progress tracking",
      "Weak subjects",
      "Strong subjects",
      "Performance trends",
    ],
  },
  {
    icon: Zap,
    title: "High Performance",
    description:
      "Optimized architecture designed for fast and smooth mock test experiences.",
    points: [
      "Fast navigation",
      "Optimized rendering",
      "Minimal UI delay",
      "Scalable architecture",
    ],
  },
  {
    icon: Brain,
    title: "Practice & Learning",
    description:
      "Go beyond tests with practice sessions designed to improve knowledge and accuracy.",
    points: [
      "Practice mode",
      "Topic-wise tests",
      "Instant results",
      "Answer review",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-24 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              <Zap className="h-4 w-4" />
              Powerful Mock Test Platform
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Build Better Tests
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A complete mock test SaaS platform for coaching institutes,
              educators and students. Create tests, manage students and
              analyze performance from one place.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/tests"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
              >
                Explore Tests
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["100%", "Responsive"],
            ["24/7", "Test Access"],
            ["Fast", "Performance"],
            ["360°", "Analytics"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="border-b border-slate-100 p-6 text-center last:border-0 sm:border-r lg:border-b-0"
            >
              <div className="text-2xl font-bold text-blue-600">{value}</div>
              <div className="mt-1 text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Platform Features
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything for a complete
            <span className="text-blue-600"> testing experience</span>
          </h2>

          <p className="mt-4 text-slate-600">
            Powerful features for test creators, coaching institutes and
            students.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 transition group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-5 space-y-2.5">
                  {feature.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-14 text-center shadow-2xl shadow-blue-500/20 sm:px-12">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to build better mock tests?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-blue-100">
              Start creating powerful tests and give your students a better
              examination experience.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Start Building Tests
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}