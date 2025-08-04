"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      {status === "pending" && (
        <>
          <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
          <p className="mt-4 text-lg">Verifying your email...</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="h-10 w-10 text-green-600" />
          <p className="mt-4 text-lg font-semibold">
            Your email was verified successfully!
          </p>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="h-10 w-10 text-red-600" />
          <p className="mt-4 text-lg font-semibold">
            Verification failed. Please check the link or try again later.
          </p>
        </>
      )}
    </div>
  );
}
