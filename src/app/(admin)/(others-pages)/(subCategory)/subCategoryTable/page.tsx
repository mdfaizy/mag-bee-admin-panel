import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SubCategoryTable from "@/components/tables/SubCategoryTable";
import React from "react";



export default function SubTable() {
  return (
    <div className="">
      <PageBreadcrumb pageTitle="Sub Category Create" />
      <div className="space-y-6">
        <SubCategoryTable />
      </div>
    </div>
  );
}