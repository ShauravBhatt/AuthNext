"use client";
import Link from "next/link";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onLogin = () => {};

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center">
          Login Account
        </h1>

        <p className="mt-2 text-center text-zinc-400">Login to continue</p>

        <form className="mt-8 space-y-5">
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
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
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
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-white"
            />
          </div>

          <button
            onClick={onLogin}
            type="submit"
            className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-zinc-200 cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="cursor-pointer text-white hover:underline"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
