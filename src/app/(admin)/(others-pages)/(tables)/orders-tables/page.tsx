// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import OrdersTable from "@/components/tables/Orders";
// import { Metadata } from "next";
// import React from "react";
// export const metadata: Metadata = {
//   title: "",
//   description:"",
//   // other metadata
// };
// export default function OrdersTables() {
//   return (
//     <div>
//       <PageBreadcrumb pageTitle="Basic Table" />
//       <div className="space-y-6">
//           <OrdersTable />
//       </div>
//     </div>
//   );
// }


import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OrdersTable from "@/components/tables/Orders";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Orders | Admin Dashboard",
  description:
    "Manage customer orders, track shipments, filter by date or status, and export Excel reports.",
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950">
      <div className="mx-auto max-w-[1600px] px-4 pt-5 sm:px-6 lg:px-8">
        <PageBreadcrumb pageTitle="Orders" />
      </div>
      <OrdersTable />
    </div>
  );
}