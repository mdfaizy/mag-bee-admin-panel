import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductCategorttable from "@/components/tables/OrderTable";
import React from "react";
export default function ProductCategortTable() {
  return (
    <div>
      <PageBreadcrumb pageTitle="" />
      <div className="space-y-6">
        <ComponentCard title="Categotry">
          <ProductCategorttable/>
        </ComponentCard>
      </div>
    </div>
  );
}
