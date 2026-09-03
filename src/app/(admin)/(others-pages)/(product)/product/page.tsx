import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductTable from "@/components/tables/Product";
export default function ProductCategortTable() {
  return (
    <div className="w-full">
      <PageBreadcrumb pageTitle="Product List" />
      <ProductTable />
    </div>
  );
}

