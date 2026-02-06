"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8">
      {/* Title */}
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-black">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500">
          Login to your account
        </p>
      </div>

      {/* Form */}
      <form className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
          />

          {/* Forgot password UNDER input */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button className="w-full rounded-xl bg-black text-white hover:bg-gray-900">
          Login
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
