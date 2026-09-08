"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getAttemptAnswers,
  saveAttemptAnswer,
} from "@/actions/test-attempt.actions";

/* =========================================================
   TYPES
========================================================= */

type Answers = Record<string, string[]>;

type QuestionType =
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE";

type SaveStatus =
  | "idle"
  | "saving"
  | "saved"
  | "error";

type ServerAnswer = {
  id: string;
  questionId: string;
  selectedOptionIds: string[];
  isAttempted: boolean;
  markedForReview: boolean;
};

/* =========================================================
   HELPERS
========================================================= */

function normalizeOptions(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value.filter(
        (item): item is string =>
          typeof item === "string" &&
          item.trim().length > 0,
      ),
    ),
  ];
}

function answersFromServer(
  data: ServerAnswer[] | null | undefined,
): Answers {
  if (!Array.isArray(data)) {
    return {};
  }

  const result: Answers = {};

  for (const answer of data) {
    if (
      !answer ||
      typeof answer.questionId !==
        "string"
    ) {
      continue;
    }

    result[answer.questionId] =
      normalizeOptions(
        answer.selectedOptionIds,
      );
  }

  return result;
}

/* =========================================================
   HOOK
========================================================= */

export function useAnswers(
  attemptId: string,
) {
  const [answers, setAnswers] =
    useState<Answers>({});

  const [saveStatus, setSaveStatus] =
    useState<SaveStatus>("idle");

  const [saveError, setSaveError] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  /*
   * -------------------------------------------------------
   * Keep latest answers in a ref.
   *
   * This lets us calculate the next answer synchronously
   * before starting an async save.
   * -------------------------------------------------------
   */

  const answersRef =
    useRef<Answers>({});

  /*
   * -------------------------------------------------------
   * Save queue per question.
   *
   * Every question gets its own promise chain.
   *
   * Example:
   *
   * Q1: A -> B -> C
   * Q2: X -> Y
   *
   * Q1 and Q2 can save independently,
   * but Q1's own saves remain ordered.
   * -------------------------------------------------------
   */

  const saveQueuesRef =
    useRef(
      new Map<
        string,
        Promise<void>
      >(),
    );

  /*
   * -------------------------------------------------------
   * Request generation.
   *
   * Used to prevent an old request from changing the global
   * save status after a newer request has already started.
   * -------------------------------------------------------
   */

  const saveVersionRef =
    useRef(0);

  /*
   * -------------------------------------------------------
   * Mounted state.
   * -------------------------------------------------------
   */

  const mountedRef =
    useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* =======================================================
     LOAD ANSWERS
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadAnswers() {
      if (!attemptId) {
        answersRef.current = {};
        setAnswers({});
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setSaveError(null);
      setSaveStatus("idle");

      /*
       * Reset queues when attempt changes.
       */
      saveQueuesRef.current.clear();
      saveVersionRef.current += 1;

      try {
        const response =
          await getAttemptAnswers(
            attemptId,
          );

        if (cancelled) {
          return;
        }

        if (!response.success) {
          answersRef.current = {};
          setAnswers({});
          setSaveError(
            response.message,
          );
          return;
        }

        const normalized =
          answersFromServer(
            response.data,
          );

        answersRef.current =
          normalized;

        setAnswers(normalized);
      } catch (error) {
        console.error(
          "LOAD_ATTEMPT_ANSWERS_ERROR:",
          error,
        );

        if (!cancelled) {
          answersRef.current = {};
          setAnswers({});
          setSaveError(
            "Unable to load saved answers.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAnswers();

    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  /* =======================================================
     INTERNAL QUEUED SAVE
  ======================================================= */

  const queueAnswerSave =
    useCallback(
      (
        questionId: string,
        selectedOptionIds: string[],
      ) => {
        if (!attemptId) {
          return Promise.resolve();
        }

        const normalized =
          normalizeOptions(
            selectedOptionIds,
          );

        const previousQueue =
          saveQueuesRef.current.get(
            questionId,
          ) ?? Promise.resolve();

        const requestVersion =
          ++saveVersionRef.current;

        const savePromise =
          previousQueue
            .catch(() => {
              /*
               * A failed previous save must not break
               * the queue permanently.
               */
            })
            .then(async () => {
              if (
                !mountedRef.current
              ) {
                return;
              }

              try {
                const response =
                  await saveAttemptAnswer(
                    {
                      attemptId,
                      questionId,
                      selectedOptionIds:
                        normalized,
                    },
                  );

                if (
                  !mountedRef.current
                ) {
                  return;
                }

                /*
                 * Only latest request can update
                 * global status/error.
                 */
                if (
                  requestVersion !==
                  saveVersionRef.current
                ) {
                  return;
                }

                if (
                  !response.success
                ) {
                  setSaveStatus(
                    "error",
                  );

                  setSaveError(
                    response.message,
                  );

                  return;
                }

                setSaveStatus(
                  "saved",
                );

                setSaveError(
                  null,
                );
              } catch (error) {
                console.error(
                  "SAVE_ANSWER_ERROR:",
                  error,
                );

                if (
                  !mountedRef.current
                ) {
                  return;
                }

                if (
                  requestVersion !==
                  saveVersionRef.current
                ) {
                  return;
                }

                setSaveStatus(
                  "error",
                );

                setSaveError(
                  "Unable to save answer.",
                );
              }
            });

        saveQueuesRef.current.set(
          questionId,
          savePromise,
        );

        return savePromise;
      },
      [attemptId],
    );

  /* =======================================================
     SELECT ANSWER
  ======================================================= */

  const selectAnswer =
    useCallback(
      (
        questionId: string,
        optionId: string,
        questionType: QuestionType,
      ) => {
        if (
          !attemptId ||
          !questionId ||
          !optionId
        ) {
          return;
        }

        /*
         * Read latest state synchronously from ref.
         */
        const current =
          normalizeOptions(
            answersRef.current[
              questionId
            ],
          );

        let nextSelectedOptions: string[];

        if (
          questionType ===
          "SINGLE_CHOICE"
        ) {
          /*
           * Single choice always contains exactly
           * the selected option.
           */
          nextSelectedOptions = [
            optionId,
          ];
        } else {
          /*
           * Multiple choice toggles the option.
           */
          const alreadySelected =
            current.includes(
              optionId,
            );

          if (alreadySelected) {
            nextSelectedOptions =
              current.filter(
                (id) =>
                  id !== optionId,
              );
          } else {
            nextSelectedOptions = [
              ...current,
              optionId,
            ];
          }
        }

        /*
         * Update ref FIRST.
         */
        const nextAnswers = {
          ...answersRef.current,
          [questionId]:
            nextSelectedOptions,
        };

        answersRef.current =
          nextAnswers;

        /*
         * Then update React state.
         */
        setAnswers(nextAnswers);

        setSaveStatus("saving");
        setSaveError(null);

        /*
         * Queue this question's save.
         */
        void queueAnswerSave(
          questionId,
          nextSelectedOptions,
        );
      },
      [
        attemptId,
        queueAnswerSave,
      ],
    );

  /* =======================================================
     CLEAR ANSWER
  ======================================================= */

  const clearAnswer =
    useCallback(
      (questionId: string) => {
        if (
          !attemptId ||
          !questionId
        ) {
          return;
        }

        const nextAnswers = {
          ...answersRef.current,
        };

        delete nextAnswers[
          questionId
        ];

        /*
         * Update ref immediately.
         */
        answersRef.current =
          nextAnswers;

        /*
         * Update UI immediately.
         */
        setAnswers(nextAnswers);

        setSaveStatus("saving");
        setSaveError(null);

        /*
         * Empty array means clear answer.
         */
        void queueAnswerSave(
          questionId,
          [],
        );
      },
      [
        attemptId,
        queueAnswerSave,
      ],
    );

  /* =======================================================
     GET ANSWER
  ======================================================= */

  const getAnswer =
    useCallback(
      (
        questionId: string,
      ): string[] => {
        if (!questionId) {
          return [];
        }

        return normalizeOptions(
          answersRef.current[
            questionId
          ],
        );
      },
      [],
    );

  /* =======================================================
     HAS ANSWER
  ======================================================= */

  const hasAnswer =
    useCallback(
      (
        questionId: string,
      ): boolean => {
        if (!questionId) {
          return false;
        }

        return (
          normalizeOptions(
            answersRef.current[
              questionId
            ],
          ).length > 0
        );
      },
      [],
    );

  /* =======================================================
     ATTEMPTED COUNT
  ======================================================= */

  const attempted =
    useMemo(() => {
      const currentAnswers =
        answers ?? {};

      return Object.values(
        currentAnswers,
      ).filter(
        (selectedOptions) =>
          Array.isArray(
            selectedOptions,
          ) &&
          selectedOptions.length >
            0,
      ).length;
    }, [answers]);

  /* =======================================================
     RESET
  ======================================================= */

  const resetAnswers =
    useCallback(() => {
      /*
       * Invalidate pending status updates.
       */
      saveVersionRef.current += 1;

      /*
       * Clear queues.
       */
      saveQueuesRef.current.clear();

      /*
       * Reset source of truth.
       */
      answersRef.current = {};

      /*
       * Reset UI.
       */
      setAnswers({});
      setSaveStatus("idle");
      setSaveError(null);
    }, []);

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    answers,

    selectAnswer,
    clearAnswer,

    getAnswer,
    hasAnswer,

    attempted,

    resetAnswers,

    saveStatus,
    saveError,

    isLoading,
  };
}
