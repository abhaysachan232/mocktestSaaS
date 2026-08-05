"use client";

import Image from "next/image";
import {
  Mail,
  Phone,
  GraduationCap,
  ShieldCheck,
  Building2,
  Ticket,
  UserCircle2,
  BadgeCheck,
} from "lucide-react";

import { Profile } from "./types";

interface Props {
  profile: Profile | null;
}

export default function ProfileComponent({ profile }: Props) {
  if (!profile) {
    return (
      <div className="rounded-[32px] bg-white border border-slate-100 shadow-[0_25px_80px_rgba(0,0,0,0.08)] p-16 text-center">
        <UserCircle2 size={70} className="mx-auto text-blue-600" />

        <h2 className="mt-6 text-3xl font-bold text-slate-900">
          Profile Not Found
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero */}

      <div className="rounded-[32px] overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl">
        <div className="bg-[url('/grid.svg')] bg-cover">
          <div className="px-10 py-12 flex flex-col lg:flex-row items-center gap-8">
            <div className="h-36 w-36 rounded-full bg-white flex items-center justify-center text-6xl font-bold text-blue-600 shadow-xl border-8 border-white">
              {profile.name?.charAt(0)}
            </div>

            <div className="text-white flex-1">
              <h1 className="text-5xl font-bold">{profile.name}</h1>

              <p className="mt-3 text-blue-100 text-lg">{profile.email}</p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2">
                <BadgeCheck size={18} />
                Verified Student
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Personal */}

        <div className="rounded-[32px] bg-white border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">
          <h2 className="text-2xl font-bold mb-8">Personal Details</h2>

          <div className="space-y-6">
            <div className="flex items-center gap-5 rounded-2xl bg-slate-50 p-5">
              <Mail className="text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">Email</p>

                <h3 className="font-semibold">{profile.email}</h3>
              </div>
            </div>

            <div className="flex items-center gap-5 rounded-2xl bg-slate-50 p-5">
              <Phone className="text-green-600" />

              <div>
                <p className="text-sm text-slate-500">Mobile</p>

                <h3 className="font-semibold">{profile.mobile}</h3>
              </div>
            </div>

            <div className="flex items-center gap-5 rounded-2xl bg-slate-50 p-5">
              <GraduationCap className="text-purple-600" />

              <div>
                <p className="text-sm text-slate-500">Course</p>

                <h3 className="font-semibold capitalize">{profile.course}</h3>
              </div>
            </div>

            <div className="flex items-center gap-5 rounded-2xl bg-slate-50 p-5">
              <ShieldCheck className="text-indigo-600" />

              <div>
                <p className="text-sm text-slate-500">Role</p>

                <h3 className="font-semibold capitalize">{profile.role}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Coaching */}

        <div className="rounded-[32px] bg-white border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">
          <h2 className="text-2xl font-bold mb-8">Coaching Details</h2>

          {profile.coaching ? (
            <>
              <div className="flex items-center gap-5 mb-8">
                <Image
                  src={profile.coaching.logo}
                  alt={profile.coaching.name}
                  width={80}
                  height={80}
                  className="rounded-3xl border object-cover"
                />

                <div>
                  <h3 className="text-2xl font-bold">
                    {profile.coaching.name}
                  </h3>

                  <p className="text-slate-500">Partner Institute</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-5 rounded-2xl bg-slate-50 p-5">
                  <Building2 className="text-blue-600" />

                  <div>
                    <p className="text-sm text-slate-500">Institute</p>

                    <h3 className="font-semibold">{profile.coaching.name}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-5 rounded-2xl bg-slate-50 p-5">
                  <Ticket className="text-orange-600" />

                  <div>
                    <p className="text-sm text-slate-500">Coupon Code</p>

                    <h3 className="font-bold text-blue-600">
                      {profile.coaching.couponCode}
                    </h3>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-10 text-center">
              <Building2 size={60} className="mx-auto text-slate-400" />

              <h3 className="mt-5 text-xl font-bold">No Coaching Assigned</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
