import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import FormInModal from "@/components/example/ModalExample/FormInModal";

import VerticallyCenteredModal from "@/components/example/ModalExample/VerticallyCenteredModal";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "",
  description:
    "",
  // other metadata
};

export default function Modals() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Modals" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-6">

        <VerticallyCenteredModal />
        <FormInModal />
      
      </div>
    </div>
  );
}
