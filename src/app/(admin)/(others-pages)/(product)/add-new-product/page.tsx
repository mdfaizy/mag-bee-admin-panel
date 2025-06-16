// import CreateProductCategory from "../../../../../components/productCategory/Category";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddNewProduct from "@/components/products/AddNewProduct";
import React from "react";


export default function ProductForm() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Product Category" />
      <div className="space-y-6">
        <AddNewProduct />
      </div>

      
    </div>
  );
}
