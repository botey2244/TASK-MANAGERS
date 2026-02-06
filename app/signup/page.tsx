import AuthLayout from "@/components/AuthLayout"
import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Get started with your free account today"
    >
      <SignupForm />
    </AuthLayout>
  )
}
