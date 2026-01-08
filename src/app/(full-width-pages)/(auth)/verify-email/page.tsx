import { Suspense } from "react";
import VerifyEmailPage from "@/components/auth/EmailVeify";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const dynamic = "force-dynamic"; // 🔥 prevents static prerender

export default function EmailVerify() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Email Verify" />

      <div className="space-y-6">
        <Suspense fallback={<div>Verifying email…</div>}>
          <VerifyEmailPage />
        </Suspense>
      </div>
    </div>
  );
}
