"use client";

import React from "react";
import { Loader2 } from "lucide-react";

type LoadingVariant = "inline" | "card" | "page" | "overlay" | "table";

interface LoadingStateProps {
  /** "inline" = button/small area | "card" = section box | "page" = full screen | "overlay" = above existing content | "table" = skeleton rows */
  variant?: LoadingVariant;
  label?: string;
  /** Table skeleton row & column count */
  rows?: number;
  columns?: number;
  className?: string;
}

export default function LoadingState({
  variant = "card",
  label = "Loading...",
  rows = 5,
  columns = 6,
  className = "",
}: LoadingStateProps) {
  if (variant === "inline") {
    return (
      <span
        role="status"
        aria-live="polite"
        className={`inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 ${className}`}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-700 dark:text-brand-500" />
        <span>{label}</span>
      </span>
    );
  }

  if (variant === "table") {
    return (
      <>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <tr key={rowIdx} className="animate-pulse">
            {Array.from({ length: columns }).map((__, colIdx) => (
              <td key={colIdx} className="px-4 py-3.5">
                <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  }

  if (variant === "overlay") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-[1px] ${className}`}
      >
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="h-4 w-4 animate-spin text-slate-800 dark:text-brand-500" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200 sm:text-sm">
            {label}
          </span>
        </div>
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`flex min-h-screen items-center justify-center bg-slate-50/80 px-4 dark:bg-slate-950 ${className}`}
      >
        <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="h-5 w-5 animate-spin text-slate-800 dark:text-brand-500" />
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm">
            {label}
          </p>
        </div>
      </div>
    );
  }

  // Default: "card"
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex min-h-[220px] w-full flex-col items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <Loader2 className="h-5 w-5 animate-spin text-slate-800 dark:text-brand-500" />
      <p className="text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm">
        {label}
      </p>
    </div>
  );
}