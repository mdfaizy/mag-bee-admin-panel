import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BannerSlider from "../../../../../components/tables/BannerTables";
import React from "react";
export default function BannerTable() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bannner" />
      <div className="space-y-6">
          <BannerSlider/>
      </div>
    </div>
  );
}
