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
    <div className="w-full border-2">
  <div className="bg-white border-b px-2 py-4">
    <h1 className="text-xl font-semibold text-gray-800">
      Product Management
    </h1>
  </div>

  <div className="w-full px-2 md:px-4">
    {children}
  </div>
</div>

  );
}
