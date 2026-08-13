"use client";

import { AlertTriangle, CheckCircle2, X } from "lucide-react";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;

  totalQuestions: number;
  attempted: number;
  unanswered: number;
  marked: number;
}

export default function SubmitModal({
  isOpen,
  onClose,
  onConfirm,
  totalQuestions,
  attempted,
  unanswered,
  marked,
}: SubmitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close submit dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-title"
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h2
                id="submit-title"
                className="text-base font-bold text-slate-900"
              >
                Submit Test?
              </h2>

              <p className="text-xs text-slate-500">
                Please review your attempt before submitting.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 p-5">
          <StatCard
            label="Total Questions"
            value={totalQuestions}
          />

          <StatCard
            label="Attempted"
            value={attempted}
            valueClassName="text-emerald-600"
          />

          <StatCard
            label="Unanswered"
            value={unanswered}
            valueClassName={
              unanswered > 0
                ? "text-red-600"
                : "text-emerald-600"
            }
          />

          <StatCard
            label="Marked for Review"
            value={marked}
            valueClassName={
              marked > 0
                ? "text-amber-600"
                : "text-slate-700"
            }
          />
        </div>

        {/* Warning */}
        {unanswered > 0 && (
          <div className="mx-5 mb-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <p className="text-xs leading-5 text-amber-800">
              You still have{" "}
              <strong>{unanswered}</strong>{" "}
              unanswered question
              {unanswered > 1 ? "s" : ""}. You can
              continue the test or submit now.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 border-t border-slate-200 p-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Continue Test
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md active:scale-[0.98]"
          >
            <CheckCircle2 size={17} />
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  valueClassName?: string;
}

function StatCard({
  label,
  value,
  valueClassName = "text-slate-900",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-medium text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 text-xl font-bold ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}