"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    isVerified: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await toast.promise(
          axios.get("/api/users/me"),
          {
            loading: "Fetching user data",
            success: (res) =>
              res.data?.message || "User fetched successfully",
            error: (err: any) =>
              err.response?.data?.error || "Failed to fetch user data",
          }
        );

        setUser(response.data.data);
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchUser();
  }, []);

  const onLogout = async () => {
    try {
      await toast.promise(axios.get("/api/users/logout"), {
        loading: "Logging out...",
        success: (res) => res.data?.message || "Logout successful",
        error: (err: any) =>
          err.response?.data?.error || "Something went wrong",
      });
      router.push("/");
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const changePassword = async () => {
    router.push("/change-password");
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            Welcome, {user.username || "User"} 👋
          </h1>

          <p className="mt-2 text-zinc-400">
            Your profile information is shown below.
          </p>
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-500">Username</p>
            <h2 className="mt-1 text-xl font-semibold text-white">
              {user.username || "Loading..."}
            </h2>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-500">Email Address</p>
            <h2 className="mt-1 text-xl font-semibold text-white">
              {user.email || "Loading..."}
            </h2>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-500">Account Status</p>

            {user.isVerified ? (
              <span className="mt-3 inline-flex rounded-full border border-green-600 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
                ✔ Verified
              </span>
            ) : (
              <span className="mt-3 inline-flex rounded-full border border-red-600 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
                ✖ Not Verified
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex gap-4">
          <button
            onClick={changePassword}
            className="flex-1 rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-zinc-200">
            Change Password
          </button>

          <button
            onClick={onLogout}
            className="flex-1 rounded-lg border border-red-600 py-3 font-semibold text-red-400 transition hover:bg-red-600 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
