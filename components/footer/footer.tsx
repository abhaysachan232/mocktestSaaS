import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white ">

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">

        <div>
          <h2 className="text-2xl font-bold mb-4">
            Coaching SaaS
          </h2>

          <p className="text-slate-400">
            Complete Online Coaching Management Platform with
            Mock Tests, Student Portal, Analytics &
            Payment Integration.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Product
          </h3>

          <div className="space-y-2 text-slate-400">
            <Link href="/features" className="block">Features</Link>
            <Link href="/pricing" className="block">Pricing</Link>
            <Link href="/demo" className="block">Demo</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Company
          </h3>

          <div className="space-y-2 text-slate-400">
            <Link href="/about" className="block">About</Link>
            <Link href="/contact" className="block">Contact</Link>
            <Link href="/privacy-policy" className="block">Privacy Policy</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Newsletter
          </h3>

          <div className="flex">
            <input
              placeholder="Email"
              className="flex-1 rounded-l-xl px-4 py-3 text-black"
            />

            <button className="bg-blue-600 px-5 rounded-r-xl">
              Join
            </button>
          </div>
        </div>

      </div>

      <div className="border-t border-slate-800 py-5 text-center text-slate-400">
        © 2026 Coaching SaaS. All rights reserved.
      </div>

    </footer>
  );
}