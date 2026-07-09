"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, GraduationCap } from "lucide-react";
import { useSession } from "next-auth/react";
import LogOutButton from "../ui/LogOutButton";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <GraduationCap size={26} />
          </div>

          <div>
            <h1 className="text-xl font-bold sm:text-2xl">
              Coaching SaaS
            </h1>

            <p className="hidden text-sm text-gray-500 sm:block">
              Online Mock Test Platform
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 lg:flex">
          <nav className="flex gap-8 font-medium">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>

            <Link href="/features" className="hover:text-blue-600">
              Features
            </Link>

            <Link href="/pricing" className="hover:text-blue-600">
              Pricing
            </Link>

            <Link href="/contact" className="hover:text-blue-600">
              Contact
            </Link>
          </nav>

          {session?.user ? (
            <LogOutButton />
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-xl border px-5 py-2 transition hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-white transition hover:opacity-90"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile / Tablet Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          isOpen ? "max-h-[500px] border-t" : "max-h-0"
        }`}
      >
        <div className="space-y-4 bg-white px-6 py-5 shadow-md">
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

          {session?.user ? (
            <div
              onClick={() => setIsOpen(false)}
              className="flex justify-center"
            >
              <LogOutButton />
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-xl border py-3 text-center"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-center text-white"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}