import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OrdersTable from "@/components/tables/Orders";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "",
  description:"",
  // other metadata
};
export default function OrdersTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Basic Table" />
      <div className="space-y-6">
          <OrdersTable />
      </div>
    </div>
  );
}
