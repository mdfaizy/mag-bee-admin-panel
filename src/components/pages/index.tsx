// import { useEffect } from "react";
// import { useRouter } from "next/router";

// export default function Index() {
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("user");
//     if (token) {
//       router.replace("/"); // ya "/dashboard"
//     } else {
//       router.replace("/signin");
//     }
//   }, [router]);

//   return <p>Redirecting...</p>;
// }



"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/"); // 👈 fixed destination
  }, [router]);

  return null;
}
