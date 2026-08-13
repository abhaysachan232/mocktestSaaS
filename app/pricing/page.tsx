"use client";

import {
  Check,
  X,
  Zap,
  Crown,
  Building2,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    description: "For students getting started",
    icon: Zap,
    price: "₹0",
    period: "forever",
    popular: false,
    button: "Get Started",
    features: [
      "5 Mock Tests / month",
      "Up to 50 questions per test",
      "Basic test timer",
      "Instant test results",
      "Basic performance report",
      "Question bookmarking",
      "Mobile responsive",
    ],
    unavailable: [
      "Advanced analytics",
      "Leaderboard",
      "Custom test creation",
      "Student management",
    ],
  },
  {
    name: "Pro",
    description: "For serious students & educators",
    icon: Crown,
    price: "₹299",
    period: "per month",
    popular: true,
    button: "Start Pro",
    features: [
      "Unlimited Mock Tests",
      "Unlimited questions",
      "Advanced test timer",
      "Detailed performance analytics",
      "Subject-wise analysis",
      "Leaderboard",
      "Question randomization",
      "Custom test creation",
      "Question bookmarking",
      "Test history",
      "Priority support",
    ],
    unavailable: [
      "Institute dashboard",
      "Bulk student management",
    ],
  },
  {
    name: "Institute",
    description: "For coaching institutes & teams",
    icon: Building2,
    price: "₹999",
    period: "per month",
    popular: false,
    button: "Contact Sales",
    features: [
      "Everything in Pro",
      "Unlimited students",
      "Institute dashboard",
      "Student management",
      "Batch management",
      "Custom tests",
      "Advanced analytics",
      "Student performance reports",
      "Institute leaderboard",
      "Bulk question import",
      "Export reports",
      "Priority support",
    ],
    unavailable: [],
  },
];

const faqs = [
  {
    question: "Can I use the platform for free?",
    answer:
      "Yes. The Free plan lets students take up to 5 mock tests per month without any payment.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Yes. You can upgrade from Free to Pro or Institute whenever you need more features.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes. Pro and Institute subscriptions can be cancelled according to the applicable billing terms.",
  },
  {
    question: "Does Pro support unlimited tests?",
    answer:
      "Yes. Pro users can create and take unlimited mock tests subject to the platform's fair-use limits.",
  },
  {
    question: "Which plan is best for coaching institutes?",
    answer:
      "The Institute plan is designed specifically for coaching institutes that need student, batch and performance management.",
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-20 text-center sm:px-6 lg:px-8 lg:pt-24">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
            <Zap className="h-4 w-4" />
            Simple & Transparent Pricing
          </div>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Choose the plan that
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              fits your needs
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Start for free and upgrade when you need more powerful mock test
            and analytics features.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                billing === "monthly"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBilling("yearly")}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                billing === "yearly"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              Yearly
              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;

            const yearlyPrice =
              plan.name === "Free"
                ? "₹0"
                : plan.name === "Pro"
                  ? "₹239"
                  : "₹799";

            return (
              <div
                key={plan.name}
                className={`relative rounded-3xl border bg-white p-7 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  plan.popular
                    ? "border-blue-500 shadow-blue-100 lg:scale-[1.03]"
                    : "border-slate-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      plan.popular
                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {plan.name}
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {plan.description}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-7 flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {billing === "yearly" ? yearlyPrice : plan.price}
                  </span>

                  {plan.name !== "Free" && (
                    <span className="mb-1 text-sm text-slate-500">
                      / month
                    </span>
                  )}
                </div>

                {billing === "yearly" && plan.name !== "Free" && (
                  <p className="mt-2 text-xs font-medium text-green-600">
                    Billed annually
                  </p>
                )}

                {/* Button */}
                <Link
                  href={
                    plan.name === "Institute" ? "/contact" : "/register"
                  }
                  className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold transition ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {plan.button}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Features */}
                <div className="mt-8 border-t border-slate-100 pt-7">
                  <p className="mb-4 text-sm font-bold text-slate-900">
                    What's included
                  </p>

                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 text-sm text-slate-600"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}

                    {plan.unavailable.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 text-sm text-slate-400"
                      >
                        <X className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 p-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Compare plans
            </h2>
            <p className="mt-2 text-slate-500">
              Find the right features for your testing platform.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4 text-sm font-bold text-slate-700">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-blue-600">
                    Pro
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                    Institute
                  </th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["Mock Tests", "5 / month", "Unlimited", "Unlimited"],
                  ["Questions", "250 / month", "Unlimited", "Unlimited"],
                  ["Analytics", "Basic", "Advanced", "Advanced"],
                  ["Leaderboard", "—", "✓", "✓"],
                  ["Student Management", "—", "—", "✓"],
                  ["Batch Management", "—", "—", "✓"],
                  ["Custom Tests", "—", "✓", "✓"],
                  ["Bulk Import", "—", "—", "✓"],
                  ["Performance Reports", "Basic", "Advanced", "Advanced"],
                  ["Support", "Community", "Priority", "Priority"],
                ].map(([feature, free, pro, institute]) => (
                  <tr
                    key={feature}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {feature}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-500">
                      {free}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600">
                      {pro}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">
                      {institute}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <HelpCircle className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-3xl font-bold text-slate-900">
            Frequently asked questions
          </h2>

          <p className="mt-2 text-slate-500">
            Everything you need to know about our plans.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <summary className="cursor-pointer list-none font-semibold text-slate-900">
                <div className="flex items-center justify-between gap-4">
                  {faq.question}

                  <span className="text-xl text-slate-400 transition group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-14 text-center shadow-2xl shadow-blue-500/20 sm:px-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Start your mock test journey today
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Create tests, practice smarter and track performance with one
            powerful platform.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-700 shadow-lg transition hover:-translate-y-0.5"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}