"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  Ticket,
  UserCircle2,
  X,
} from "lucide-react";

import { joinCoachingByCode } from "@/actions/coaching.actions";
import LogOutButton from "../../ui/LogOutButton";

interface StudentProps {
  name: string;
  dob: Date;
  mobile: string;
  email: string;
}

interface CoachingProps {
  logo: string;
  name: string;
  mobile: string;
  address: string;
}

export interface ProfileProps {
  student: StudentProps;
  coachings: CoachingProps[];
}

export default function ProfileComponent({ student, coachings }: ProfileProps) {
  const router = useRouter();

  const [coachingCode, setCoachingCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(student.name || "");
  const [mobile, setMobile] = useState(student.mobile || "");

  const handleJoinCoaching = () => {
    const code = coachingCode.trim();

    setMessage("");
    setError("");

    if (!code) {
      setError("Please enter a coaching code.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await joinCoachingByCode(code);

        if (!response?.success) {
          setError(
            response?.error || response?.message || "Unable to join coaching.",
          );
          return;
        }

        setMessage(
          response.message || "You have successfully joined the coaching.",
        );

        setCoachingCode("");

        window.location.reload();
      } catch (err) {
        console.error("JOIN_COACHING_ERROR:", err);
        setError("Something went wrong while joining the coaching.");
      }
    });
  };

  const handleEdit = () => {
    setName(student.name || "");
    setMobile(student.mobile || "");
    setIsEditing(true);
    setError("");
    setMessage("");
  };

  const handleCancelEdit = () => {
    setName(student.name || "");
    setMobile(student.mobile || "");
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!mobile.trim()) {
      setError("Please enter your mobile number.");
      return;
    }

    /*
     * Add your update student server action here.
     */

    setIsEditing(false);
    setMessage("Profile updated successfully.");
    router.refresh();
  };

  const studentInitial = student.name?.trim()?.charAt(0)?.toUpperCase() || "S";

  return (
    <div className="space-y-6 pb-8">
      {/* Profile Header */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-indigo-600 to-violet-600" />

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            {/* Avatar */}
            <div className="flex h-28 w-28 shrink-0 items-center justify-center self-center rounded-full border-4 border-white/80 bg-white text-4xl font-bold text-blue-600 shadow-xl sm:h-32 sm:w-32 lg:self-auto">
              {studentInitial}
            </div>

            {/* Student Info */}
            <div className="min-w-0 flex-1 text-center lg:text-left">
              <div className="flex flex-col items-center gap-2 lg:flex-row">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {student.name}
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur">
                  <BadgeCheck size={15} />
                  Verified
                </span>
              </div>

              <p className="mt-2 flex items-center justify-center gap-2 text-sm text-blue-100 lg:justify-start">
                <Mail size={16} />
                {student.email}
              </p>

              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/90">
                Manage your personal information and coaching access from your
                student profile.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
              >
                <Pencil size={17} />
                Edit Profile
              </button>

              <LogOutButton />
            </div>
          </div>
        </div>
      </section>

      {/* Edit Profile */}
      {isEditing && (
        <section className="rounded-3xl border border-blue-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-7">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Edit Profile</h2>

              <p className="mt-1 text-sm text-slate-500">
                Update your basic student information.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close edit profile"
            >
              <X size={19} />
            </button>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-7">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <div className="relative">
                <UserCircle2
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your name"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Mobile Number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="tel"
                  value={mobile}
                  onChange={(event) => setMobile(event.target.value)}
                  placeholder="Enter mobile number"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={student.email}
                  disabled
                  className="h-12 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-500 outline-none"
                />
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Email address cannot be changed.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-end gap-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="h-12 flex-1 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveProfile}
                className="h-12 flex-1 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>

          {error && (
            <div className="mx-6 mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-7">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </section>
      )}

      {/* Personal Information */}
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserCircle2 size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Personal Information
              </h2>

              <p className="text-sm text-slate-500">
                Your registered student information
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProfileItem
            icon={<UserCircle2 size={20} />}
            iconClass="bg-blue-50 text-blue-600"
            label="Full Name"
            value={student.name || "Not available"}
          />

          <ProfileItem
            icon={<Mail size={20} />}
            iconClass="bg-indigo-50 text-indigo-600"
            label="Email Address"
            value={student.email || "Not available"}
          />

          <ProfileItem
            icon={<Phone size={20} />}
            iconClass="bg-emerald-50 text-emerald-600"
            label="Mobile Number"
            value={student.mobile || "Not available"}
          />
        </div>
      </section>

      {/* Coaching Access */}
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Building2 size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Coaching Access
                </h2>

                <p className="text-sm text-slate-500">
                  Manage your coaching institute access
                </p>
              </div>
            </div>

            {coachings.length > 0 && (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 size={15} />
                {coachings.length}{" "}
                {coachings.length === 1 ? "Coaching" : "Coachings"} Joined
              </span>
            )}
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-7">
          {/* Joined Coachings */}
          {coachings.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {coachings.map((coaching, index) => (
                <div
                  key={`${coaching.name}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
                >
                  <div className="flex gap-4">
                    {/* Logo */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                      {coaching.logo ? (
                        <Image
                          src={coaching.logo}
                          alt={coaching.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Building2 size={27} className="text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="truncate text-lg font-bold text-slate-900">
                          {coaching.name}
                        </h3>

                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 size={12} />
                          Active
                        </span>
                      </div>

                      {coaching.address && (
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                          {coaching.address}
                        </p>
                      )}

                      {coaching.mobile && (
                        <p className="mt-1 text-xs text-slate-500">
                          {coaching.mobile}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5">
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-emerald-600"
                    />

                    <p className="text-xs font-medium text-emerald-700">
                      Published tests are available.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Join Coaching */}
          <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-indigo-50 p-5 sm:p-6">
            <div className="mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                  <Ticket size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">Join Coaching</h3>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Enter the unique code provided by your coaching institute.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Ticket
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={coachingCode}
                  onChange={(event) => {
                    setCoachingCode(event.target.value.toUpperCase());
                    setError("");
                    setMessage("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleJoinCoaching();
                    }
                  }}
                  placeholder="Enter coaching code"
                  disabled={isPending}
                  autoComplete="off"
                  spellCheck={false}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-900 outline-none transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              <button
                type="button"
                onClick={handleJoinCoaching}
                disabled={isPending || !coachingCode.trim()}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {isPending ? (
                  "Joining..."
                ) : (
                  <>
                    <Building2 size={18} />
                    Join Coaching
                  </>
                )}
              </button>
            </div>

            {error && !isEditing && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={15} />
              <span>Only use a coaching code provided by your institute.</span>
            </div>
          </div>

          {/* No Coaching */}
          {coachings.length === 0 && (
            <div className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                <Building2 size={24} />
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  No coaching joined yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Join your coaching using the code provided by your institute.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Account Status */}
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Account Status
              </h2>

              <p className="text-sm text-slate-500">
                Current status of your student account
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-7">
          <StatusItem
            icon={<CheckCircle2 size={21} />}
            iconClass="bg-emerald-50 text-emerald-600"
            label="Account Status"
            value="Active"
            valueClass="text-emerald-700"
          />

          <StatusItem
            icon={<BadgeCheck size={21} />}
            iconClass="bg-blue-50 text-blue-600"
            label="Verification"
            value="Verified"
            valueClass="text-blue-700"
          />
        </div>
      </section>
    </div>
  );
}

interface ProfileItemProps {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string;
}

function ProfileItem({ icon, iconClass, label, value }: ProfileItemProps) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

interface StatusItemProps {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string;
  valueClass: string;
}

function StatusItem({
  icon,
  iconClass,
  label,
  value,
  valueClass,
}: StatusItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">{label}</p>

        <p className={`mt-0.5 font-bold ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}
