import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/"); // ya "/dashboard"
    } else {
      router.replace("/signin");
    }
  }, [router]);

  return <p>Redirecting...</p>;
}
