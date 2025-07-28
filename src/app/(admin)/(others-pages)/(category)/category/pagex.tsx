import CreateProductCategory from "@/components/productCategory/Category";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";


export default function Category() {
  return (
    <div className="">
      <PageBreadcrumb pageTitle="Create Category" />
      <div className="space-y-6">
        <CreateProductCategory />
      </div>
    </div>
  );
}