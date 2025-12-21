import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "",
  description:
    "",
};

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="From Elements" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      
        <div className="space-y-6">
         
        </div>
      </div>
    </div>
  );
}
