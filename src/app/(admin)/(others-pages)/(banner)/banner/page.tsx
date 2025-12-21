import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BannerSlider from "@/components/productOffer/OfferSliderFrom";
import React from "react";


export default function ProductForm() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create New Banner" />
      <div className="space-y-6">
        <BannerSlider />
      </div>
    </div>
  );
}
