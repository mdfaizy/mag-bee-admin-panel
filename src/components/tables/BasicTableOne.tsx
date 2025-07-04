


import {
  Table,
  TableBody,
  TableCell,
    TableHead,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";

// Define the TypeScript interface for the table rows
interface Order {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: string;
  address: string;
  quantity: number;
  ordererName: string;
  ordererMobile: string;
  status: "Delivered" | "Pending" | "Canceled";
}


// Define the table data using the interface
const orders: Order[] = [
  {
    id: 1,
    productId: 101,
    productName: "MacBook Pro 13”",
    productImage: "/images/product/product-01.jpg",
    price: "$2399.00",
    address: "123 Main Street, New York, NY",
    quantity: 1,
    ordererName: "John Doe",
    ordererMobile: "+1 555-1234",
    status: "Delivered",
  },
  {
    id: 2,
    productId: 102,
    productName: "Apple Watch Ultra",
    productImage: "/images/product/product-02.jpg",
    price: "$879.00",
    address: "456 Park Avenue, Los Angeles, CA",
    quantity: 2,
    ordererName: "Jane Smith",
    ordererMobile: "+1 555-5678",
    status: "Pending",
  },
  {
    id: 3,
    productId: 103,
    productName: "iPhone 15 Pro Max",
    productImage: "/images/product/product-03.jpg",
    price: "$1869.00",
    address: "789 Ocean Drive, Miami, FL",
    quantity: 1,
    ordererName: "Alice Johnson",
    ordererMobile: "+1 555-9012",
    status: "Canceled",
  },
];


export default function RecentOrders() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Orders
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
        


<TableHead className="border-gray-100 dark:border-gray-800 border-y">
  <TableRow>
    <TableCell isHeader>Product</TableCell>
    <TableCell isHeader>Price</TableCell>
    <TableCell isHeader>Quantity</TableCell>
    <TableCell isHeader>Address</TableCell>
    <TableCell isHeader>Customer Name</TableCell>
    <TableCell isHeader>Mobile</TableCell>
    <TableCell isHeader>Status</TableCell>
    <TableCell isHeader>Actions</TableCell>
  </TableRow>
</TableHead>

          {/* Table Body */}

         <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
  {orders.map((order) => (
    <TableRow key={order.id}>
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <Image
            src={order.productImage}
            alt={order.productName}
            width={50}
            height={50}
            className="rounded-md"
          />
          <div>
            <p className="font-medium text-gray-800 dark:text-white/90">{order.productName}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400">ID: {order.productId}</span>
          </div>
        </div>
      </TableCell>
      
      <TableCell className="py-3 text-gray-500 dark:text-gray-400">
        {order.price}
      </TableCell>
      
      <TableCell className="py-3 text-gray-500 dark:text-gray-400">
        {order.quantity}
      </TableCell>
      
      <TableCell className="py-3 text-gray-500 dark:text-gray-400">
        {order.address}
      </TableCell>
      
      <TableCell className="py-3 text-gray-500 dark:text-gray-400">
        {order.ordererName}
      </TableCell>
      
      <TableCell className="py-3 text-gray-500 dark:text-gray-400">
        {order.ordererMobile}
      </TableCell>
      
      <TableCell className="py-3">
        <Badge
          size="sm"
          color={
            order.status === "Delivered"
              ? "success"
              : order.status === "Pending"
              ? "warning"
              : "error"
          }
        >
          {order.status}
        </Badge>
      </TableCell>

      <TableCell className="py-3 flex justify-center items-center gap-2">
  <button className="text-blue-600 hover:underline">View</button>
  <button className="text-green-600 hover:underline">Edit</button>
  <button className="text-red-600 hover:underline">Delete</button>
</TableCell>

    </TableRow>
  ))}
</TableBody>

        </Table>
      </div>
    </div>
  );
}
