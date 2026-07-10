"use client"
import { useSearchParams, useRouter } from "next/navigation"
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const buttonDisabled =
    loading ||
    newPassword.trim().length < 8 ||
    confirmPassword.trim().length < 8;

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-5">
        <div className="w-full max-w-md rounded-2xl border border-red-900 bg-zinc-900 p-8 text-center">
          <h1 className="text-3xl font-bold text-red-500">
            Invalid Reset Link
          </h1>

          <p className="mt-4 text-zinc-400">
            This password reset link is missing or invalid.
          </p>
        </div>
      </div>
    );
  }

  const handleResetPassword = async (
    e: any
  ) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      return toast.error("Please fill all fields.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/users/reset-password", { newPassword, token });
      toast.success(res.data.message);

      setTimeout(() => {
        router.push("/login")
      }, 1500)
    } catch (error: any) {

      console.error(error.message);
      toast.error(error.reponse?.data?.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">

        <h1 className="text-center text-3xl font-bold text-white">
          Reset Password
        </h1>

        <p className="mt-2 text-center text-zinc-400">
          Enter your new password below.
        </p>

        <form
          onSubmit={handleResetPassword}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-white"
            />
          </div>

          <button
            type="submit"
            disabled={buttonDisabled}
            className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
