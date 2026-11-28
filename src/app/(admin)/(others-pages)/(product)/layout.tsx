import React from "react";
import type { Metadata } from "next";

// ✅ Simple SEO metadata
export const metadata: Metadata = {
  title: "Product Management",
  description: "Manage products, variants, and inventory in MagBee admin panel.",
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="border-b border-slate-200 bg-white px-4 py-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Catalog / Products
            </p>
            <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-xl">
              Product Management
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-2 py-4 sm:px-4 md:px-6">
        {children}
      </div>
    </div>
  );
}