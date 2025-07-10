import RoleCreate from "@/components/auth/RoleCreate";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
export default function RoleForm() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create Role" />
      <div className="space-y-6">
        <RoleCreate/>
      </div>
    </div>
  );
}
