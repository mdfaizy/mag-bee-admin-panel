// import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductCategorttable from "../../../../../components/tables/ProductCategory";
import React from "react";
export default function ProductCategortTable() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Product" />
      <div className="space-y-6">
        {/* <ComponentCard title="Product"> */}
          <ProductCategorttable/>
        {/* </ComponentCard> */}
      </div>
    </div>
  );
}
