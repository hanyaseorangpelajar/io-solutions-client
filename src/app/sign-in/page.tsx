// src/app/sign-in/page.tsx
"use client";

import { useState } from "react";
import {
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import InputField from "@/components/InputField";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <section className="w-full max-w-md card">
        <div className="flex items-center gap-3 p-4 border-b border-black">
          <div className="btn-icon">
            <span className="font-bold font-mono leading-none tracking-[0.02em] text-[11px]">
              I<span className="px-[1px]">/</span>O
            </span>
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-semibold tracking-[0.2em] uppercase">
              I/O SYSTEM INFORMATION
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-black/60">
              Sign In
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="p-4 sm:p-6 flex flex-col gap-4"
        >
          <InputField
            name="username"
            label="Username"
            placeholder="your.username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            leftIcon={UserIcon}
          />

          <InputField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            leftIcon={LockClosedIcon}
            rightSlot={
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="btn-ghost p-1"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            }
          />

          <div className="flex items-center justify-between text-xs">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="appearance-none size-4 border border-black checked:bg-black"
              />
              <span>Remember me</span>
            </label>
            <a
              href="#"
              className="underline underline-offset-2 hover:no-underline"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="group mt-2 btn gap-2 px-4 py-2"
          >
            <span className="text-sm font-medium">Sign In</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>

          <p className="pt-2 text-[10px] text-black/60">
            Jika mengahadapi kendala hubngi:{" "}
            <a
              href="https://wa.me/6282178520016"
              className="underline hover:no-underline"
            >
              System Admin
            </a>
          </p>
        </form>
      </section>
    </main>
  );
}
