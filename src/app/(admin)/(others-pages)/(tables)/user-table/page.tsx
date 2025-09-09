import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserTable from "@/components/tables/UserTable";

import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "",
  description:
    "",
 
};

export default function UserTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="User Role Table" />
      <div className="space-y-6">
       
          <UserTable/>

      </div>
    </div>
  );
}
