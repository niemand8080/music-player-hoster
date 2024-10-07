"use client";
import React, { useEffect, useRef } from "react";

interface NumberInputProps {
  max?: number;
  min?: number;
  defaultValue?: number;
  onChange: (amount: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({
  max = Infinity,
  min = -1,
  defaultValue = 0,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    if (input.value == "") {
      input.value = `${defaultValue}`;
    }
  }, []);

  return (
    <>
      <input
        ref={inputRef}
        type="number"
        max={max}
        min={min}
        placeholder={`${defaultValue}`}
        onChange={() => {
          const value = inputRef.current?.value;
          if (value !== undefined) {
            const cleanedValue = value.replace(/[^\d.-]+/g, "");
            const numberValue = parseFloat(cleanedValue);
            if (!isNaN(numberValue)) {
              onChange(Math.min(numberValue, max));
            }
          }
        }}
        className="h-full w-full rounded-lg border-2 border-gray-600 bg-transparent p-2 outline-none"
      />
    </>
  );
};

export default NumberInput;
