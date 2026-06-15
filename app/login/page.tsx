"use client";

import { useState } from "react";

import axios from "axios";

import { useRouter } from "next/navigation";

import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response =
        await axios.post(
          "/api/login",
          formData
        );

      if (
        response.data.success
      ) {
        alert(
          response.data.message
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );

        router.push(
          "/dashboard"
        );
      }
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) &&
        error.response?.data?.error
          ? error.response.data.error
          : "Login Failed";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={
              formData.email
            }
            onChange={handleChange}
            className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={
              formData.password
            }
            onChange={handleChange}
            className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-4 rounded-2xl font-semibold"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Don&apos;t have an
          account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}