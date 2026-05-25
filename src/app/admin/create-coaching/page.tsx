"use client";

import Link from "next/link";

import Image from "next/image";

import { useState } from "react";

import {
  ArrowLeft,
  Building2,
} from "lucide-react";

export default function CreateCoachingPage() {
  const [loading, setLoading] =
    useState(false);

  const [logo, setLogo] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      couponCode: "",
      commission: 27,
    });

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // Upload Logo Base64
  const handleLogoUpload =
    async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      try {
        const reader =
          new FileReader();

        reader.readAsDataURL(
          file
        );

        reader.onloadend =
          () => {
            const base64 =
              reader.result as string;

            setLogo(base64);
          };
      } catch (error) {
        console.log(error);

        alert(
          "Logo upload failed"
        );
      }
    };

  // Submit
const handleSubmit =
  async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/admin/create-coaching",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials:
            "include",

          body: JSON.stringify({
            ...formData,

            role: "owner",

            logo,
          }),
        }
      );

      const data =
        await res.json();

      if (data.success) {
        alert(
          "Coaching Created Successfully 🚀"
        );

        setFormData({
          name: "",
          email: "",
          password: "",
          couponCode: "",
          commission: 27,
        });

        setLogo("");
      } else {
        alert(data.message);
      }
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-6 md:p-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">

          {/* Back Button */}
          <Link
            href="/admin"
            className="bg-gray-200 hover:bg-gray-300 p-3 rounded-2xl"
          >
            <ArrowLeft
              size={20}
            />
          </Link>

          {/* Title */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Create Coaching
            </h1>

            <p className="text-gray-500 mt-2">
              Create coaching
              login and coupon
              system
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Coaching Name */}
          <input
            type="text"
            name="name"
            placeholder="Coaching Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-4 rounded-2xl outline-none"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="border p-4 rounded-2xl outline-none"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border p-4 rounded-2xl outline-none"
          />

          {/* Coupon Code */}
          <input
            type="text"
            name="couponCode"
            placeholder="Coupon Code"
            value={
              formData.couponCode
            }
            onChange={handleChange}
            className="border p-4 rounded-2xl outline-none uppercase"
          />

          {/* Commission */}
          <input
            type="number"
            name="commission"
            placeholder="Commission %"
            value={
              formData.commission
            }
            onChange={handleChange}
            className="border p-4 rounded-2xl outline-none"
          />

          {/* Upload Logo */}
          <div className="border rounded-2xl p-4">

            <label className="block text-sm font-medium mb-3">
              Upload Coaching
              Logo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleLogoUpload
              }
            />

            {/* Preview */}
            {logo && (
              <div className="mt-5">

                <Image
                  src={logo}
                  alt="logo"
                  width={100}
                  height={100}
                  className="rounded-2xl border object-cover h-24 w-24"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black hover:bg-gray-900 text-white py-4 rounded-2xl mt-10 text-lg font-medium flex justify-center items-center gap-2"
        >
          <Building2
            size={20}
          />

          {loading
            ? "Creating..."
            : "Create Coaching"}
        </button>
      </div>
    </div>
  );
}