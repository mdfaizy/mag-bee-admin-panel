import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductVarientTable from "@/components/tables/ProductVarient";

import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "",
  description:
    "",
 
};

export default function VarientTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Varient Table" />
      <div className="space-y-6">
       
          <ProductVarientTable/>

      </div>
    </div>
  );
}
