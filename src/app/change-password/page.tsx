"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ChangePassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const buttonDisabled =
    loading ||
    oldPassword.trim().length < 8 ||
    newPassword.trim().length < 8;

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    try {
      const response = await axios.get("/api/users/me");

      setEmail(response.data.data.email);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        "Unable to fetch user details."
      );
    }
  }

  async function handleChangePassword(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      return toast.error("Please fill all fields.");
    }

    if (oldPassword === newPassword) {
      return toast.error(
        "New password cannot be the same as the current password."
      );
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "/api/users/change-password",
        {
          oldPassword,
          newPassword,
        }
      );

      toast.success(response.data.message);

      setOldPassword("");
      setNewPassword("");

      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (error: any) {
      if (error.response?.data?.locked) {
        setIsLocked(true);
      }

      toast.error(
        error.response?.data?.message ||
        "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-5">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-center">
          Change Password
        </h1>

        <p className="mt-2 text-center text-sm text-zinc-400">
          Keep your account secure by updating your password.
        </p>

        <form
          onSubmit={handleChangePassword}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              readOnly
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-400 outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Current Password
            </label>

            <input
              type="password"
              placeholder="Enter current password"
              autoComplete="current-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-white"
            />
          </div>

          <button
            type="submit"
            disabled={buttonDisabled}
            className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>

          {isLocked && (
            <div className="rounded-lg border border-red-800 bg-red-950/30 p-4 text-center">
              <p className="text-sm text-red-300">
                Too many failed attempts. You can reset your password instead.
              </p>

              <Link
                href="/forgot-password"
                className="mt-3 inline-block text-sm font-medium text-blue-400 hover:text-blue-300 underline"
              >
                Forgot Password?
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
