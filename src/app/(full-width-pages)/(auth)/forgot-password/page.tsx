"use client"; 
import ForgotPassword from "@/components/auth/ForgotPassword";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
export default function RoleForm() {
  return (
    <div>
      {/* <PageBreadcrumb pageTitle="Forgot"  /> */}
      <div className="space-y-6">
        <ForgotPassword/>
      </div>
    </div>
  );
}