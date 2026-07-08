"use client";

import axios from "axios";
import { motion } from "framer-motion";
import {
  LoaderCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token } = useParams<{ token: string }>();

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [countdown, setCountdown] = useState(3);

  // Verify Email
  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.post("/api/users/email-verification", {
          token,
        });

        setStatus("success");
        setMessage(
          res.data.message || "Your email has been verified successfully."
        );
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
          "Verification failed. Please try again."
        );
      }
    };

    verifyEmail();
  }, [token]);

  useEffect(() => {
    if (status !== "success") return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status === "success" && countdown === 0) {
      router.replace("/login");
    }
  }, [countdown, status, router]);
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-10 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">

          {/* LOADING */}

          {status === "loading" && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
                className="mb-8"
              >
                <LoaderCircle className="h-16 w-16 text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold text-white">
                Verifying Email
              </h1>

              <p className="mt-4 text-zinc-400 leading-relaxed">
                Please wait while we securely verify your email address.
              </p>

              <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  className="h-full bg-white"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </>
          )}

          {/* SUCCESS */}

          {status === "success" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                }}
              >
                <div className="rounded-full bg-green-500/10 p-5">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
              </motion.div>

              <h1 className="mt-8 text-3xl font-bold text-white">
                Email Verified
              </h1>

              <p className="mt-4 text-zinc-400 leading-relaxed">
                {message}
              </p>

              <div className="mt-8 flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-400">
                  Redirecting in {countdown}s
                </span>
              </div>
            </>
          )}

          {/* ERROR */}

          {status === "error" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                }}
              >
                <div className="rounded-full bg-red-500/10 p-5">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
              </motion.div>

              <h1 className="mt-8 text-3xl font-bold text-white">
                Verification Failed
              </h1>

              <p className="mt-4 text-zinc-400 leading-relaxed">
                {message}
              </p>

              <button
                onClick={() => router.push("/login")}
                className="mt-8 w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 text-white transition-all duration-300 hover:border-zinc-500 hover:bg-zinc-800"
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}
