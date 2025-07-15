import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductTable from "@/components/tables/Product";
export default function ProductCategortTable() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Product List" />
      <div className="space-y-6">
        <ComponentCard title="Product">
          <ProductTable/>
        </ComponentCard>
      </div>
    </div>
  );
}
