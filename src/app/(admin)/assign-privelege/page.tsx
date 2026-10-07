import AssignPrivelege from "@/components/auth/AssignPrivelege";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";


export default function RoleForm() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Assign Privillage" />
      <div className="space-y-6">
        <AssignPrivelege/>
      </div>

      
    </div>
  );
}
