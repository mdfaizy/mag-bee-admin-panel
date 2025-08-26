
// "use client";

// import { Table, TableBody, TableCell, TableHead, TableRow } from "../ui/table";
// import Badge from "../ui/badge/Badge";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { getAllOrders, updateOrderStatus } from "../../services/orders/ResentOrder";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import Input from "../form/input/InputField";
// import Button from "../ui/button/Button";
// import { FiSearch, FiDownload } from "react-icons/fi";

// export default function OrdersTable() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [loading, setLoading] = useState(true);

//   const statusOptions = [
//     { value: "all", label: "All Orders" },
//     { value: "pending", label: "Pending" },
//     { value: "confirmed", label: "Confirmed" },
//     { value: "processing", label: "Processing" },
//     { value: "shipped", label: "Shipped" },
//     { value: "delivered", label: "Delivered" },
//     { value: "cancelled", label: "Cancelled" },
//     { value: "returned", label: "Returned" },
//   ];

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         const result = await getAllOrders();
//         console.log(result)
//         setOrders(result);
//         setFilteredOrders(result);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, []);

//   // Filter orders by search and status
//   useEffect(() => {
//     let result = [...orders];

//     if (statusFilter !== "all") {
//       result = result.filter(order => order.status === statusFilter);
//     }

//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(order =>
//         order.orderCode.toLowerCase().includes(term) ||
//         (order.deliveryAddress.fullName || order.buyer.name).toLowerCase().includes(term) ||
//         order.orderItems.some((item: any) => item.productName.toLowerCase().includes(term))
//       );
//     }

//     setFilteredOrders(result);
//   }, [searchTerm, statusFilter, orders]);

//   // Flatten order items so each item becomes its own row
//   const flattenedOrders = filteredOrders.flatMap(order =>
//     order.orderItems.map((item: any) => ({
//       ...order,
//       item, // this is a single order item
//     }))
//   );

//   const generatePDF = (order: any) => {
//     // Same as your current PDF generation code
    
//     alert("Invoice PDF for full order is generated, not per item.");
//   };

//   const handleStatusChange = async (orderId: string, newStatus: string) => {
//     try {
//       await updateOrderStatus(orderId, newStatus);
//       setOrders(orders.map(order =>
//         order.id === orderId ? { ...order, status: newStatus } : order
//       ));
//     } catch (err) {
//       console.error("Failed to update order status:", err);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "pending": return "warning";
//       case "confirmed": return "primary";
//       case "processing": return "info";
//       case "shipped": return "secondary";
//       case "delivered": return "success";
//       case "cancelled": return "error";
//       case "returned": return "default";
//       default: return "default";
//     }
//   };

//   return (
//     <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//       <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
//         <h3 className="text-lg font-medium text-gray-900">Order Management</h3>

//         <div className="relative w-full sm:w-64">
//           <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input
//             placeholder="Search orders..."
//             className="pl-9"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <Table className="min-w-full divide-y divide-gray-200">
//           <TableHead className="bg-gray-50">
//             <TableRow>
//               <TableCell>Image</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell>Order ID</TableCell>
//               <TableCell>Product</TableCell>
//               <TableCell>Quantity</TableCell>
//               <TableCell>Price</TableCell>
//               <TableCell>Date</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody className="bg-white divide-y divide-gray-200">
//             {loading ? (
//               <TableRow>
//                 <TableCell  className="text-center">Loading orders...</TableCell>
//               </TableRow>
//             ) : flattenedOrders.length === 0 ? (
//               <TableRow>
//                 <TableCell  className="text-center">No orders found</TableCell>
//               </TableRow>
//             ) : (
//               // flattenedOrders.map((entry: any, index: number) => (
//               //   <TableRow key={index} className="hover:bg-gray-50">
//               //    <TableCell>#{entry.item.product.name}</TableCell>

//               //     <TableCell>#{entry.orderCode}</TableCell>
//               //     <TableCell>
//               //       <div>{entry.deliveryAddress.fullName || entry.buyer.name}</div>
//               //       <div className="text-gray-500">{entry.deliveryAddress.phone || entry.buyer.phoneNumber}</div>
//               //     </TableCell>
//               //     <TableCell className="flex items-center gap-2">
//               //       {entry.item.productImage && (
//               //         <Image
//               //           src={entry.item.productImage}
//               //           alt={entry.item.productName}
//               //           width={40}
//               //           height={40}
//               //           className="rounded object-cover"
//               //         />
//               //       )}
//               //       <span>{entry.item.productName}</span>
//               //     </TableCell>
//               //     <TableCell>{entry.item.quantity}</TableCell>
//               //     <TableCell>₹{(parseFloat(entry.item.price) || 0).toFixed(2)}</TableCell>
//               //     <TableCell>{new Date(entry.createdAt).toLocaleDateString()}</TableCell>
//               //     <TableCell>
//               //       <Badge size="sm" color={getStatusColor(entry.status)}>
//               //         {entry.status}
//               //       </Badge>
//               //     </TableCell>
//               //     <TableCell>
//               //       <Button
//               //         variant="outline"
//               //         size="sm"
//               //         className="gap-1"
//               //         onClick={() => generatePDF(entry)}
//               //       >
//               //         <FiDownload className="h-4 w-4" /> Invoice
//               //       </Button>
//               //     </TableCell>
//               //   </TableRow>
//               // ))
//               flattenedOrders.map((entry: any, index: number) => (
//   <TableRow key={index} className="hover:bg-gray-50">
//     {/*   */}
//        <TableCell className="flex items-center gap-2">
//       <Image
//         src={entry.item.product.images?.[0]?.imageUrl || "/placeholder.png"} // ✅ Use fallback if no image
//         alt={entry.item.product.name}
//         width={60}
//         height={60}
//         className="rounded object-cover"
//       />
  
//     </TableCell>
//     <TableCell>{entry.item.product.description}</TableCell>
//     <TableCell>{entry.orderCode}</TableCell>
// <TableCell>{entry.item.product.name}</TableCell>
   

 

//     <TableCell>{entry.item.quantity}</TableCell>
//     <TableCell>₹{(parseFloat(entry.item.price) || 0).toFixed(2)}</TableCell>
//     <TableCell>{new Date(entry.createdAt).toLocaleDateString()}</TableCell>

//     <TableCell>
//       <Badge size="sm" color={getStatusColor(entry.status)}>
//         {entry.status}
//       </Badge>
//     </TableCell>

//     <TableCell>
//       <Button
//         variant="outline"
//         size="sm"
//         className="gap-1"
//         onClick={() => generatePDF(entry)}
//       >
//         <FiDownload className="h-4 w-4" /> Invoice
//       </Button>
//     </TableCell>
//   </TableRow>
// ))

//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }






"use client";

import { Table, TableBody, TableCell, TableHead, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orders/ResentOrder";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { FiSearch, FiDownload, FiEye, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function OrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  // export type BadgeColor = "primary" | "success" | "warning" | "error";

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "returned", label: "Returned" },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const result = await getAllOrders();
        console.log(result)
        setOrders(result);
        setFilteredOrders(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders by search and status
  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.orderCode.toLowerCase().includes(term) ||
        (order.deliveryAddress.fullName || order.buyer.name).toLowerCase().includes(term) ||
        order.orderItems.some((item: any) => item.productName.toLowerCase().includes(term))
      );
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  // Flatten order items so each item becomes its own row
  const flattenedOrders = filteredOrders.flatMap(order =>
    order.orderItems.map((item: any) => ({
      ...order,
      item, // this is a single order item
    }))
  );

  const generatePDF = (order: any) => {
    // Same as your current PDF generation code
    
    alert("Invoice PDF for full order is generated, not per item.");
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "pending": return "warning";
  //     case "confirmed": return "primary";
  //     case "processing": return "info";
  //     case "shipped": return "secondary";
  //     case "delivered": return "success";
  //     case "cancelled": return "error";
  //     case "returned": return "default";
  //     default: return "default";
  //   }
  // };

type BadgeColor = "primary" | "success" | "warning" | "error";

const getStatusColor = (status: string): BadgeColor => {
  switch (status) {
    case "pending":
    case "processing":
      return "warning";
    case "confirmed":
    case "shipped":
      return "primary";
    case "delivered":
      return "success";
    case "cancelled":
    case "returned":
      return "error";
    default:
      return "primary";
  }
};



  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Group items by order for better display
  const ordersWithItems = filteredOrders.map(order => ({
    ...order,
    totalItems: order.orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0),
    totalProducts: order.orderItems.length
  }));

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
        <h3 className="text-lg font-medium text-gray-900">Order Management</h3>

        <div className="flex gap-4">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <TableRow>
                <TableCell  className="text-center py-8">Loading orders...</TableCell>
              </TableRow>
            ) : ordersWithItems.length === 0 ? (
              <TableRow>
                <TableCell  className="text-center py-8">No orders found</TableCell>
              </TableRow>
            ) : (
              ordersWithItems.map((order) => (
                <>
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">#{order.orderCode}</TableCell>
                    
                    <TableCell>
                      <div className="font-medium">{order.deliveryAddress.fullName || order.buyer.name}</div>
                      <div className="text-gray-500 text-sm">{order.deliveryAddress.phone || order.buyer.phoneNumber}</div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {order.orderItems[0]?.product?.images?.[0]?.imageUrl && (
                          <Image
                            src={order.orderItems[0].product.images[0].imageUrl}
                            alt={order.orderItems[0].product.name}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                        )}
                        <span>{order.totalProducts} product(s)</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>{order.totalItems}</TableCell>
                    
                    <TableCell className="font-medium">
                      ₹{(parseFloat(order.totalAmount) || 0).toFixed(2)}
                    </TableCell>
                    
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    
                    <TableCell>
                     <Badge size="sm" color={getStatusColor(order.status)}>
  {order.status}
</Badge>

                    </TableCell>
                    
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => generatePDF(order)}
                        >
                          <FiDownload className="h-4 w-4" /> 
                        </Button>
                        
                        {order.totalProducts > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleOrderExpansion(order.id)}
                          >
                            {expandedOrder === order.id ? (
                              <FiChevronUp className="h-4 w-4" />
                            ) : (
                              <FiChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {expandedOrder === order.id && order.totalProducts > 1 && (
                    <TableRow className="bg-gray-50">
                      <TableCell  className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 mb-2">Order Details:</div>
                        <div className="space-y-3">
                          {order.orderItems.map((item: any, index: number) => (
                            <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                              <div className="flex items-center gap-3">
                                {item.product?.images?.[0]?.imageUrl && (
                                  <Image
                                    src={item.product.images[0].imageUrl}
                                    alt={item.product.name}
                                    width={40}
                                    height={40}
                                    className="rounded object-cover"
                                  />
                                )}
                                <div>
                                  <div className="font-medium">{item.product.name}</div>
                                  <div className="text-gray-500 text-sm">{item.product.description}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div>Qty: {item.quantity}</div>
                                <div className="font-medium">₹{(parseFloat(item.price) || 0).toFixed(2)}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}