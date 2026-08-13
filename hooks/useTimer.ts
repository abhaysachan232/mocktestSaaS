"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  initialSeconds: number;
  autoStart?: boolean;
  onComplete?: () => void;
}

export function useTimer({
  initialSeconds,
  autoStart = false,
  onComplete,
}: UseTimerOptions) {
  const [remainingSeconds, setRemainingSeconds] =
    useState(initialSeconds);

  const [isRunning, setIsRunning] = useState(autoStart);

  const completedRef = useRef(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);

          if (!completedRef.current) {
            completedRef.current = true;
            setIsRunning(false);
            onComplete?.();
          }

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isRunning, onComplete]);

  const start = useCallback(() => {
    if (remainingSeconds > 0) {
      completedRef.current = false;
      setIsRunning(true);
    }
  }, [remainingSeconds]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (seconds = initialSeconds) => {
      completedRef.current = false;
      setRemainingSeconds(seconds);
      setIsRunning(false);
    },
    [initialSeconds]
  );

  return {
    remainingSeconds,
    isRunning,
    start,
    pause,
    reset,
  };
}