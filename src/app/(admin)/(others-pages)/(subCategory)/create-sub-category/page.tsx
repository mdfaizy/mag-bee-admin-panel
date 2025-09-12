import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import CreateSubCategory from "@/components/SubCategory/CreateSubCategory";


export default function SubCategory() {
  return (
    <div className="">
      <PageBreadcrumb pageTitle="Sub Category Create" />
      <div className="space-y-6">
        <CreateSubCategory />
      </div>
    </div>
  );
}