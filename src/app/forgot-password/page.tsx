"use client"

import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await axios.get("/api/users/me");

        setLoggedIn(true);
        setEmail((prev) => prev ||user.data?.data?.email);
      } catch {
        //User is not loggedIn
      }
    }
    fetchUser();
  }
    , [])

  const handleForgotPassword = async (e: any) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter your email.");
    }

    try {
      setLoading(true);

      const response = await axios.post("/api/users/forgot-password", { email: email.trim().toLowerCase() });

      toast.success(response.data.message);
      setEmailSent(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Unable to send reset link.");
    } finally {
      setLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-5">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">

          <div className="text-5xl">📧</div>

          <h1 className="mt-4 text-3xl font-bold text-white">
            Check Your Email
          </h1>

          <p className="mt-4 text-zinc-400">
            We've sent a password reset link to
          </p>

          <p className="mt-2 font-medium text-white">
            {email}
          </p>

          <p className="mt-6 text-sm text-zinc-500">
            If you don't see the email, check your spam folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

        <h1 className="text-center text-3xl font-bold text-white">
          Forgot Password
        </h1>

        <p className="mt-3 text-center text-zinc-400">
          Enter your email address and we'll send you a password reset link.
        </p>

        <form
          onSubmit={handleForgotPassword}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Email Address
            </label>

            <input
              type="email"
              disabled={loggedIn}
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading || email.trim().length === 0}
            className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
