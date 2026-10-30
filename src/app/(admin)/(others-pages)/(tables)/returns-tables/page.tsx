import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ReturnsTable from "@/components/returns/ReturnsTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Returns",
  description: "Customer return requests",
};

export default function ReturnsTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Returns" />
      <div className="space-y-6">
        <ReturnsTable />
      </div>
    </div>
  );
}
