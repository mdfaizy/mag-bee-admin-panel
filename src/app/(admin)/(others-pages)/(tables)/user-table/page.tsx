// import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserTable from "@/components/tables/UserTable";

import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
 
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="User Role Table" />
      <div className="space-y-6">
        {/* <ComponentCard title="User Role Table"> */}
          <UserTable/>
        {/* </ComponentCard> */}
      </div>
    </div>
  );
}
