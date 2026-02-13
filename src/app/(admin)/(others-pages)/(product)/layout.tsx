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
    <div className="w-full  bg-red-200">
  <div className="bg-white border-b px-6 py-4">
    <h1 className="text-xl font-semibold text-gray-800">
      Product Management
    </h1>
  </div>

  <div className="w-full px-4 md:px-6">
    {children}
  </div>
</div>

  );
}
