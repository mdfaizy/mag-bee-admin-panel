// import Image from "next/image";
// import {getAllOrders} from '../../services/orders/ResentOrder'
// // interface RecentOrderProps {
// //   getAllOrders: any[]; // Backend se aaya hua recent orders array
// // }
// import { useState,useEffect } from "react";


// export default function RecentOrdersList() {
//   const [order,setOrder]=useState([]);

//   const fetchOrder=async()=>{
//     try{
//       const res=await getAllOrders();
//       console.log(res)
//       setOrder(res)
//     }catch(err){
//     console.error(err)
//     }
//   }

//   useEffect(()=>{
//     fetchOrder()
//   },[])
//   return (
//     <div className="space-y-4">
//       {order.map((order) => (
//         <div
//           key={order.id}
//           className="flex flex-col sm:flex-row justify-start items-start sm:items-center border rounded-lg p-4 shadow hover:shadow-lg transition duration-200"
//         >
//           {/* Product Image */}
//           <div className="w-full sm:w-32 h-32 relative flex-shrink-0 mb-3 sm:mb-0">
//             <Image
//               src={order.orderItems[0].productImage}
//               alt={order.orderItems[0].productName}
//               layout="fill"
//               objectFit="cover"
//               className="rounded-md"
//             />
//           </div>

//           {/* Product & Order Details */}
//           <div className="flex-1 sm:ml-4">
//             <h3 className="font-semibold text-gray-800 dark:text-white">
//               {order.orderItems[0].productName}
//             </h3>
//             <p className="text-gray-500 text-sm mt-1">
//               Qty: {order.orderItems[0].quantity}
//             </p>
//             <p className="text-gray-700 font-medium mt-1">
//               ₹{order.totalAmount}
//             </p>

//             {/* Buyer & Address */}
//             <div className="mt-2 text-sm text-gray-500">
//               <p>Buyer: {order.deliveryAddress.fullName || order.buyer.name}</p>
//               <p>Phone: {order.deliveryAddress.phone || order.buyer.phoneNumber}</p>
//               <p>
//                 Address: {order.deliveryAddress.addressLine}, {order.deliveryAddress.city},{" "}
//                 {order.deliveryAddress.state}, {order.deliveryAddress.pincode}
//               </p>
//             </div>

//             {/* Payment & Status */}
//             <div className="mt-2 flex flex-wrap gap-2 items-center">
//               <span className="text-sm text-gray-500">
//                 Payment: {order.paymentMethod} ({order.paymentStatus})
//               </span>
//               <span
//                 className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                   order.status === "confirmed"
//                     ? "bg-yellow-100 text-yellow-800"
//                     : order.status === "delivered"
//                     ? "bg-green-100 text-green-800"
//                     : "bg-red-100 text-red-800"
//                 }`}
//               >
//                 {order.status.toUpperCase()}
//               </span>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }



import Image from "next/image";
import { getAllOrders } from "../../services/orders/ResentOrder";
import { useState, useEffect } from "react";
import { updateOrderStatus } from "../../services/orders/ResentOrder";

interface OrderItem {
  productImage: string;
  productName: string;
  quantity: number;
}

interface Address {
  fullName?: string;
  phone?: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

interface Buyer {
  name: string;
  phoneNumber: string;
}

interface Order {
  id: string;
  orderItems: OrderItem[];
  totalAmount: number;
  deliveryAddress: Address;
  buyer: Buyer;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
}

export default function RecentOrdersList() {
  const [order, setOrder] = useState<Order[]>([]);

  const fetchOrder = async () => {
    try {
      const res = await getAllOrders();
      console.log(res);
      setOrder(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []); // empty dependency array to fetch only once on mount

  return (
    <div className="space-y-4">
      {order.map((order) => (
        <div
          key={order.id}
          className="flex flex-col sm:flex-row justify-start items-start sm:items-center border rounded-lg p-4 shadow hover:shadow-lg transition duration-200"
        >
          <div className="w-full sm:w-32 h-32 relative flex-shrink-0 mb-3 sm:mb-0">
            <Image
              src={order.orderItems?.[0]?.productImage || "/placeholder.png"}
              alt={order.orderItems?.[0]?.productName || "Product Image"}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-md"
            />
          </div>

          <div className="flex-1 sm:ml-4">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {order.orderItems?.[0]?.productName}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Qty: {order.orderItems?.[0]?.quantity}
            </p>
            <p className="text-gray-700 font-medium mt-1">₹{order.totalAmount}</p>

            <div className="mt-2 text-sm text-gray-500">
              <p>Buyer: {order.deliveryAddress?.fullName || order.buyer?.name}</p>
              <p>Phone: {order.deliveryAddress?.phone || order.buyer?.phoneNumber}</p>
              <p>
                Address: {order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city},{" "}
                {order.deliveryAddress?.state}, {order.deliveryAddress?.pincode}
              </p>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500">
                Payment: {order.paymentMethod} ({order.paymentStatus})
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  order.status === "confirmed"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
