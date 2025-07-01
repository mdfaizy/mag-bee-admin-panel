import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import Pro from "@/components/tables/ProductCategoryTable";
// import React from "react";
import ProductTable from "@/components/tables/Product";
export default function ProductCategortTable() {
  return (
    <div>
      <PageBreadcrumb pageTitle="" />
      <div className="space-y-6">
        <ComponentCard title="Categotry">
          <ProductTable/>
        </ComponentCard>
      </div>
    </div>
  );
}
