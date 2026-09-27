"use client";

import { ClipLoader } from "react-spinners";

type SpinnerProps = {
  size?: number;
  color?: string;
  className?: string;
};

export function Spinner({ size = 20, color = "currentColor", className }: SpinnerProps) {
  return (
    <span className={className} role="status" aria-label="Loading">
      <ClipLoader size={size} color={color} aria-label="Loading" />
    </span>
  );
}

export function PageSpinner() {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center">
      <Spinner size={36} color="#8B7FF7" />
    </div>
  );
}
