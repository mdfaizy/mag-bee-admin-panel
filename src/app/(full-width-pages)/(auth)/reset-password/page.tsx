"use client"; 
import ResetPassword from "@/components/auth/ResetPassword";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
export default function RoleForm() {
  return (
    <div>
      <PageBreadcrumb pageTitle="" />
      <div className="space-y-6">
        <ResetPassword/>
      </div>
    </div>
  );
}
