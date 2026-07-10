"use client";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [isLocked, setIsLocked] = useState(false);

  const buttonDisabled =
    user.email.trim().length === 0 ||
    user.password.trim().length < 8;

  const onLogin = async (e: any) => {
    e.preventDefault();

    try {
      await toast.promise(axios.post("/api/users/login", user), {
        loading: "Logging in...",
        success: (res) => res.data.message,
        error: (err: any) =>
          err.response?.data?.message || "Something went wrong!",
      });

      setIsLocked(false);

      setTimeout(() => {
        router.push("/profile");
      }, 1500);

    } catch (error: any) {
      console.error("Login Failed", error.message);
      //toast.error(error.response?.data?.message);
      if (error.response?.data?.locked) {
        setIsLocked(error.response?.data?.locked ?? false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center">
          Login Account
        </h1>

        <p className="mt-2 text-center text-zinc-400">Login to continue</p>

        <form onSubmit={onLogin} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value.toLowerCase() })}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-white"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={user.password}
              autoComplete="current-password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-white"
            />
          </div>

          <button
            type="submit"
            disabled={buttonDisabled}
            className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-zinc-200 cursor-pointer disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
          >
            Login
          </button>
        </form>

        {isLocked && (
          <div className="rounded-lg border mt-3 border-red-800 bg-red-950/30 p-4 text-center">
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

        {!isLocked && (
          <p className="mt-6 text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="cursor-pointer text-white hover:underline"
            >
              Signup
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
