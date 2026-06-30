"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, GraduationCap } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white">
            <GraduationCap size={28} />
          </div>

          <div>
            <h1 className="font-bold text-2xl">Coaching SaaS</h1>
            <p className="text-sm text-gray-500">
              Online Mock Test Platform
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex gap-8 font-medium">
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3">
          <Link
            href="/login"
            className="px-5 py-2 rounded-xl border hover:bg-gray-100"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 border-t" : "max-h-0"
        }`}
      >
        <div className="bg-white px-6 py-5 space-y-4 shadow-md">
          <Link
            href="/"
            className="block"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/features"
            className="block"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>

          <Link
            href="/pricing"
            className="block"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </Link>

          <Link
            href="/contact"
            className="block"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          <hr />

          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center border rounded-xl py-3"
          >
            Login
          </Link>

          <Link
            href="/register"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center rounded-xl py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}