// import ComponentCard from "@/components/common/ComponentCard";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OfferSliderForm from "@/components/productOffer/OfferSliderFrom";

export default function ProductCategortTable() {
  return (
    <div>
      {/* <PageBreadcrumb pageTitle="Product List" /> */}
      <div className="space-y-6 w-full">
        {/* <ComponentCard title="Product"> */}
          <OfferSliderForm/>
        {/* </ComponentCard> */}
      </div>
    </div>
  );
}
