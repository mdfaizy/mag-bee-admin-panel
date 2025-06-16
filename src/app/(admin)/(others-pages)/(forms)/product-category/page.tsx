import CreateProductCategory from "../../../../../components/tables/OrderTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";


export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Product Category" />
      <div className="space-y-6">
        <CreateProductCategory />
      </div>
    </div>
  );
}
