// import  from "@/components/auth/RoleCreate";
import VerifyEmailPage from "@/components/auth/EmailVeify";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
export default function EmailVerify() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Email Veify" />
      <div className="space-y-6">
        <VerifyEmailPage/>
      </div>
    </div>
  );
}
