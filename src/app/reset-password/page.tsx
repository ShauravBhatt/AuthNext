import { Suspense } from "react";
import ResetPassword from "./reactResetPasswordForm";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="text-center p-3 bg-black text-while">Loading...</div>
      }
    >
      <ResetPassword />
    </Suspense>
  );
}

