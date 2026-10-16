// "use client"; 
// import ResetPassword from "@/components/auth/ResetPassword";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import React from "react";
// export default function RoleForm() {
//   return (
//     <div>
//       <PageBreadcrumb pageTitle="" />
//       <div className="space-y-6">
//         <ResetPassword/>
//       </div>
//     </div>
//   );
// }

"use client";

import { useParams } from "next/navigation";
import ResetPassword from "@/components/auth/ResetPassword";

export default function ResetPasswordPage() {
  const { token } = useParams();

  return <ResetPassword token={token as string} />;
}
