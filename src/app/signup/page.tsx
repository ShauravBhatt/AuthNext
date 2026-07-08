"use client";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (
      user.username.trim().length > 0 &&
      user.email.trim().length > 0 &&
      user.password.trim().length >= 8
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onSignUp = async (e: any) => {
    e.preventDefault();

    try {
      await toast.promise(axios.post("/api/users/signup", user), {
        loading: "Creating your account...",
        success: (res) => res.data?.message,
        error: (err: any) =>
          err.response?.data?.error || "Something went wrong!",
      });

      setTimeout(() => {
            toast.success("Check your inbox for email verification.")
            router.push("/login");
      }, 1500);

    } catch (error: any) {
      console.error(error.message);
    }
  };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center">
          Create Account
        </h1>

        <p className="mt-2 text-center text-zinc-400">Sign up to continue</p>

        <form onSubmit={onSignUp} className="mt-8 space-y-5">
          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Username
            </label>

            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-white"
              placeholder="Enter username"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Email
            </label>

            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-white"
              placeholder="Enter email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Password
            </label>

            <input
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-white"
              placeholder="Enter password"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={buttonDisabled}
            className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
