"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  expiresAt: Date | string | number;
  autoStart?: boolean;
  onComplete?: () => void;
}

interface UseTimerReturn {
  remainingSeconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

function getRemainingSeconds(
  expiresAt: Date | string | number,
): number {
  const expiryTime =
    expiresAt instanceof Date
      ? expiresAt.getTime()
      : typeof expiresAt === "number"
        ? expiresAt
        : new Date(expiresAt).getTime();

  if (!Number.isFinite(expiryTime)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(
      (expiryTime - Date.now()) / 1000,
    ),
  );
}

export function useTimer({
  expiresAt,
  autoStart = false,
  onComplete,
}: UseTimerOptions): UseTimerReturn {
  const [remainingSeconds, setRemainingSeconds] =
    useState(() =>
      getRemainingSeconds(expiresAt),
    );

  const [isRunning, setIsRunning] =
    useState(autoStart);

  const expiresAtRef =
    useRef(expiresAt);

  const completedRef =
    useRef(false);

  const onCompleteRef =
    useRef(onComplete);

  // ==========================================================
  // KEEP LATEST EXPIRY
  // ==========================================================

  useEffect(() => {
    expiresAtRef.current = expiresAt;
  }, [expiresAt]);

  // ==========================================================
  // KEEP LATEST CALLBACK
  // ==========================================================

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // ==========================================================
  // START
  // ==========================================================

  const start = useCallback(() => {
    const remaining =
      getRemainingSeconds(
        expiresAtRef.current,
      );

    if (remaining <= 0) {
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }

      return;
    }

    completedRef.current = false;
    setIsRunning(true);
  }, []);

  // ==========================================================
  // PAUSE
  // ==========================================================

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // ==========================================================
  // RESET
  // ==========================================================

  const reset = useCallback(() => {
    completedRef.current = false;

    const remaining =
      getRemainingSeconds(
        expiresAtRef.current,
      );

    setRemainingSeconds(remaining);

    setIsRunning(
      autoStart && remaining > 0,
    );
  }, [autoStart]);

  // ==========================================================
  // TIMER LOOP
  // ==========================================================

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const tick = () => {
      const nextSeconds =
        getRemainingSeconds(
          expiresAtRef.current,
        );

      setRemainingSeconds(nextSeconds);

      if (nextSeconds <= 0) {
        setIsRunning(false);

        if (!completedRef.current) {
          completedRef.current = true;
          onCompleteRef.current?.();
        }
      }
    };

    // Immediate synchronization.
    tick();

    const intervalId =
      window.setInterval(
        tick,
        1000,
      );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRunning]);

  return {
    remainingSeconds,
    isRunning,
    start,
    pause,
    reset,
  };
}