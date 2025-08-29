
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomerTables from "../../../../../components/tables/CustomerTables";
export default function CustomerTable() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Product List" />
      <div className="space-y-6 w-full">
          <CustomerTables/>
        
      </div>
    </div>
  );
}
