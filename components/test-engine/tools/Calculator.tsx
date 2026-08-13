"use client";

import { useState } from "react";
import { Calculator as CalculatorIcon, Delete, X } from "lucide-react";

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Calculator({
  isOpen,
  onClose,
}: CalculatorProps) {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(
    null
  );
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  if (!isOpen) return null;

  const inputNumber = (value: string) => {
    if (waitingForOperand) {
      setDisplay(value);
      setWaitingForOperand(false);
      return;
    }

    setDisplay((current) =>
      current === "0" ? value : current + value
    );
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay((current) => current + ".");
    }
  };

  const clearCalculator = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const calculate = (
    first: number,
    second: number,
    operation: string
  ) => {
    switch (operation) {
      case "+":
        return first + second;

      case "-":
        return first - second;

      case "×":
        return first * second;

      case "÷":
        return second === 0 ? 0 : first / second;

      default:
        return second;
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = Number(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const result = calculate(
        previousValue,
        inputValue,
        operator
      );

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  };

  const handleEquals = () => {
    if (previousValue === null || !operator) {
      return;
    }

    const inputValue = Number(display);

    const result = calculate(
      previousValue,
      inputValue,
      operator
    );

    setDisplay(String(result));
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const deleteLast = () => {
    if (waitingForOperand) return;

    setDisplay((current) => {
      if (current.length <= 1) {
        return "0";
      }

      return current.slice(0, -1);
    });
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close calculator"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      {/* Calculator */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <CalculatorIcon size={18} />
            </div>

            <h2 className="text-sm font-bold text-slate-900">
              Calculator
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close calculator"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>

        {/* Display */}
        <div className="mx-4 mt-4 overflow-hidden rounded-xl bg-slate-900 px-4 py-4">
          <div className="overflow-x-auto text-right">
            <span className="block min-w-full whitespace-nowrap text-2xl font-bold tabular-nums text-white">
              {display}
            </span>
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2 p-4">
          {/* Row 1 */}
          <CalcButton
            label="AC"
            onClick={clearCalculator}
            variant="danger"
          />

          <CalcButton
            label="DEL"
            onClick={deleteLast}
          />

          <CalcButton
            label="÷"
            onClick={() => handleOperator("÷")}
            variant="operator"
          />

          <CalcButton
            label="×"
            onClick={() => handleOperator("×")}
            variant="operator"
          />

          {/* Row 2 */}
          <CalcButton
            label="7"
            onClick={() => inputNumber("7")}
          />

          <CalcButton
            label="8"
            onClick={() => inputNumber("8")}
          />

          <CalcButton
            label="9"
            onClick={() => inputNumber("9")}
          />

          <CalcButton
            label="-"
            onClick={() => handleOperator("-")}
            variant="operator"
          />

          {/* Row 3 */}
          <CalcButton
            label="4"
            onClick={() => inputNumber("4")}
          />

          <CalcButton
            label="5"
            onClick={() => inputNumber("5")}
          />

          <CalcButton
            label="6"
            onClick={() => inputNumber("6")}
          />

          <CalcButton
            label="+"
            onClick={() => handleOperator("+")}
            variant="operator"
          />

          {/* Row 4 */}
          <CalcButton
            label="1"
            onClick={() => inputNumber("1")}
          />

          <CalcButton
            label="2"
            onClick={() => inputNumber("2")}
          />

          <CalcButton
            label="3"
            onClick={() => inputNumber("3")}
          />

          <CalcButton
            label="="
            onClick={handleEquals}
            variant="equals"
          />

          {/* Row 5 */}
          <div className="col-span-2">
            <CalcButton
              label="0"
              onClick={() => inputNumber("0")}
              wide
            />
          </div>

          <CalcButton
            label="."
            onClick={inputDecimal}
          />

          <div />
        </div>
      </div>
    </div>
  );
}

interface CalcButtonProps {
  label: string;
  onClick: () => void;
  variant?: "default" | "operator" | "equals" | "danger";
  wide?: boolean;
}

function CalcButton({
  label,
  onClick,
  variant = "default",
  wide = false,
}: CalcButtonProps) {
  const styles = {
    default:
      "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100",
    operator:
      "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
    equals:
      "border-indigo-600 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md",
    danger:
      "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-12 items-center justify-center rounded-xl border text-sm font-bold transition active:scale-95 ${
        styles[variant]
      } ${wide ? "w-full" : "w-full"}`}
    >
      {label}
    </button>
  );
}