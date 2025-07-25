import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "",
  description:
    "",
  // other metadata
};
export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Basic Table" />
      <div className="space-y-6">
          <BasicTableOne />
      </div>
    </div>
  );
}
