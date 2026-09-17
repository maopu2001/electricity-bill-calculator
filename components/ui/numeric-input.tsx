"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

export interface NumericInputProps
  extends Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> {
  value: number | string;
  onValueChange?: (val: number) => void;
  min?: number;
  max?: number;
  allowDecimals?: boolean;
}

export function NumericInput({
  value,
  onValueChange,
  min = 0,
  max,
  allowDecimals = true,
  placeholder = "0",
  className,
  onWheel,
  onKeyDown,
  ...props
}: NumericInputProps) {
  const numVal = typeof value === "string" ? parseFloat(value) : value;
  const isZeroOrEmpty =
    value === "" || (typeof numVal === "number" && (isNaN(numVal) || numVal === 0));
  const displayVal = isZeroOrEmpty ? "" : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      onValueChange?.(0);
      return;
    }
    const parsed = allowDecimals ? parseFloat(raw) : parseInt(raw, 10);
    if (isNaN(parsed)) {
      onValueChange?.(0);
      return;
    }
    let clamped = Math.max(min, parsed);
    if (max !== undefined) clamped = Math.min(max, clamped);
    onValueChange?.(clamped);
  };

  return (
    <Input
      type="number"
      inputMode={allowDecimals ? "decimal" : "numeric"}
      autoComplete="off"
      min={min}
      max={max}
      value={displayVal}
      placeholder={placeholder}
      onChange={handleChange}
      onWheel={(e) => {
        e.currentTarget.blur();
        onWheel?.(e);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
        }
        onKeyDown?.(e);
      }}
      className={className}
      {...props}
    />
  );
}
