"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignupForm() {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8">
      {/* Title */}
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-black">
          Create an account
        </h2>
        <p className="text-sm text-gray-500">
          Get started with your free account today
        </p>
      </div>

      {/* Form */}
      <form className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
          />
        </div>

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
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <Button className="w-full rounded-xl bg-[#2f59a7] text-white hover:bg-[#274b8a]">
          Sign up
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t you have an account?{" "}
          <Link href="/login" className="font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
