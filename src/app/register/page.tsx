"use client";

import Link from "next/link";

import { useState } from "react";

import { useRouter }
from "next/navigation";

export default function RegisterPage() {
  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  const exams = [
    "SSC CGL",
    "SSC GD",
    "SSC CHSL",
    "SSC MTS",
    "Railway Group D",
    "Railway NTPC",
    "Railway ALP",
    "UP Police",
    "Bihar Police",
    "Delhi Police",
    "UPSI",
    "Constable",
    "Bank PO",
    "Bank Clerk",
    "CTET",
    "Super TET",
  ];

  const [formData, setFormData] =
    useState({
      name: "",

      email: "",

      mobile: "",

      password: "",

      course: "",

      couponCode: "",
    });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("FORM SUBMITTED");
  try {
    setLoading(true);

    const response = await fetch(
      "/api/register",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          formData
        ),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      alert(data.error);

      return;
    }

    alert(
      "Registration Successful 🚀"
    );

    router.push("/login");
  } catch (error) {
    console.log(error);

    alert(
      "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8 border">

        {/* Heading */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-purple-600">
            Create Account
          </h1>

          <p className="text-gray-500 mt-3">
            Start your exam
            preparation today
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >

          {/* Name */}
          <div>
            <label className="text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              placeholder="Enter full name"
              className="w-full mt-2 p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="Enter email"
              className="w-full mt-2 p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="text-sm font-medium">
              Mobile Number
            </label>

            <input
              type="tel"
              name="mobile"
              value={
                formData.mobile
              }
              onChange={
                handleChange
              }
              placeholder="Enter mobile number"
              className="w-full mt-2 p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Course */}
          <div>
            <label className="text-sm font-medium">
              Select Course
            </label>

            <select
              name="course"
              value={
                formData.course
              }
              onChange={
                handleChange
              }
              className="w-full mt-2 p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">
                Select Course
              </option>

              {exams.map(
                (exam) => (
                  <option
                    key={exam}
                    value={exam}
                  >
                    {exam}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Referral Coupon */}
          <div>
            <label className="text-sm font-medium">
              Coaching Coupon
              Code
            </label>

            <input
              type="text"
              name="couponCode"
              value={
                formData.couponCode
              }
              onChange={
                handleChange
              }
              placeholder="Enter referral code"
              className="w-full mt-2 p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 uppercase"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              placeholder="Enter password"
              className="w-full mt-2 p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-semibold transition disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {/* Login */}
        <p className="text-center text-gray-500 mt-6 text-sm">

          Already have an
          account?{" "}

          <Link
            href="/login"
            className="text-purple-600 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}